---
layout: default
description: ArangoDB exposes its API via HTTP, making the server accessible easily with a variety of clients and tools
redirect_from:
  - async-results-management.html # 3.10 -> 3.10
---
# HTTP request handling in ArangoDB

## Protocol

ArangoDB exposes its API via HTTP, making the server accessible easily with
a variety of clients and tools (e.g. browsers, curl, telnet). The communication
can optionally be SSL-encrypted.

Additionally, there is a custom binary protocol called
[VelocyStream](https://github.com/arangodb/velocystream){:target="_blank"}
which can be used for better throughput. HTTP requests are easily mappable
to VelocyStream and no separate documentation exists as the API is essentially
the same for both network protocols.

ArangoDB uses the standard HTTP methods (e.g. `GET`, `POST`, `PUT`, `DELETE`) plus
the `PATCH` method described in [RFC 5789](http://tools.ietf.org/html/rfc5789){:target="_blank"}.

Most server APIs expect clients to send any payload data in [JSON](http://www.json.org){:target="_blank"}
format or ArangoDB's custom [VelocyPack](https://github.com/arangodb/velocypack)
binary format. Details on the expected format and JSON attributes can be found
in the documentation of the individual API endpoints.

Clients sending requests to ArangoDB must use either of the following protocols:

- HTTP 1.1
- HTTP 2
- VelocyStream

Other HTTP versions or protocols are not supported by ArangoDB.

Clients are required to include the `Content-Length` HTTP header with the
correct content length in every request that can have a body (e.g. `POST`,
`PUT` or `PATCH`) request. ArangoDB will not process requests without a
`Content-Length` header - thus chunked transfer encoding for POST-documents
is not supported.

## HTTP Keep-Alive

ArangoDB supports HTTP keep-alive. If the client does not send a `Connection`
header in its request, ArangoDB will assume the client wants to keep alive the 
connection.
If clients do not wish to use the keep-alive feature, they should
explicitly indicate that by sending a `Connection: Close` HTTP header in
the request.

The default Keep-Alive timeout can be specified at server start using the
`--http.keep-alive-timeout` startup option.

Establishing TCP connections is expensive, since it takes several round-trips
between the communication parties. Therefore you can use connection keep-alive
to send several HTTP request over one TCP-connection;
each request is treated independently by definition. You can use this feature
to build up a so called **connection pool** with several established
connections in your client application, and dynamically re-use
one of those then idle connections for subsequent requests.

## Switch protocols

Connections are initialized expecting the HTTP 1.1 protocol by default. To use
other protocols the client must indicate this to the server so that the
protocol may be switched.

Upgrading to HTTP 2 is supported according to the ways outlined in
[RFC 7540 Section 3](https://tools.ietf.org/html/rfc7540#section-3){:target="_blank"},
from non-encrypted connections as well as encrypted connections.

On non-encrypted connections with `http` scheme in the URI clients may use
HTTP 1.1 initially until an upgrade is performed. Upgrading the connection is
initiated by sending a request with the `Upgrade: h2c` header and exactly one
`HTTP2-Settings` header. The server will then respond with `101 Switching Protocols`
and begin using HTTP/2. See the RFC for details.

For non-encrypted TCP connections ArangoDB also supports
*Starting HTTP/2 with Prior Knowledge*, as specified in
[RFC 7540 Section 3.4](https://tools.ietf.org/html/rfc7540#section-3.4){:target="_blank"}.
The server will check the first 24 octets received over the connection and compare
it to the HTTP 2 connection preface `PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n`, as outlined
in [Section 5](https://tools.ietf.org/html/rfc7540#section-5){:target="_blank"}.

On TLS encrypted connections with `https` scheme in the URI ArangoDB supports the
ALPN extension with the `h2` protocol identifier. This means the connection may
switch to using HTTP/2 right away after a successful TLS handshake.

An upgrade to the VelocyStream protocol may happen by sending `VST/1.1\r\n\r\n`
(11 octets) to the server _before_ sending anything else. The server will then
start using VelocyStream 1.1. Sending anything else is an error.

## Request execution

ArangoDB supports both blocking and non-blocking HTTP requests.
Clients can choose the appropriate method on a per-request level based on their
throughput, control flow, and durability requirements.

### Blocking execution

ArangoDB is a multi-threaded server, allowing the processing of multiple
client requests at the same time. Communication handling and the actual work can
be performed by multiple worker threads in parallel.

Still, clients need to wait for their requests to be processed by the server,
and thus keep one connection of a pool occupied.
By default, the server fully processes an incoming request and then returns
the result to the client when the operation has finished. The client must
wait for the server's HTTP response before it can send additional requests over
the same connection. For clients that are single-threaded, or blocking on I/O
themselves, or both, it may not be optimal to wait idle for the full server response.

Furthermore, note that even if the client closes the HTTP connection, the request
running on the server still continues until it completes and only then notices
that the client no longer listens for the result.
Thus closing the connection does not help to abort a long running query.

### Non-blocking execution

You can let ArangoDB execute requests asynchronously in two different ways:

- Submit requests for async execution, without the ability to cancel requests
  or access the results ("Fire and forget")

- Submit requests for async execution and let the server store the results for
  later retrieval

### Fire and forget

To reduce blocking on the client-side, ArangoDB offers a generic mechanism for
non-blocking, asynchronous execution: clients can add a `x-arango-async: true`
HTTP header to any of their requests, marking them as to be executed
asynchronously on the server.

ArangoDB puts asynchronous requests into an in-memory job queue and instantly
returns an HTTP `202 Accepted` status code to the client and thus finishes this
HTTP request. The server executes the jobs from the queue asynchronously as fast
as possible, while clients can continue to do other work.

If the server queue is full (i.e. contains as many jobs as specified by the
[`--server.maximal-queue-size`](../programs-arangod-options.html#arangodb-server-options)
startup option), then the request is rejected instantly with an HTTP
`503 Service Unavailable` status code.

Asynchronous execution decouples the request/response handling from the actual
work to be performed, allowing fast server responses and greatly reducing wait
time for clients. Overall this allows for much higher throughput than if
clients would always wait for the server's response.

Keep in mind that the asynchronous execution is just "fire and forget".
Clients get any of their asynchronous requests answered with a generic
HTTP `202 Accepted` response. At the time the server sends this response, it does
not know whether the requested operation can be carried out successfully, as the
actual operation execution happens at some later point. Therefore, clients
cannot make a decision based on the server response and must rely on their
requests being valid and processable by the server.

Additionally, the server's asynchronous job queue is an in-memory data
structure, meaning not-yet processed jobs from the queue are lost in
case of a crash. Client will not know whether they were processed or not and
should therefore not use the asynchronous feature when they have strict
durability requirements or if they rely on the immediate result of the request
they send.

Finally, note that it is not possible to cancel such a fire and forget job,
since you don't get any handle to identify it later on. If you need to cancel
requests, use
[Async execution and later result retrieval](#async-execution-and-later-result-retrieval).

### Async execution and later result retrieval

By adding a `x-arango-async: store` HTTP header to a request, clients can instruct
the ArangoDB server to execute the operation asynchronously but also store the
operation result in memory for a later retrieval. The server returns a job ID in
the `x-arango-async-id` HTTP response header. The client can use this ID in
conjunction with the `/_api/job` endpoint to access the result. See the
[HTTP interface for jobs](jobs.html) for details.

Clients can ask the ArangoDB server via the async jobs API which results are
ready for retrieval, and which are not. Clients can also use the async jobs API to
retrieve the original results of an already executed async job by passing it the
originally returned job ID. The server then returns the job result as if the job was 
executed normally. Furthermore, clients can cancel running async jobs by
their job ID.

ArangoDB keeps all results of jobs initiated with the `x-arango-async: store`
header. Results are removed from the server only if a client explicitly asks the
server for a specific result.

The async jobs API also provides methods for garbage collection that clients can
use to get rid of "old", not fetched results. Clients should call this method periodically
because ArangoDB does not artificially limit the number of not-yet-fetched results.

It is thus a client responsibility to store only as many results as needed and to fetch
available results as soon as possible, or at least to clean up not fetched results
from time to time.

The job queue and the results are kept in-memory only on the server, which means
they are lost in case of a crash.

#### Canceling asynchronous jobs

A running async query can internally be executed by C++ code or by JavaScript
code. For example, CRUD operations are executed directly in C++, whereas AQL
queries and transactions may be executed by JavaScript code, depending on the
AQL functions and the transaction type you use. The job cancelation only works
for JavaScript code, since the mechanism used is simply to trigger an uncatchable
exception in the JavaScript thread, which is caught on the C++ level, which in
turn leads to the cancelation of the job. No result can be retrieved later
because all data about the request is discarded.

If you cancel a job running on a Coordinator of a cluster, then only the code
running on the Coordinator is stopped. There may remain tasks within the cluster
which have already been distributed to the DB-Servers and it is not possible to
cancel them as well.

#### Async execution and authentication

If a request requires authentication, the authentication procedure is run before 
queueing. The request is only queued if the authentication is successful. If the
Otherwise, it is not queued but rejected instantly in the same way as a regular,
non-queued request.

## Error handling

The following should be noted about how ArangoDB handles client errors in its
HTTP layer:

- client requests using an HTTP version signature different than `HTTP/1.0` or
  `HTTP/1.1` will get an **HTTP 505** (HTTP Version Not Supported) error in return.
- ArangoDB will reject client requests with a negative value in the
  `Content-Length` request header by closing the connection.
- ArangoDB doesn't support POST with `Transfer-Encoding: chunked` which forbids
  the `Content-Length` header above.
- the maximum URL length accepted by ArangoDB is 16K. Incoming requests with
  longer URLs will be rejected with an **HTTP 414** (Request-URI too long) error.
- if the client sends a `Content-Length` header with a value bigger than 0 for
  an HTTP GET, HEAD, or DELETE request, ArangoDB will process the request, but
  will write a warning to its log file.
- when the client sends a `Content-Length` header that has a value that is lower
  than the actual size of the body sent, ArangoDB will respond with **HTTP 400**
  (Bad Request).
- if clients send a `Content-Length` value bigger than the actual size of the
  body of the request, ArangoDB will wait for about 90 seconds for the client to
  complete its request. If the client does not send the remaining body data
  within this time, ArangoDB will close the connection. Clients should avoid
  sending such malformed requests as this will block one TCP connection,
  and may lead to a temporary file descriptor leak.
- when clients send a body or a `Content-Length` value bigger than the maximum
  allowed value (1 GB), ArangoDB will respond with **HTTP 413** (Payload Too Large).
- if the overall length of the HTTP headers a client sends for one request
  exceeds the maximum allowed size (1 MB), the server will fail with **HTTP 431**
  (Request Header Fields Too Large).
- if clients request an HTTP method that is not supported by the server, ArangoDB
  will return with **HTTP 405** (Method Not Allowed). ArangoDB offers general
  support for the following HTTP methods:
  - GET
  - POST
  - PUT
  - DELETE
  - HEAD
  - PATCH
  - OPTIONS

  Please note that not all server actions allow using all of these HTTP methods.
  You should look up the supported methods for each method you intend to use
  in the manual.

  Requests using any other HTTP method (such as for example CONNECT, TRACE etc.)
  will be rejected by ArangoDB as mentioned before.
- if the backend is temporarily unavailable, the server will return **HTTP 503**
  (Service Unavailable). Common circumstances are:
  - during server start or shutdown, when the network port is open but the HTTP
    service is not available
  - when the queue is full
  - when a Coordinator cannot reach a DB-Server

  Clients may retry requests but they might not be idempotent.

## Cross-Origin Resource Sharing (CORS) requests

ArangoDB automatically handles CORS requests as described below.

### Preflight

When a browser is told to make a cross-origin request that includes explicit
headers, credentials or uses HTTP methods other than `GET` or `POST`, it will
first perform a so-called preflight request using the `OPTIONS` method.

ArangoDB will respond to `OPTIONS` requests with an HTTP 200 status response
with an empty body. Since preflight requests are not expected to include or
even indicate the presence of authentication credentials even when they will
be present in the actual request, ArangoDB does not enforce authentication for
`OPTIONS` requests even when authentication is enabled.

ArangoDB will set the following headers in the response:

- `access-control-allow-credentials`: will be set to `false` by default.
  For details on when it will be set to `true` see the next section on cookies.

- `access-control-allow-headers`: will be set to the exact value of the
  request's `access-control-request-headers` header or omitted if no such
  header was sent in the request.

- `access-control-allow-methods`: will be set to a list of all supported HTTP
  headers regardless of the target endpoint. In other words that a method is
  listed in this header does not guarantee that it will be supported by the
  endpoint in the actual request.

- `access-control-allow-origin`: will be set to the exact value of the
  request's `origin` header.

- `access-control-expose-headers`: will be set to a list of response headers used
  by the ArangoDB HTTP API.

- `access-control-max-age`: will be set to an implementation-specific value.

### Actual request

If a request using any other HTTP method than `OPTIONS` includes an `origin` header,
ArangoDB will add the following headers to the response:

- `access-control-allow-credentials`: will be set to `false` by default.
  For details on when it will be set to `true` see the next section on cookies.

- `access-control-allow-origin`: will be set to the exact value of the
  request's `origin` header.

- `access-control-expose-headers`: will be set to a list of response headers used
  by the ArangoDB HTTP API.

When making CORS requests to endpoints of Foxx services, the value of the
`access-control-expose-headers` header will instead be set to a list of
response headers used in the response itself (but not including the
`access-control-` headers). Note that
[Foxx services may override this behavior](../foxx-guides-browser.html#cross-origin-resource-sharing-cors).

### Cookies and authentication

In order for the client to be allowed to correctly provide authentication
credentials or handle cookies, ArangoDB needs to set the
`access-control-allow-credentials` response header to `true` instead of `false`.

ArangoDB will automatically set this header to `true` if the value of the
request's `origin` header matches a trusted origin in the `http.trusted-origin`
configuration option. To make ArangoDB trust a certain origin, you can provide
a startup option when running `arangod` like this:

`--http.trusted-origin "http://localhost:8529"`

To specify multiple trusted origins, the option can be specified multiple times.
Alternatively you can use the special value `"*"` to trust any origin:

`--http.trusted-origin "*"`

Note that browsers will not actually include credentials or cookies in cross-origin
requests unless explicitly told to do so:

- When using the Fetch API you need to set the
  [`credentials` option to `include`](https://fetch.spec.whatwg.org/#cors-protocol-and-credentials){:target="_blank"}.

  ```js
  fetch("./", { credentials:"include" }).then(/* … */)
  ```

- When using `XMLHttpRequest` you need to set the
  [`withCredentials` option to `true`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials){:target="_blank"}.

  ```js
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://example.com/', true);
  xhr.withCredentials = true;
  xhr.send(null);
  ```

- When using jQuery you need to set the `xhrFields` option:

  ```js
  $.ajax({
     url: 'https://example.com',
     xhrFields: {
        withCredentials: true
     }
  });
  ```

## HTTP method overriding

{% hint 'warning' %}
HTTP method overriding is deprecated from version 3.9.0 on and should no longer
be used.
{% endhint %}

ArangoDB provides a startup option *--http.allow-method-override*.
This option can be set to allow overriding the HTTP request method (e.g. GET, POST,
PUT, DELETE, PATCH) of a request using one of the following custom HTTP headers:

- `x-http-method-override`
- `x-http-method`
- `x-method-override`

This allows using HTTP clients that do not support all "common" HTTP methods such as
PUT, PATCH and DELETE. It also allows bypassing proxies and tools that would otherwise
just let certain types of requests (e.g. GET and POST) pass through.

Enabling this option may impose a security risk, so it should only be used in very
controlled environments. Thus the default value for this option is *false* (no method
overriding allowed). You need to enable it explicitly if you want to use this
feature.

## Load-balancer support

When running in cluster mode, ArangoDB exposes some APIs which store request
state data on specific Coordinator nodes, and thus subsequent requests which
require access to this state must be served by the Coordinator node which owns
this state data. In order to support function behind a load-balancer, ArangoDB
can transparently forward requests within the cluster to the correct node. If a
request is forwarded, the response will contain the following custom HTTP header
whose value will be the ID of the node which actually answered the request:

- `x-arango-request-forwarded-to`

The following APIs may use request forwarding:

- `/_api/control_pregel`
- `/_api/cursor`
- `/_api/job`
- `/_api/replication`
- `/_api/query`
- `/_api/tasks`
- `/_api/transaction`

Note: since forwarding such requests requires an additional cluster-internal HTTP
request, they should be avoided when possible for best performance. Typically
this is accomplished either by directing the requests to the correct Coordinator
at a client-level or by enabling request "stickiness" on a load balancer. Since
these approaches are not always possible in a given environment, we support the
request forwarding as a fall-back solution.

Note: some endpoints which return "global" data, such as `GET /_api/tasks` will
only return data corresponding to the server on which the request is executed.
These endpoints will generally not work well with load-balancers.

## Overload control

<small>Introduced in: v3.9.0</small>

_arangod_ returns an `x-arango-queue-time-seconds` HTTP
header with all responses. This header contains the most recent request
queueing/dequeuing time (in seconds) as tracked by the server's scheduler.
This value can be used by client applications and drivers to detect server
overload and react on it.

The arangod startup option `--http.return-queue-time-header` can be set to
`false` to suppress these headers in responses sent by arangod.

In a cluster, the value returned in the `x-arango-queue-time-seconds` header
is the most recent queueing/dequeuing request time of the Coordinator the
request was sent to, except if the request is forwarded by the Coordinator to
another Coordinator. In that case, the value will indicate the current
queueing/dequeuing time of the forwarded-to Coordinator.

In addition, client applications and drivers can optionally augment the
requests they send to arangod with the header `x-arango-queue-time-seconds`.
If set, the value of the header should contain the maximum server-side
queuing time (in seconds) that the client application is willing to accept.
If the header is set in an incoming request, arangod will compare the current
dequeuing time from its scheduler with the maximum queue time value contained
in the request header. If the current queueing time exceeds the value set
in the header, arangod will reject the request and return HTTP 412
(precondition failed) with the error code 21004 (queue time violated). 
Using a value of 0 or a non-numeric value in the header will lead to the
header value being ignored by arangod.

There is also a metric `arangodb_scheduler_queue_time_violations_total`
that is increased whenever a request is dropped because of the requested
queue time not being satisfiable. Administrators can use this metric to monitor
overload situations. Although all instance types will expose this metric,
it will likely always be `0` on DB-Servers and Agency instances because the
`x-arango-queue-time-seconds` header is not used in cluster-internal requests.

In a cluster, the `x-arango-queue-time-seconds` request header will be
checked on the receiving Coordinator, before any request forwarding. If the
request is forwarded by the Coordinator to a different Coordinator, the
receiving Coordinator will also check the header on its own.
Apart from that, the header will not be included in cluster-internal requests
executed by the Coordinator, e.g. when the Coordinator issues sub-requests
to DB-Servers or Agency instances.

## Respond to liveliness probes

<small>Introduced in: v3.10.0</small>

By default, the HTTP REST interface of an _arangod_ instance is opened late
during the startup sequence. The instance responds with HTTP 503
(Service unavailable) until all REST APIs are available and usable.

You can optionally start the HTTP REST interface early in the startup sequence
by setting the `--server.early-connections` startup option to `true`.
This configuration allows an instance to respond to a limited set of REST APIs
during the startup, even during the recovery procedure. This can be useful
because the recovery procedure can take time proportional to the amount of data
to be recovered.

The following APIs can reply early with an HTTP 200 status:

- `GET /_api/version` and `GET /_admin/version`:
  These APIs return the server version number, but can also be used as a
  liveliness probe, to check if the instance is responding to incoming HTTP requests.
- `GET /_admin/status`:
  This API returns information about the instance's status, including the recovery
  progress and information about which server feature is currently starting.

During the early startup phase, all APIs other than the ones listed above are
responded to with an HTTP response code 503, so that callers can see that the
instance is not fully ready yet.

If `--server.authentication` is enabled, then only JWT authentication can be
used during the early startup phase. Incoming requests relying on other
authentication mechanisms that require access to the database data
(e.g. HTTP basic authentication) are also responded to with HTTP 503 errors,
even if correct credentials are used. This is because access to the database
data is not possible early during the startup.

The `GET /_admin/status` API now also returns startup and recovery information.
This can be used to determine the instance's progress during startup. The new
`progress` attribute will be returned inside the `serverInfo` object with the
following sub-attributes:

- `phase`:
  Name of the lifecycle phase the instance is currently in. Normally one of
  `"in prepare"`, `"in start"`, `"in wait"`, `"in shutdown"`, `"in stop"`,
  or `"in unprepare"`.
- `feature`:
  Internal name of the feature that is currently being prepared, started,
  stopped or unprepared.
- `recoveryTick`:
  Current recovery sequence number value, if the instance is currently recovering.
  If the instance is already past the recovery, this attribute contains the
  last handled recovery sequence number.

The exact values of these attributes should not be relied on, i.e. client
applications should not check for any exact values in them. Feature and phase
names are subject to change between different versions of ArangoDB.
The progress attributes can still be used to determine whether the instance has made
progress between two calls: if `phase`, `feature`, and `recoveryTick` don't
change, then there hasn't been progress. Note that this is only true if the
instance is still starting up. Once the instance has fully started and has
opened the complete REST interface, the values in the `progress` attribute are
expected to not change until shutdown.

Note that the `maintenance` attribute in responses to `GET /_admin/status` can
still be used to determine whether the instance is fully available for arbitrary
requests.
