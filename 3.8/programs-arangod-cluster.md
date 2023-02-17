---
layout: default
description: ArangoDB Server Clusters Options
---
# ArangoDB Server Clusters Options

## Agency endpoint

<!-- arangod/Cluster/ClusterFeature.h -->

List of Agency endpoints:

`--cluster.agency-endpoint <endpoint>`

An Agency endpoint the server can connect to. The option can be specified
multiple times, so the server can use a cluster of Agency servers.
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
endpoint address in the Agency. If no endpoint can be found in the Agency
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

The server's role. Is this instance a DB-Server (backend data server)
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

## API JWT policy

<small>Introduced in: v3.8.0</small>

Control the access permissions for the `/_admin/cluster` REST API endpoints:

`--cluster.api-jwt-policy <string>`

This security option controls whether extra access permissions for the
`/_admin/cluster` REST API endpoints should be enabled.

The possible values for the option are:

- `jwt-all`: requires a valid JWT for all accesses to `/_admin/cluster` and
  its sub-routes. If this configuration is used, the _CLUSTER_ and _NODES_
  sections of the web interface will be disabled, as they are relying on the
  ability to read data from several cluster APIs.
- `jwt-write`: requires a valid JWT for write accesses (all HTTP methods
  except HTTP GET) to `/_admin/cluster`. This setting can be used to allow
  privileged users to read data from the cluster APIs, but not to do any
  modifications. Modifications (carried out by write accesses) are then only
  possible by requests with a valid JWT.
  All existing permission checks for the cluster API routes are still in effect
  with this setting, meaning that read operations without a valid JWT may still
  require dedicated other permissions (as in v3.7).
- `jwt-compat`: no *additional* access checks are in place for the cluster
  API. However, all existing permissions checks for the cluster API routes
  are still in effect with this setting, meaning that all operations may
  still require dedicated other permissions (as in v3.7).

The default value for the option is `jwt-compat`, which means that this option
will not cause any extra JWT checks compared to v3.7.

## Upgrade

Toggle cluster upgrade mode on a Coordinator:

`--cluster.upgrade <string>`

The following values can be used for the options:

- `auto`: perform a cluster upgrade and shut down afterwards if the startup
  option `--database.auto-upgrade` is set to true. Otherwise, do not perform
  an upgrade.
- `disable`: never perform a cluster upgrade, regardless of the value of
  `--database.auto-upgrade`.
- `force`: always perform a cluster upgrade and shut down, regardless of the
  value of `--database.auto-upgrade`.
- `online`: always perform a cluster upgrade but don't shut down afterwards

The default value is `auto`. The option only affects Coordinators. It does not have
any affect on single servers, Agents or DB-Servers.

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

When changing the value of this setting and restarting servers, no changes will
be applied to existing collections that would violate the new setting.

The option only affects Coordinators. It does not have any affect on single servers,
Agents or DB-Servers.

**Force OneShard**

`--cluster.force-one-shard <bool>`

{% include hint-ee-arangograph.md feature="This option" %}

When set to `true`, forces the cluster into creating all future collections with 
only a single shard and using the same DB-Server as these collections' 
shards leader. 
All collections created this way will be eligible for specific AQL query optimizations
that can improve query performance and provide advanced transactional guarantees.

The option only affects Coordinators. It does not have any affect on single servers,
Agents or DB-Servers.

**Synchronous replication minimum timeout**

<small>Introduced in: v3.4.8, v3.5.1</small>

`--cluster.synchronous-replication-timeout-minimum <double>`

{% hint 'warning' %}
This option should generally remain untouched and only changed with great care.
{% endhint %}

The minimum timeout in seconds for the internal synchronous replication
mechanism between DB-Servers. If replication requests are slow, but the servers
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
between DB-Servers. All such timeouts are affected by this change.
Default at `1.0`.

**System replication factor**

`--cluster.system-replication-factor <integer>`

Change default replication factor for system collections. Default at `2`.

The option only affects Coordinators. It does not have any affect on single servers,
Agents or DB-Servers.

**Minimum replication factor**

`--cluster.min-replication-factor <integer>`

Minimum replication factor that needs to be used when creating new collections.
The default value is `1`.
When changing the value of this setting and restarting servers, no changes will be
applied to existing collections that would violate the new setting.

The option only affects Coordinators. It does not have any affect on single servers,
Agents or DB-Servers.

**Maximum replication factor**

`--cluster.max-replication-factor <integer>`

Maximum replication factor that can be used when creating new collections.
The default value is `10`.
When changing the value of this setting and restarting servers, no changes will be
applied to existing collections that would violate the new setting.

The option only affects Coordinators. It does not have any affect on single servers,
Agents or DB-Servers.

**Default replication factor**

`--cluster.default-replication-factor <integer>`

Default replication factor to be used implicit for new collections when no
replication factor is set.

If this value is not set, it will default to the value of the option
`--cluster.min-replication-factor`. If set, the value must be between the
values of `--cluster.min-replication-factor` and
`--cluster.max-replication-factor`. Note that the replication factor can still
be adjusted per collection. This value is only the default value used for new
collections when no replication factor is specified when creating a collection.

The option only affects Coordinators. It does not have any affect on single servers,
Agents or DB-Servers.

**Write concern**

`--cluster.write-concern <integer>`

Sets the global default write concern. Used by databases as default, which in
turn is used by collections as default.

Also see:
- [Database HTTP API](http/database-database-management.html#create-database)
- [Collection HTTP API](http/collection-creating.html#create-collection)
