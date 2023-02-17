---
layout: default
description: The ArangoDB server can listen for incoming requests on multiple endpoints
---
# ArangoDB Server _Server_ Options

## Managing Endpoints

The ArangoDB server can listen for incoming requests on multiple *endpoints*.

The endpoints are normally specified either in ArangoDB's configuration file or
on the command-line like `--server.endpoint`. ArangoDB supports different
types of endpoints:

- `tcp://ipv4-address:port` - TCP/IP endpoint, using IPv4
- `tcp://[ipv6-address]:port` - TCP/IP endpoint, using IPv6
- `ssl://ipv4-address:port` - TCP/IP endpoint, using IPv4, SSL encryption
- `ssl://[ipv6-address]:port` - TCP/IP endpoint, using IPv6, SSL encryption
- `unix:///path/to/socket` - Unix domain socket endpoint

If a TCP/IP endpoint is specified without a port number, then the default port
(8529) will be used. If multiple endpoints need to be used, the option can be
repeated multiple times.

The default endpoint for ArangoDB is `tcp://127.0.0.1:8529` or
`tcp://localhost:8529`.

**Examples**

```
unix> ./arangod --server.endpoint tcp://127.0.0.1:8529
                --server.endpoint ssl://127.0.0.1:8530
                --ssl.keyfile server.pem /tmp/vocbase
2019-05-06T07:30:42Z [9228] INFO ArangoDB 3.4.5 [linux] 64bit, using jemalloc, build tags/v3.4.5-0-g648fbb8191, VPack 0.1.33, RocksDB 5.16.0, ICU 58.1, V8 5.7.492.77, OpenSSL 1.1.0j  20 Nov 2018
2019-05-06T07:30:43Z [9228] INFO {authentication} Jwt secret not specified, generating...
2019-05-06T07:30:43Z [9228] INFO using storage engine rocksdb
2019-05-06T07:30:43Z [9228] INFO {cluster} Starting up with role SINGLE
2019-05-06T07:50:53Z [9228] INFO {syscall} file-descriptors (nofiles) hard limit is 1048576, soft limit is 1048576
2019-05-06T07:50:53Z [9228] INFO {authentication} Authentication is turned on (system only), authentication for unix sockets is turned on
2019-05-06T07:30:43Z [9228] INFO using endpoint 'http+tcp://127.0.0.1:8529' for non-encrypted requests
2019-05-06T07:30:43Z [9228] INFO using endpoint 'http+ssl://127.0.0.1:8530' for ssl-encrypted requests
2019-05-06T07:30:44Z [9228] INFO ArangoDB (version 3.4.5 [linux]) is ready for business. Have fun!
```

Given a hostname:

`--server.endpoint tcp://hostname:port`

Given an IPv4 address:

`--server.endpoint tcp://ipv4-address:port`

Given an IPv6 address:

`--server.endpoint tcp://[ipv6-address]:port`

On one specific ethernet interface each port can only be bound **exactly
once**. You can look up your available interfaces using the *ifconfig* command
on Linux / macOS - the Windows equivalent is *ipconfig* (see
[Wikipedia for more details](http://en.wikipedia.org/wiki/Ifconfig){:target="_blank"}).
The general names of the interfaces differ on OS's and hardwares they run on.
However, typically every host has a so called
[loopback interface](http://en.wikipedia.org/wiki/Loop_device){:target="_blank"},
which is a virtual interface. By convention it always has the address
*127.0.0.1* or *::1* (ipv6), and can only be reached from exactly the very same
host. Ethernet interfaces usually have names like *eth0*, *wlan0*, *eth1:17*,
*le0* or a plain text name in Windows.

To find out which services already use ports (so ArangoDB can't bind them
anymore), you can use the
[netstat command](http://en.wikipedia.org/wiki/Netstat){:target="_blank"}
(it behaves a little different on each platform, run it with *-lnpt* on Linux,
*-p tcp* on macOS or with *-an* on windows for valuable information).

ArangoDB can also do a so called *broadcast bind* using
*tcp://0.0.0.0:8529*. This way it will be reachable on all interfaces of the
host. This may be useful on development systems that frequently change their
network setup like laptops.

### Special note on IPv6 link-local addresses

ArangoDB can also listen to IPv6 link-local addresses via adding the zone ID
to the IPv6 address in the form `[ipv6-link-local-address%zone-id]`. However,
what you probably instead want is to bind to a local IPv6 address. Local IPv6
addresses start with `fd`. If you only see a `fe80:` IPv6 address in your
interface configuration but no IPv6 address starting with `fd` your interface
has no local IPv6 address assigned. You can read more about IPv6 link-local
addresses [here](https://en.wikipedia.org/wiki/Link-local_address#IPv6){:target="_blank"}.

**Example**

Bind to a link-local and local IPv6 address.

    unix> ifconfig

This command lists all interfaces and assigned ip addresses. The link-local
address may be `fe80::6257:18ff:fe82:3ec6%eth0` (IPv6 address plus interface name).
A local IPv6 address may be `fd12:3456::789a`. To bind ArangoDB to it start
*arangod* with `--server.endpoint tcp://[fe80::6257:18ff:fe82:3ec6%eth0]:8529`.
Use telnet to test the connection.

    unix> telnet fe80::6257:18ff:fe82:3ec6%eth0 8529
    Trying fe80::6257:18ff:fe82:3ec6...
    Connected to my-machine.
    Escape character is '^]'.
    GET / HTTP/1.1

    HTTP/1.1 301 Moved Permanently
    Location: /_db/_system/_admin/aardvark/index.html
    Content-Type: text/html
    Server: ArangoDB
    Connection: Keep-Alive
    Content-Length: 197

    <html><head><title>Moved</title></head><body><h1>Moved</h1><p>This page has moved to <a href="/_db/_system/_admin/aardvark/index.html">/_db/_system/_admin/aardvark/index.html</a>.</p></body></html>

### Reuse address

`--tcp.reuse-address`

If this boolean option is set to *true* then the socket option SO_REUSEADDR is
set on all server endpoints, which is the default. If this option is set to
*false* it is possible that it takes up to a minute after a server has
terminated until it is possible for a new server to use the same endpoint
again. This is why this is activated by default.

Please note however that under some operating systems this can be a security
risk because it might be possible for another process to bind to the same
address and port, possibly hijacking network traffic. Under Windows, ArangoDB
additionally sets the flag SO_EXCLUSIVEADDRUSE as a measure to alleviate this
problem.

### Backlog size

`--tcp.backlog-size`

Allows to specify the size of the backlog for the *listen* system call The
default value is 10. The maximum value is platform-dependent. Specifying a
higher value than defined in the system header's SOMAXCONN may result in a
warning on server start. The actual value used by *listen* may also be silently
truncated on some platforms (this happens inside the *listen* system call).

## Maximal queue size

Maximum size of the queue for requests: `--server.maximal-queue-size
size`

Specifies the maximum *size* of the queue for asynchronous task
execution. If the queue already contains *size* tasks, new tasks will
be rejected until other tasks are popped from the queue. Setting this
value may help preventing an instance from being overloaded or from
running out of memory if the queue is filled up faster than the server
can process requests.

## Scheduler queue unavailable fill grade

<small>Introduced in: v3.7.6</small>

The startup option `--server.unavailability-queue-fill-grade` can be used
to set a high-watermark for the scheduler's queue fill grade, from which
onwards the server will start reporting unavailability via its availability
API.

This option has a consequence for the `/_admin/server/availability` REST API
only, which is often called by load-balancers and other availability probing
systems.

The `/_admin/server/availability` REST API will return HTTP 200 if the fill
grade of the scheduler's queue is below the configured value, or HTTP 503 if
the fill grade is equal to or above it. This can be used to flag a server as
unavailable in case it is already highly loaded.

The default value for this option is `1`, i.e. 100%.

To prevent sending more traffic to an already overloaded server, it can be
sensible to reduce the default value to even `0.5`.
This would mean that instances with a queue longer than 50% of their
maximum queue capacity would return HTTP 503 instead of HTTP 200 when their
availability API is probed.

## Storage engine

ArangoDB's storage engine is based on [RocksDB](http://rocksdb.org){:target="_blank"}
and the only available engine in ArangoDB v3.7 and above.

The legacy storage engine called MMFiles was [removed](appendix-deprecated.html).

One storage engine type is supported per server per installation.
Live switching of storage engines on already installed systems isn't supported.
Configuring the wrong engine (not matching the previously used one) will result
in the server refusing to start. You may however use `auto` to let ArangoDB
choose the previously used one.

`--server.storage-engine [auto|rocksdb]`

Note that `auto` defaults to `rocksdb`.

## Enable/disable authentication

{% docublock server_authentication %}

## JWT Secrets

`--server.jwt-secret-keyfile <file-with-secret>`

ArangoDB will use JSON Web Tokens to authenticate requests. Using this option
lets you specify a JWT secret stored in a file. The secret must be at most
64 bytes long.

{% hint 'warning' %}
Avoid whitespace characters in the secret because they may get trimmed,
leading to authentication problems:
- Character Tabulation (`\t`, U+0009)
- End of Line (`\n`, U+000A)
- Line Tabulation (`\v`, U+000B)
- Form Feed (`\f`, U+000C)
- Carriage Return (`\r`, U+000D)
- Space (U+0020)
- Next Line (U+0085)
- No-Nreak Space (U+00A0)
{% endhint %}

In single server setups ArangoDB will generate a secret if none was specified.

In cluster deployments which have authentication enabled a secret must
be set consistently across all cluster nodes so they can talk to each other.

ArangoDB also supports an option `--server.jwt-secret <secret>` to pass the
secret directly (without a file), however this is discouraged for security
reasons.

### Multiple Secrets

<small>Introduced in: v3.7.0</small>

{% include hint-ee.md feature="Support for multiple secrets" %}

You may use multiple secrets, where the _active_ secret is used to sign new
JWT tokens and all other _passive_ secrets are just used to validate incoming
JWT tokens.

`--server.jwt-secret-folder <folder-with-secrets>`

The list of files in this folder is sorted alphabetically. The first is used
as the _active_ secret to sign new tokens. All other secrets are passively
used during verification. Only one secret needs to verify a JWT token for it
to be accepted.

### Hot-Reload of JWT Secrets

<small>Introduced in: v3.7.0</small>

{% include hint-ee.md feature="Hot-reloading of secrets" %}

JWT secrets can be reloaded from disk without restarting the server or the
nodes of a cluster deployment. It is supported for both, single keyfiles
and secret folders (multiple secrets).

This may be used to roll out new JWT secrets throughout an ArangoDB cluster.
See [General HTTP Request Handling](http/general.html#hot-reload-of-jwt-secrets).

## Enable/disable authentication for UNIX domain sockets

`--server.authentication-unix-sockets value`

Setting *value* to true will turn off authentication on the server side
for requests coming in via UNIX domain sockets. With this flag enabled,
clients located on the same host as the ArangoDB server can use UNIX domain
sockets to connect to the server without authentication.
Requests coming in by other means (e.g. TCP/IP) are not affected by this option.

The default value is *false*.

**Note**: this option is only available on platforms that support UNIX
domain sockets.

## Enable/disable authentication for system API requests only

{% docublock serverAuthenticateSystemOnly %}

## Enable authentication cache timeout

`--server.authentication-timeout value`

Sets the cache timeout to *value* (in seconds). This is only necessary
if you use an external authentication system like LDAP.

## Enable local authentication

`--server.local-authentication value`

If set to *false* only use the external authentication system. If
*true* also use the local *_users* collections.

The default value is *true*.

## Server threads

`--server.minimal-threads number`

`--server.maximal-threads number`

Specifies the *number* of threads that are spawned to handle requests.

The actual number of request processing threads is adjusted dynamically at runtime
and will float between `--server.minimal-threads` and `--server.maximal-threads`.

`--server.minimal-threads` determines the minimum number of request processing
threads the server will start and that will always be kept around. The default
value is *2*.

`--server.maximal-threads` determines the maximum number of request processing
threads the server is allowed to start for request handling. If that number of
threads is already running, arangod will not start further threads for request
handling. The default value is `max(64, 2 * available cores)`, so twice the
number of CPU cores but at least 64 threads.

## Toggling server statistics

`--server.statistics`

If this option's value is *false*, then ArangoDB's statistics gathering
is turned off. Statistics gathering causes regular background CPU activity,
memory usage and writes to the storage engine, so using this option to turn
statistics off might relieve heavily-loaded instances a bit.

A side effect of setting this option to *false* is that no statistics will be
shown in the dashboard of ArangoDB's web interface, and that the REST API for
server statistics at `/_admin/statistics` will return HTTP 404.

`--server.statistics-history`

If this option's value is *false*, then ArangoDB's statistics gathering
is turned off. Statistics gathering causes regular background CPU activity,
memory usage and writes to the storage engine, so using this option to turn
statistics off might relieve heavily-loaded instances a bit.

When setting this option to *false*, no statistics will be shown in the
dashboard of ArangoDB's web interface, but the current statistics are available
and can be queries using the REST API for server statistics at `/_admin/statistics`.

This is less intrusive than setting the `--server.statistics` option to
*false*.

## Data source flush synchronization

`--server.flush-interval`

ArangoDB will periodically ensure that all data sources (databases, views, etc.)
have flushed all committed data to disk and write some checkpoint data to aid in
future recovery. Increasing this value will result in fewer, larger write
batches, while decreasing it will result in more, smaller writes. Setting the
value too low can easily overwhelm the server, while setting the value too high
may result in high memory usage and periodic slowdowns. Value is given in
microseconds, with a typical range of 100000 (100ms) to 10000000 (10s) and a
default of 1000000 (1s). Use caution when changing from the default.

## Metrics API

`--server.export-metrics-api`

Enables or disables the
[Metrics HTTP API](http/administration-and-monitoring-metrics.html#metrics-api).
