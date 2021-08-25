---
layout: default
description: ArangoDB v3.9 Release Notes New Features
---
Features and Improvements in ArangoDB 3.9
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.9. ArangoDB 3.9 also contains several bug fixes that are not listed
here.

ArangoSearch
------------

### Segmentation and Collation Analyzers

The new `segmentation` Analyzer type allows you to tokenize text in a
language-agnostic manner as per
[Unicode Standard Annex #29](https://unicode.org/reports/tr29){:target="_blank"},
making it suitable for mixed language strings. It can optionally preserve all
non-whitespace or all characters instead of keeping alphanumeric characters only,
as well as apply case conversion.

The `collation` Analyzer converts the input into a set of language-specific
tokens. This makes comparisons follow the rules of the respective language,
most notable in range queries against Views.

See:
- [`segmentation` Analyzer](analyzers.html#segmentation)
- [`collation` Analyzer](analyzers.html#collation)

AQL
---

### Decay Functions

Added three decay functions to AQL:

- [DECAY_EXP()](aql/functions-numeric.html#decay_exp)
- [DECAY_LINEAR()](aql/functions-numeric.html#decay_linear)
- [DECAY_GAUSS()](aql/functions-numeric.html#decay_gauss)

Decay functions calculate a score with a function that decays depending on the
distance of a numeric value from a user given origin.

```js
DECAY_GAUSS(41, 40, 5, 5, 0.5) // 1
DECAY_LINEAR(5, 0, 10, 0, 0.2) // 0.6
DECAY_EXP(2, 0, 10, 0, 0.2)    // 0.7247796636776955
```

### Vector Functions

Added three vector functions to AQL for calculating the cosine similarity,
Manhattan distance, and Euclidean distance:

- [COSINE_SIMILARITY()](aql/functions-numeric.html#cosine_similarity)
- [L1_DISTANCE()](aql/functions-numeric.html#l1_distance)
- [L2_DISTANCE()](aql/functions-numeric.html#l2_distance)

```js
COSINE_SIMILARITY([0,1], [1,0]) // 0
L1_DISTANCE([-1,-1], [2,2]) // 6
L2_DISTANCE([1,1], [5,2]) // 4.1231056256176606
```

### Traversal filtering optimizations

A post-filter on the vertex and/or edge result of a traversal will now be
applied during the traversal to avoid generating the full output for AQL.
This will have a positive impact on performance when filtering on the 
vertex/edge but still returning the path.

Previously all paths were produced even for non-matching vertices/edges.
The new optimization now will check on the vertex/edge filter condition
first and only produce the remaining paths.

For example, the query

```js
FOR v, e, p IN 10 OUTBOUND @start GRAPH "myGraph"
  FILTER v.isRelevant == true
  RETURN p
```

can now be optimized, and the traversal statement will only produce 
paths for which the last vertex satisfied `isRelevant == true`.

### Traversal partial path buildup

There is now a performance optimization for traversals in which the path
is returned, but only a specific sub-attribute of the path is used later
(e.g. `vertices`, `edges`, or `weight` sub-attribute).

For example, the query

```js
FOR v, e, p IN 1..3 OUTBOUND @start GRAPH "myGraph"
  RETURN p.vertices
```

only requires the buildup of the `vertices` sub-attribute of the path
result, but not the buildup of the `edges` sub-attribute.

This optimization should have a positive impact on performance for larger
traversal result sets.

### Warnings on invalid OPTIONS

Invalid use of `OPTIONS` in AQL queries will now raise a warning when the query
is parsed. This is useful to detect misspelled attribute names in `OPTIONS`, e.g.

```js
INSERT ... INTO collection
  OPTIONS { overwrightMode: 'ignore' } /* should have been 'overwriteMode' */
```

It is also useful to detect the usage of valid `OPTIONS` attribute names that
are used at a wrong position in the query, e.g.

```js
FOR doc IN collection
  FILTER doc.value == 1234
  INSERT doc INTO other
    OPTIONS { indexHint: 'myIndex' } /* should have been used above for FOR */
```

In case options are used incorrectly, a warning with code 1575 will be raised
during query parsing or optimization. By default, warnings are reported but do
not lead to the query being aborted. This can be toggled by the startup option
`--query.fail-on-warnings` or the per-query runtime option `failOnWarnings`.

### Memory usage tracking

The AQL operations `K_SHORTEST_PATHS` and `SHORTEST_PATH` are now included
in the memory usage tracking performed by AQL, so that memory acquired by these
operations will be accounted for and checked against the configured memory
limit (options `--query.memory-limit` and `--query.memory-limit-global`).

### Execution of complex queries

Very large queries (in terms of query execution plan complexity) are now split
into multiple segments that are executed using separate stacks. This avoids
potential stack overflow. The number of execution nodes after that such
stack splitting is performed can be configured via the startup option
`--query.max-nodes-per-callstack`. The default value is 200 for macOS, and 250
for the other supported platforms. The value can be adjusted per query via the
`maxNodesPerCallstack` query option.

### Query complexity limits

AQL now has some hard-coded query complexity limits, to prevent large 
programmatically generated queries from causing trouble (too deep recursion, 
enormous memory usage, long query optimization and distribution passes etc.).

The following limits have been introduced:
- a recursion limit for AQL query expressions. An expression can now be
  up to 500 levels deep. An example expression is `1 + 2 + 3 + 4`, which
  is 3 levels deep `1 + (2 + (3 + 4))`.
  The expression recursion is limited to 500 levels.
- a limit for the number of execution nodes in the initial query
  execution plan.
  The number of execution nodes is limited to 4,000.

### RocksDB block cache control

The new query option `fillBlockCache` can be used to control the population
of the RocksDB block cache with data read by the query. The default value for
this per-query option is `true`, which means that any data read by the query
will be inserted into the RocksDB block cache if not already present in there.
This mimics the previous behavior and is a sensible default.

Setting the option to `false` allows to not store any data read by the query
in the RocksDB block cache. This is useful for queries that read a lot of (cold)
data which would lead to the eviction of the hot data from the block cache.

UI
--

### Configurable root redirect

Added two options to `arangod` to allow HTTP redirection customization for
root (`/`) call of the HTTP API:

- `--http.permanently-redirect-root`: if `true` (default), use a permanent
  redirection (use HTTP 301 code), if `false` fall back to temporary redirection
  (use HTTP 302 code).

- `--http.redirect-root-to`: redirect of root URL to a specified path.
  Redirects to `/_admin/aardvark/index.html` if not set (default).

These options are useful to override the built-in web interface with some 
user-defined action.

### Web interface session handling

The previously inactive startup parameter `--server.session-timeout` was
revived and now controls the timeout for web interface sessions (and other
sessions that are based on JWTs created by the `/_open/auth` API).

For security reasons, the default timeout value for web interface sessions
has been reduced to one hour, after which a session is ended automatically.
Web interface sessions that are active (i.e. that have any user activity)
are automatically extended until the user ends the session explicitly or
if there is a period of one hour without any user activity.

The timeout value for web interface sessions can be adjusted via the
`--server.session-timeout` startup parameter (in seconds).

Server options
--------------

The _arangod_ server now provides a command `--version-json` to print version
information in JSON format. This output can be used by tools that need to 
programmatically inspect an _arangod_ executable.

A pseudo log topic `"all"` was added. Setting the log level for the "all" log
topic will adjust the log level for **all existing log topics**. For example,
`--log.level all=debug` will set all log topics to log level "debug".

Support info API
----------------

A new HTTP REST API endpoint `GET /_admin/support-info` was added for retrieving
deployment information for support purposes. The endpoint returns data about the
ArangoDB version used, the host (operating system, server ID, CPU and storage capacity,
current utilization, a few metrics) and the other servers in the deployment
(in case of active failover or cluster deployments).

As this API may reveal sensitive data about the deployment, it can only be 
accessed from inside the `_system` database. In addition, there is a policy control 
startup option `--server.support-info-api` that controls if and to whom the API 
is made available. This option can have the following values:

- `disabled`: support info API is disabled.
- `jwt`: support info API can only be accessed via superuser JWT.
- `hardened` (default): if `--server.harden` is set, the support info API can only be
  accessed via superuser JWT. Otherwise it can be accessed by admin users only.
- `public`: everyone with access to the `_system` database can access the support info API.

Miscellaneous changes
---------------------

### Collection statuses

The previously existing collection statuses "new born", "loading", "unloading"
and "unloaded" were removed, as they weren't actively used in arangod.

These statuses were last relevant with the MMFiles storage engine, when it was
important to differentiate which collections were present in main memory and
which weren't. With the RocksDB storage engine, all that is automatically
handled anyway, and the mentioned statuses are not important anymore.

The "Load" and "Unload" buttons for collections have also been removed from the
web interface. This change also obsoletes the `load()` and `unload()` calls for
collections as well as their HTTP API equivalents. The APIs will remain in place
for now for downwards-compatibility but have been changed to no-ops.
They will eventually be removed in a future version of ArangoDB.

### Cluster-internal timeouts

The internal timeouts for inactive cluster transactions on DB servers was
increased from 3 to 5 minutes.

Previously transactions on DB servers could expire quickly, which led to
spurious "query ID not found" or "transaction ID not found" errors on DB
servers for multi-server queries/transactions with unbalanced access patterns
for the different participating DB servers.

Transaction timeouts on Coordinators remain unchanged, so any queries/transactions
that are abandoned will be aborted there, which will also be propagated to
DB-Servers.

Client tools
------------

### Increased default number of threads

The default value for the `--threads` startup parameter was changed from
2 to the maximum of 2 and the number of available CPU cores for the following
client tools:

- arangodump
- arangoimport
- arangorestore

This change can help to improve performance of imports, dumps or restore
processes on machines with multiple cores in case the `--threads` parameter
was not previously used. As a trade-off, the change may lead to an increased 
load on servers, so any scripted imports, dumps or restore processes that 
want to keep the server load under control should set the number of client
threads explicitly when invoking any of the above client tools.

### arangobench

_arangobench_ now prints a short description of the test case started, so
it is easier to figure out what operations are carried out by a test case.
Several test cases in arangobench have been deprecated because they do not
target real world use cases but were rather writing for some internal testing.
The deprecated test cases will be removed in a future version to clear up
the list of test cases.

### arangovpack

The _arangovpack_ utility supports more input and output formats (JSON and
VelocyPack, plain or hex-encoded). The former options `--json` and `--pretty`
have been removed and have been replaced with separate options for specifying
the input and output types:

- `--input-type` (`json`, `json-hex`, `vpack`, `vpack-hex`)
- `--output-type` (`json`, `json-pretty`, `vpack`, `vpack-hex`)

The former option `--print-non-json` has been replaced with the new option
`--fail-on-non-json` which makes [arangovpack](programs-arangovpack.html)
fail when trying to emit non-JSON types to JSON output.

Internal changes
----------------

The compiler version used to build the ArangoDB Linux executables has been
upgraded from g++ 9.3.0 to g++ 10.2.1.
g++ 10 is also the expected version of g++ when compiling ArangoDB from
source.

The bundled version of the Snappy compression library was upgraded from
version 1.1.8 to version 1.1.9.

The minimum architecture requirements have been raised from the Westmere
architecture to the Sandy Bridge architecture. 256-bit AVX instructions are
now expected to be present on all targets that run ArangoDB 3.9 executables.
If a target does not support AVX instructions, it may fail with SIGILL at
runtime.
