---
layout: default
description: ArangoDB Server HTTP Options
---
# ArangoDB Server HTTP Options

## Keep-alive timeout

`--http.keep-alive-timeout`

Allows to specify the timeout for HTTP keep-alive connections. The timeout
value must be specified in seconds.
Idle keep-alive connections will be closed by the server automatically
when the timeout is reached. A keep-alive-timeout value 0 will disable the keep
alive feature entirely.

## Queue time header

<small>Introduced in: v3.9.0</small>

`--http.return-queue-time-header`

If *true*, the server will return the `x-arango-queue-time-seconds` HTTP
header with all responses. The value contained in this header indicates the
current queueing/dequeuing time for requests in the scheduler (in seconds).
Client applications and drivers can use this value to control the server
load and also react on overload.

Setting the option to `false` will make arangod not return the HTTP header
in responses.

The default value is *true*.

## Hide Product header

`--http.hide-product-header`

If *true*, the server will exclude the HTTP header "Server: ArangoDB" in
HTTP responses. If set to *false*, the server will send the header in
responses.

The default is *false*.

## Allow method override

`--http.allow-method-override`

When this option is set to *true*, the HTTP request method will optionally
be fetched from one of the following HTTP request headers if present in
the request:

- *x-http-method*
- *x-http-method-override*
- *x-method-override*

If the option is set to *true* and any of these headers is set, the
request method will be overridden by the value of the header. For example,
this allows issuing an HTTP DELETE request which to the outside world will
look like an HTTP GET request. This allows bypassing proxies and tools that
will only let certain request types pass.

Setting this option to *true* may impose a security risk so it should only
be used in controlled environments.

The default value for this option is *false*.
