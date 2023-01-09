---
fileID: java-reference-setup
title: Driver setup
weight: 3880
description: 
layout: default
---
Setup with default configuration, this automatically loads a properties file
`arangodb.properties` if exists in the classpath:

{{< tabs >}}
{{% tab name="java" %}}
```java
// this instance is thread-safe
ArangoDB arangoDB = new ArangoDB.Builder().build();
```
{{% /tab %}}
{{< /tabs >}}

The driver is configured with some default values:

| property-key             | description                             | default value  |
|--------------------------|-----------------------------------------| -------------- |
| arangodb.hosts           | ArangoDB hosts                          | 127.0.0.1:8529 |
| arangodb.timeout         | connect & request timeout (millisecond) | 0              |
| arangodb.user            | Basic Authentication User               | root           |
| arangodb.password        | Basic Authentication Password           |                |
| arangodb.jwt             | Authentication JWT                      |                |
| arangodb.useSsl          | use SSL connection                      | false          |
| arangodb.chunksize       | VelocyStream Chunk content-size (bytes) | 30000          |
| arangodb.connections.max | max number of connections               | 1 VST, 20 HTTP |
| arangodb.protocol        | used network protocol                   | VST            |

To customize the configuration the parameters can be changed in the code...

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .host("192.168.182.50", 8888)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

... or with a custom properties file (my.properties)

{{< tabs >}}
{{% tab name="java" %}}
```java
InputStream in = MyClass.class.getResourceAsStream("my.properties");
ArangoDB arangoDB = new ArangoDB.Builder()
  .loadProperties(in)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

Example for arangodb.properties:

{{< tabs >}}
{{% tab name="" %}}
```
arangodb.hosts=127.0.0.1:8529,127.0.0.1:8529
arangodb.user=root
arangodb.password=
```
{{% /tab %}}
{{< /tabs >}}

## Network protocol

The drivers default used network protocol is the binary protocol VelocyStream
which offers the best performance within the driver. To use HTTP, you have to
set the configuration `useProtocol` to `Protocol.HTTP_JSON` for HTTP with JSON
content or `Protocol.HTTP_VPACK` for HTTP with
[VelocyPack](https://github.com/arangodb/velocypack/blob/master/VelocyPack.md) content.

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .useProtocol(Protocol.VST)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

In addition to set the configuration for HTTP you have to add the
apache httpclient to your classpath.

{{< tabs >}}
{{% tab name="xml" %}}
```xml
<dependency>
  <groupId>org.apache.httpcomponents</groupId>
  <artifactId>httpclient</artifactId>
  <version>4.5.1</version>
</dependency>
```
{{% /tab %}}
{{< /tabs >}}

**Note**: If you are using ArangoDB 3.0.x you have to set the protocol to
`Protocol.HTTP_JSON` because it is the only one supported.

## SSL

To use SSL, you have to set the configuration `useSsl` to `true` and set a `SSLContext`
(see [example code](https://github.com/arangodb/arangodb-java-driver/blob/master/src/test/java/com/arangodb/example/ssl/SslExample.java)).

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .useSsl(true)
  .sslContext(sc)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

No additional configuration is required to use TLSv1.3 (if available on the
server side), but a JVM that supports it is required (OpenJDK 11 or later, or
distributions of Java 8 with TLSv1.3 support).

## Connection Pooling

The driver supports connection pooling for VelocyStream with a default of 1 and
HTTP with a default of 20 maximum connections per host. To change this value
use the method `maxConnections(Integer)` in `ArangoDB.Builder`.

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .maxConnections(8)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

The driver does not explicitly release connections. To avoid exhaustion of
resources when no connection is needed, you can clear the connection pool
(close all connections to the server) or use [connection TTL](#connection-time-to-live).

{{< tabs >}}
{{% tab name="java" %}}
```java
arangoDB.shutdown();
```
{{% /tab %}}
{{< /tabs >}}

{{% hints/info %}}
Opening and closing connections very frequently can exhaust the amount of
connections allowed by the operating system. TCP connections enter a special
state `WAIT_TIME` after close, and typically remain in this state for two
minutes (maximum segment life * 2). These connections count towards the global
limit, which depends on the operating system but is usually around 28,000.
Connections should thus be reused as much as possible.

You may run into this problem if you bypass the driver's safe guards by
setting a very high connection limit or by using multiple ArangoDB objects
and thus pools.
{{% /hints/info %}}


## Thread Safety

The driver can be used concurrently by multiple threads. All the following classes are thread safe:
- `com.arangodb.ArangoDB`
- `com.arangodb.ArangoDatabase`
- `com.arangodb.ArangoCollection`
- `com.arangodb.ArangoGraph`
- `com.arangodb.ArangoVertexCollection`
- `com.arangodb.ArangoEdgeCollection`
- `com.arangodb.ArangoView`
- `com.arangodb.ArangoSearch`

Any other class should not be considered thread safe. In particular classes representing request options (package 
`com.arangodb.model`) and response entities (package `com.arangodb.entity`) are not thread safe.


## Fallback hosts

The driver supports configuring multiple hosts. The first host is used to open a
connection to. When this host is not reachable the next host from the list is used.
To use this feature just call the method `host(String, int)` multiple times.

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .host("host1", 8529)
  .host("host2", 8529)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

Since version 4.3 the driver support acquiring a list of known hosts in a
cluster setup or a single server setup with followers. For this the driver has
to be able to successfully open a connection to at least one host to get the
list of hosts. Then it can use this list when fallback is needed. To use this
feature just pass `true` to the method `acquireHostList(boolean)`.

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .acquireHostList(true)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

## Load Balancing

Since version 4.3 the driver supports load balancing for cluster setups in
two different ways.

The first one is a round robin load balancing where the driver iterates
through a list of known hosts and performs every request on a different
host than the request before.

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .loadBalancingStrategy(LoadBalancingStrategy.ROUND_ROBIN)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

Just like the Fallback hosts feature the round robin load balancing strategy
can use the `acquireHostList` configuration to acquire a list of all known hosts
in the cluster. Do so only requires the manually configuration of only one host.
Because this list is updated frequently it makes load balancing over the whole
cluster very comfortable.

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .loadBalancingStrategy(LoadBalancingStrategy.ROUND_ROBIN)
  .acquireHostList(true)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

The second load balancing strategy allows to pick a random host from the
configured or acquired list of hosts and sticks to that host as long as the
connection is open. This strategy is useful for an application - using the driver -
which provides a session management where each session has its own instance of
`ArangoDB` build from a global configured list of hosts. In this case it could
be wanted that every sessions sticks with all its requests to the same host but
not all sessions should use the same host. This load balancing strategy also
works together with `acquireHostList`.

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .loadBalancingStrategy(LoadBalancingStrategy.ONE_RANDOM)
  .acquireHostList(true)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

## Active Failover

In case of an _Active Failover_ deployment the driver should be configured in
the following way:
- the load balancing strategy must be either set to `LoadBalancingStrategy.NONE`
  or not set at all, since that would be the default
- `acquireHostList` should be set to `true`

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .loadBalancingStrategy(LoadBalancingStrategy.NONE)
  .acquireHostList(true)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

## Connection time to live

Since version 4.4 the driver supports setting a TTL (time to life) in milliseconds
for connections managed by the internal connection pool.

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arango = new ArangoDB.Builder()
  .connectionTtl(5 * 60 * 1000)
  .build();
```
{{% /tab %}}
{{< /tabs >}}

In this example all connections will be closed/reopened after 5 minutes.

Connection TTL can be disabled setting it to `null`:

{{< tabs >}}
{{% tab name="java" %}}
```java
.connectionTtl(null)
```
{{% /tab %}}
{{< /tabs >}}

The default TTL is `null` (no automatic connection closure).


## VST Keep-Alive

Since version 6.8 the driver supports setting keep-alive interval (in seconds)
for VST connections. If set, every VST connection will perform a no-op request
at the specified intervals, to avoid to be closed due to inactivity by the
server (or by the external environment, e.g. firewall, intermediate routers,
operating system, ... ).

This option can be set using the key `arangodb.connections.keepAlive.interval`
in the properties file or programmatically from the driver builder:

{{< tabs >}}
{{% tab name="java" %}}
```java
ArangoDB arangoDB = new ArangoDB.Builder()
  .keepAliveInterval(1800) // 30 minutes
  .build();
```
{{% /tab %}}
{{< /tabs >}}

If not set or set to `null` (default), no keep-alive probes will be sent.
