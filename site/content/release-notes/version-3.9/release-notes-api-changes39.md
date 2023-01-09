---
fileID: release-notes-api-changes39
title: API Changes in ArangoDB 3.9
weight: 11535
description: 
layout: default
---
<small>Introduced in: v3.9.6</small>

The metrics endpoints include the following new edge cache (re-)filling metrics:

- `rocksdb_cache_auto_refill_loaded_total`
- `rocksdb_cache_auto_refill_dropped_total`
- `rocksdb_cache_full_index_refills_total`

### Endpoints moved

#### Cluster API redirects

Since ArangoDB 3.7, some cluster APIs were made available under different
paths. The old paths were left in place and simply redirected to the new
address. These redirects have now been removed in ArangoDB 3.9.

The following list shows the old, now dysfunctional paths and their
replacements:

- `/_admin/clusterNodeVersion`: replaced by `/_admin/cluster/nodeVersion`
- `/_admin/clusterNodeEngine`: replaced by `/_admin/cluster/nodeEngine`
- `/_admin/clusterNodeStats`: replaced by `/_admin/cluster/nodeStatistics`
- `/_admin/clusterStatistics`: replaced by `/_admin/cluster/statistics`

Using the replacements will work from ArangoDB 3.7 onwards already, so
any client applications that still call the old addresses can be adjusted
to call the new addresses from 3.7 onwards.

### Endpoints deprecated

The REST API endpoint GET `/_api/replication/logger-follow` is deprecated
since ArangoDB 3.4.0 and will be removed in a future version. Client
applications should use the endpoint `/_api/wal/tail` instead, which is
available since ArangoDB 3.3. This is a reminder to migrate to the other
endpoint.

### Endpoints removed

#### Redirects

The following API redirect endpoints have been removed in ArangoDB 3.9.
These endpoints have been only been redirections since ArangoDB 3.7. Any
caller of these API endpoints should use the updated endpoints:

- `/_admin/clusterNodeVersion`: use `/_admin/cluster/nodeVersion`
- `/_admin/clusterNodeEngine`: use `/_admin/cluster/nodeEngine`
- `/_admin/clusterNodeStats`: use `/_admin/cluster/nodeStatistics`
- `/_admin/clusterStatistics`: use `/_admin/cluster/statistics`

The REST API endpoint `/_msg/please-upgrade-handler` has been removed in 
ArangoDB 3.9 as it is no longer needed. Its purpose was to display a static 
message.

#### Export API

The REST API endpoint `/_api/export` has been removed in ArangoDB 3.9.
This endpoint was previously only present in single server, but never
supported in cluster deployments.

The purpose of the endpoint was to provide the full data of a collection
without holding collection locks for a long time, which was useful for
the MMFile storage engine with its collection-level locks.

The MMFiles engine is gone since ArangoDB 3.7, and the only remaining
storage engine since then is RocksDB. For the RocksDB engine, the
`/_api/export` endpoint internally used a streaming AQL query such as

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN @@collection RETURN doc
```
{{% /tab %}}
{{< /tabs >}}

anyway. To remove API redundancy, the API endpoint has been deprecated
in ArangoDB 3.8 and is now removed. If the functionality is still required
by client applications, running a streaming AQL query can be used as a
substitution.

## JavaScript API

All collections in ArangoDB are now always in the "loaded" state. Any 
JavaScript functions for returning a collection's status will now return 
"loaded", unconditionally.

The JavaScript functions for loading and unloading collections (i.e. 
`db.<collection>.load()` and `db.<collection>.unload()`) have been turned 
into no-ops. They still exist in ArangoDB 3.9, but do not serve any purpose 
and are deprecated.
