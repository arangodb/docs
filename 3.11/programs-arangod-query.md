---
layout: default
description: ArangoDB Server Query Options
---
# ArangoDB Server Query Options

## Limiting query runtime

<small>Introduced in: v3.6.7, v3.7.3</small>

`--query.max-runtime value`

Sets a default maximum runtime for AQL queries.

The default value is `0`, meaning that the runtime of AQL queries is not
limited. Setting it to any positive value will restrict the runtime of all AQL
queries, unless it is overwritten in the per-query `maxRuntime` query option.

If a query exceeds the configured runtime, it will be killed on the next
occasion when the query checks its own status. Killing is best effort based,
so it is not guaranteed that a query will no longer than exactly the
configured amount of time.

{% hint 'warning' %}
Setting this option will affect all queries in all databases, and also queries
issues for administration and database-internal purposes.
{% endhint %}

## Limiting memory usage of AQL queries

`--query.memory-limit value`

The default maximum amount of memory (in bytes) that a single AQL query can use.
When a single AQL query reaches the specified limit value, the query will be
aborted with a *resource limit exceeded* exception. In a cluster, the memory
accounting is done per server, so the limit value is effectively a memory limit
per query per server.

Some operations, namely calls to AQL functions and their intermediate results, 
are currently not properly tracked. This may change in future versions.

The per-query limit value can be overridden per query by setting the
`memoryLimit` option value for individual queries when running them.
Overriding the per-query limit value is only possible if the
`--query.memory-limit-override` option is set to `true`.

The default per-query memory limit value in ArangoDB 3.8 depends on the amount of
available RAM. In previous versions of ArangoDB, the default value was 0, meaning 
"unlimited".

The default values in 3.8 are:

```
Available memory:            0      (0MiB)  Limit:            0   unlimited, %mem:  n/a
Available memory:    134217728    (128MiB)  Limit:     33554432     (32MiB), %mem: 25.0
Available memory:    268435456    (256MiB)  Limit:     67108864     (64MiB), %mem: 25.0
Available memory:    536870912    (512MiB)  Limit:    201326592    (192MiB), %mem: 37.5
Available memory:    805306368    (768MiB)  Limit:    402653184    (384MiB), %mem: 50.0
Available memory:   1073741824   (1024MiB)  Limit:    603979776    (576MiB), %mem: 56.2
Available memory:   2147483648   (2048MiB)  Limit:   1288490189   (1228MiB), %mem: 60.0
Available memory:   4294967296   (4096MiB)  Limit:   2576980377   (2457MiB), %mem: 60.0
Available memory:   8589934592   (8192MiB)  Limit:   5153960755   (4915MiB), %mem: 60.0
Available memory:  17179869184  (16384MiB)  Limit:  10307921511   (9830MiB), %mem: 60.0
Available memory:  25769803776  (24576MiB)  Limit:  15461882265  (14745MiB), %mem: 60.0
Available memory:  34359738368  (32768MiB)  Limit:  20615843021  (19660MiB), %mem: 60.0
Available memory:  42949672960  (40960MiB)  Limit:  25769803776  (24576MiB), %mem: 60.0
Available memory:  68719476736  (65536MiB)  Limit:  41231686041  (39321MiB), %mem: 60.0
Available memory: 103079215104  (98304MiB)  Limit:  61847529063  (58982MiB), %mem: 60.0
Available memory: 137438953472 (131072MiB)  Limit:  82463372083  (78643MiB), %mem: 60.0
Available memory: 274877906944 (262144MiB)  Limit: 164926744167 (157286MiB), %mem: 60.0
Available memory: 549755813888 (524288MiB)  Limit: 329853488333 (314572MiB), %mem: 60.0
```

It is possible to set a global memory limit for the total memory used by all AQL 
queries that currently execute via the option `--query.global-memory-limit`.

From ArangoDB 3.8 on, the per-query memory tracking has a granularity of 32 KB 
chunks. That means checking for memory limits such as "1" (e.g. for testing) 
may not make a query fail, if the total memory allocations in the query will not 
exceed 32 KB. The effective lowest memory limit value that can be enforced is thus 
32 KB. Memory limit values higher than 32 KB will be checked whenever the total 
memory allocations cross a 32 KB boundary. 

`--query.memory-limit-override value`

<small>Introduced in: v3.8.0</small>

This option can be used to control whether individual AQL queries can increase
their memory limit via the `memoryLimit` query option. This is the default, so
a query that increases its memory limit is allowed to use more memory than set
via the `--query.memory-limit` startup option value.

If the option is set to `false`, individual queries can only lower their
maximum allowed memory usage but not increase it.

`--query.global-memory-limit value`

<small>Introduced in: v3.8.0</small>

The startup option `--query.global-memory-limit` can be used set a limit on the
combined estimated memory usage of all AQL queries (in bytes). If this option
has a value of `0`, then no global memory limit is in place. This is also the
default value and the same behavior as in previous versions of ArangoDB.

Setting the option to a value greater than zero will mean that the total memory
usage of all AQL queries will be limited approximately to the configured value.
The limit is enforced by each server in a cluster independently, i.e. it can be
set separately for Coordinators, DB-Servers etc. The memory usage of a query
that runs on multiple servers in parallel is not summed up, but tracked
separately on each server.

If a memory allocation in a query would lead to the violation of the configured
global memory limit, then the query is aborted with error code 32
("resource limit exceeded").

The global memory limit is approximate, in the same fashion as the per-query
memory limit exposed by the option `--query.memory-limit` is. 
The global memory tracking has a granularity of 32 KB chunks. 

If both `--query.global-memory-limit` and `--query.memory-limit` are set, the
former must be set at least as high as the latter.

## Turning AQL warnings into errors

`--query.fail-on-warning value`

When set to *true*, AQL queries that produce warnings will instantly abort and
throw an exception. This option can be set to catch obvious issues with AQL
queries early. When set to *false*, AQL queries that produce warnings will not
abort and return the warnings along with the query results.
The option can also be overridden for each individual AQL query.

## Logging failed AQL queries

<small>Introduced in: v3.11.0</small>

`--query.log-failed value`

If set to `true`, all failed AQL queries are logged to the server log. This
option can be used during development, or to catch unexpected failed queries
in production.

The option is turned off by default.

`--query.log-memory-usage-threshold value`

This option determines the peak memory usage threshold for AQL queries from
which on a warning will be logged if queries exceed it. This is useful for
finding queries that use a large amount of memory.

The default value is `4294967296` (4 GB).

<small>Introduced in: v3.11.0</small>

`--query.max-artefact-log-length value`

This option determines the maximum length of logged query strings and bind parameter 
values. This allows truncating overly long query strings and bind parameter values
to a reasonable length in logfiles.

The default value is `4096` bytes.

## Requiring `WITH` statements

<small>Introduced in: v3.7.12</small>

`--query.require-with value`

When set to *true*, AQL queries in single server mode will also require `WITH`
clauses in AQL queries where a cluster installation would require them.
The option is set to *false* by default, but can be turned on in single servers
to remove this behavior difference between single servers and clusters, making
a later transition from single server to cluster easier.

## Allowing the usage of collection names in AQL expressions

<small>Introduced in: v3.8.0</small><br>
<small>Deprecated in: v3.9.0</small>

`--query.allow-collections-in-expressions value`

When set to *true*, using collection names in arbitrary places in AQL
expressions is allowed, although using collection names like this is very
likely unintended.

For example, consider the query

```aql
FOR doc IN collection RETURN collection
```

Here, the collection name is *collection*, and its usage in the `FOR` loop is
intended and valid. However, *collection* is also used in the `RETURN`
statement, which is legal but potentially unintended. It should likely be
`RETURN doc` or `RETURN doc.someAttribute` instead. Otherwise, the entire
collection will be materialized and returned as many times as there are
documents in the collection. This can take a long time and even lead to
out-of-memory crashes in the worst case.

Setting the option `--query.allow-collections-in-expression` to *false* will
prohibit such unintentional usage of collection names in queries, and instead
make the query fail with error 1568 ("collection used as expression operand").

The default value of the option was *true* in v3.8, meaning that potentially
unintended usage of collection names in queries were still allowed. In v3.9
the default value changes to *false*. The option is also deprecated from
3.9.0 on and will be removed in future versions. From then on, unintended
usage of collection names will always be disallowed.

## Enable/disable AQL query tracking

`--query.tracking flag`

If *true*, the server's AQL slow query tracking feature will be enabled by
default. Tracking of queries can be disabled by setting the option to *false*.

The default is *true*.

## Enable/disable tracking of bind variables in AQL queries

`--query.tracking-with-bindvars flag`

If *true*, then the bind variables will be tracked and shown for all running 
and slow AQL queries. When set to *true*, this will also enable the display of
bind variable values in the list of cached AQL query results.
This option only has an effect if `--query.tracking` was set to *true* or when
the query results cache is used. 
Tracking and displaying bind variable values can be disabled by setting the option to *false*.

The default is *true*.

## Threshold for slow AQL queries

`--query.slow-threshold value`

By setting *value* it can be controlled after what execution time an AQL query
is considered "slow". Any slow queries that exceed the execution time specified
in *value* will be logged when they are finished. The threshold value is
specified in seconds. Tracking of slow queries can be turned off entirely by
setting the option `--query.tracking` to *false*.

The default value is *10.0*.

`--query.slow-streaming-threshold value`

By setting *value* it can be controlled after what execution time streaming AQL 
queries are considered "slow". This option exists to give streaming queries a
separate, potentially higher timeout value than regular queries. Streaming queries
are often executed in lockstep with application data processing logic, which then
also accounts for the queries' runtime. It is thus not unexpected if streaming 
queries' lifetime is longer than the one of regular queries.

The default value is *10.0*.

## Limiting the number of query execution plans created by the AQL optimizer

`--query.optimizer-max-plans value`

By setting *value* it can be controlled how many different query execution plans
the AQL query optimizer will generate at most for any given AQL query. Normally
the AQL query optimizer will generate a single execution plan per AQL query, but
there are some cases in which it creates multiple competing plans. More plans
can lead to better optimized queries, however, plan creation has its costs. The
more plans are created and shipped through the optimization pipeline, the more
time will be spent in the optimizer.
Lowering *value* will make the optimizer stop creating additional plans when it
has already created enough plans.
Note that this setting controls the default maximum number of plans to create. The
value can still be adjusted on a per-query basis by setting the *maxNumberOfPlans*
attribute when running a query.

The default value is *128*.

## Optimizer rule defaults

`--query.optimizer-rules`

This option can be used to to selectively enable or disable AQL query optimizer
rules by default. The option can be specified multiple times, and takes the
same input as the query option of the same name.

For example, to turn off the rule `use-indexes-for-sort` by default, use

```
--query.optimizer-rules "-use-indexes-for-sort"
```

The purpose of this startup option is to be able to enable potential future
experimental optimizer rules, which may be shipped in a disabled-by-default
state.

## AQL Query results caching mode

`--query.cache-mode`

Toggles the AQL query results cache behavior. Possible values are:

* *off*: do not use query results cache
* *on*: always use query results cache, except for queries that have their *cache*
  attribute set to *false*
* *demand*: use query results cache only for queries that have their *cache*
  attribute set to *true*

## AQL Query results cache size

`--query.cache-entries`

Maximum number of query results that can be stored per database-specific query
results cache. If a query is eligible for caching and the number of items in the
database's query cache is equal to this threshold value, another cached query
result will be removed from the cache.

This option only has an effect if the query cache mode is set to either *on* or
*demand*.

The default value is *128*.

`--query.cache-entries-max-size`

Maximum cumulated size of query results that can be stored per database-specific 
query results cache. When inserting a query result into the query results cache,
it is check if the total size of cached results would exceed this value, and if so,
another cached query result will be removed from the cache before inserting a new
one.

This option only has an effect if the query cache mode is set to either *on* or
*demand*.

The default value is *256 MB*.

`--query.cache-entry-max-size`

Maximum size of individual query results that can be stored in any database's query 
results cache. Query results are only eligible for caching when their size does not exceed
this setting's value.

The default value is *16 MB*.

`--query.cache-include-system-collections`

Whether or not to store results of queries that involve system collections in
the query results cache. Not storing these results is normally beneficial when using the
query results cache, as queries on system collections are internal to ArangoDB and will
only use space in the query results cache unnecessarily.

The default value is *false*.


## AQL Query with spilling input data to disk 

<small>Introduced in: v3.10.0 </small>

With the parameters mentioned below, queries can execute with storing input 
and intermediate results temporarily on disk to decrease the memory usage 
a specified threshold is reached. 

{% hint 'info' %}
This feature is experimental and is turned off by default.
Also, the query results are still built up entirely in RAM on coordinators
and single servers for non-streaming queries. To avoid the buildup of
the entire query result in RAM, a streaming query should be used.
{% endhint %}

The threshold value to start spilling data onto disk is either 
a number of rows in the query input or an amount of memory used in bytes, 
which are both set as query options.

The main parameter that must be provided for this feature to be active is 
`--temp.intermediate-results-path`. This parameter specifies a path to a directory
used to store temporary data. If such path is not provided, the feature of spilling data 
onto the disk will not be activated.

Hence, the following parameters do not have any effect, unless the parameter 
mentioned above is provided with a directory path.
The directory specified here must not be located underneath the instance's 
database directory.


- `--temp.-intermediate-results-encryption-hardware-acceleration`

  Use Intel intrinsics-based encryption, requiring a CPU with the AES-NI 
  instruction set. If turned off, then OpenSSL is used, which may use hardware-
  accelarated encryption too. 
  Default: `true`.

- `--temp.intermediate-results-capacity`

  Maximum capacity, in bytes, to use for ephemeral, intermediate results, meaning 
  the maximum size allowed for the mentioned temporary storage. 
  Default: 0 (unlimited).

- `--temp.intermediate-results-encryption` 

  Encrypt ephemeral, intermediate results on disk.
  Default: `false`.


- `--temp.intermediate-results-spillover-threshold-num-rows`

  A number of result rows from which on a spillover from RAM to disk will happen.
  Default: 5000000.

- `--temp.intermediate-results-spillover-threshold-memory-usage`

  Memory usage, in bytes, after which a spillover from RAM to disk will happen.
  Default: 128MB.
