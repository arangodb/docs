---
layout: default
description: ArangoDB Server Clusters Options
---
# ArangoDB Server Clusters Options

## Agency endpoint

<!-- arangod/Cluster/ClusterFeature.h -->

List of agency endpoints:

`--cluster.agency-endpoint <endpoint>`

An agency endpoint the server can connect to. The option can be specified
multiple times, so the server can use a cluster of agency servers.
Endpoints have the following pattern:

- `tcp://ipv4-address:port` - TCP/IP endpoint, using IPv4
- `tcp://[ipv6-address]:port` - TCP/IP endpoint, using IPv6
- `ssl://ipv4-address:port` - TCP/IP endpoint, using IPv4, SSL encryption
- `ssl://[ipv6-address]:port` - TCP/IP endpoint, using IPv6, SSL encryption

At least one endpoint must be specified or ArangoDB will refuse to start.
It is recommended to specify at least two endpoints so ArangoDB has an
alternative endpoint if one of them becomes unavailable.

**Examples**

```
--cluster.agency-endpoint tcp://192.168.1.1:4001 --cluster.agency-endpoint tcp://192.168.1.2:4002 ...
```

## My address

<!-- arangod/Cluster/ClusterFeature.h -->

This server's address / endpoint:

`--cluster.my-address <endpoint>`

The server's endpoint for cluster-internal communication. If specified, it
must have the following pattern:

- `tcp://ipv4-address:port` - TCP/IP endpoint, using IPv4
- `tcp://[ipv6-address]:port` - TCP/IP endpoint, using IPv6
- `ssl://ipv4-address:port` - TCP/IP endpoint, using IPv4, SSL encryption
- `ssl://[ipv6-address]:port` - TCP/IP endpoint, using IPv6, SSL encryption

If no *endpoint* is specified, the server will look up its internal
endpoint address in the agency. If no endpoint can be found in the agency
for the server's id, ArangoDB will refuse to start.

**Examples**

Listen only on interface with address `192.168.1.1`:

```
--cluster.my-address tcp://192.168.1.1:8530
```

Listen on all ipv4 and ipv6 addresses, which are configured on port `8530`:

```
--cluster.my-address ssl://[::]:8530
```

## My advertised endpoint

<!-- arangod/Cluster/ClusterFeature.h -->

This server's advertised endpoint
(e.g. external IP address or load balancer, optional):

`--cluster.my-advertised-endpoint <endpoint>`

This servers's endpoint for external communication. If specified, it
must have the following pattern:

- `tcp://ipv4-address:port` - TCP/IP endpoint, using IPv4
- `tcp://[ipv6-address]:port` - TCP/IP endpoint, using IPv6
- `ssl://ipv4-address:port` - TCP/IP endpoint, using IPv4, SSL encryption
- `ssl://[ipv6-address]:port` - TCP/IP endpoint, using IPv6, SSL encryption

If no *advertised endpoint* is specified, no external endpoint will be advertised.

**Examples**

If an external interface is available to this server, it can be
specified to communicate with external software / drivers:

```
--cluster.my-advertised-endpoint tcp://some.public.place:8530
```

All specifications of endpoints apply.

## My role

<!-- arangod/Cluster/ClusterFeature.h -->

This server's role:

`--cluster.my-role <dbserver|coordinator>`

The server's role. Is this instance a DBServer (backend data server)
or a Coordinator (frontend server for external and application access).

## Require existing ID

Require an existing server id:

`--cluster.require-persisted-id <bool>`

If set to true, then the instance will only start if a UUID file is found 
in the database on startup. Setting this option will make sure the instance 
is started using an already existing database directory from a previous
start, and not a new one. For the first start, the UUID file must either be 
created manually in the database directory, or the option must be set to 
false for the initial startup and only turned on for restarts.

## More advanced options

{% hint 'warning' %}
When multiple Coordinators are used, the following options should have identical
values on all Coordinators.
{% endhint %}

<!-- arangod/Cluster/ClusterFeature.h -->

**Maximum number of shards**

`--cluster.max-number-of-shards <integer>`

Maximum number of shards than can be configured when creating new collections.
The default value is `1000`.
When changing the value of this setting and restarting servers, no changes will be 
applied to existing collections that would violate the new setting.

**Force one shard**

`--cluster.force-one-shard <bool>`

{% hint 'info' %}
This feature is only available in the
[**Enterprise Edition**](https://www.arangodb.com/why-arangodb/arangodb-enterprise/){:target="_blank"},
also available as [**managed service**](https://www.arangodb.com/managed-service/){:target="_blank"}.
{% endhint %}

When set to `true`, forces the cluster into creating all future collections with 
only a single shard and using the same database server as these collections' 
shards leader. 
All collections created this way will be eligible for specific AQL query optimizations
that can improve query performance and provide advanced transactional guarantees.

**Synchronous replication minimum timeout**

`--cluster.synchronous-replication-timeout-minimum <double>`

{% hint 'warning' %}
This option should generally remain untouched and only changed with great care.
{% endhint %}

<small>Introduced in: v3.4.8, v3.5.1</small>

The minimum timeout in seconds for the internal synchronous replication
mechanism between DBServers. If replication requests are slow, but the servers
are otherwise healthy, timeouts can cause followers to be dropped
unnecessarily, resulting in costly resync operations. Increasing this value may
help avoid such resyncs. Conversely, decreasing it may cause more resyncs,
while lowering the latency of individual write operations. Default at `30.0`
seconds.

**Synchronous replication timeout scaling**

`--cluster.synchronous-replication-timeout-factor <double>`

{% hint 'warning' %}
This option should generally remain untouched and only changed with great care.
{% endhint %}

Stretch or clinch timeouts for internal synchronous replication mechanism
between DBServers. All such timeouts are affected by this change.
Default at `1.0`.

**System replication factor**

`--cluster.system-replication-factor <integer>`

Change default replication factor for system collections. Default at `2`.

**Minimum replication factor**

`--cluster.min-replication-factor <integer>`

Minimum replication factor that needs to be used when creating new collections.
The default value is `1`.
When changing the value of this setting and restarting servers, no changes will be
applied to existing collections that would violate the new setting.

**Maximum replication factor**

`--cluster.max-replication-factor <integer>`

Maximum replication factor that can be used when creating new collections.
The default value is `10`.
When changing the value of this setting and restarting servers, no changes will be
applied to existing collections that would violate the new setting.

**Default replication factor**

`--cluster.default-replication-factor <integer>`

Default replication factor to be used implicit for new collections when no 
replication factor is set. 
If this value is not set, it will default to the value of the option
`--cluster.min-replication-factor`. If set, the value must be between the
values of `--cluster.min-replication-factor` and `--cluster.max-replication-factor`.
Note that the replication factor can still be adjusted per collection. This 
value is only the default value used for new collections when no replication factor 
is specified when creating a collection.

**Write concern**

`--cluster.write-concern <integer>`

Default minimum number of copies of data for new collections required for the collection 
to be considered "in sync". If a collection has less in-sync copies than specified by
this value, the collection will turn into read-only mode until enough copies are created.
This value is the default value for the required minimum number of copies when creating
new collections. It can still be adjusted per collection.
The default value for this option is `1`. The value must be smaller or equal compared 
to the replication factor. 
