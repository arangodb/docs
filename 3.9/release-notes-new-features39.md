---
layout: default
description: ArangoDB v3.9 Release Notes New Features
---
Features and Improvements in ArangoDB 3.9
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.9. ArangoDB 3.9 also contains several bug fixes that are not listed
here.

Hybrid (Disjoint) SmartGraphs
-----------------------------

SmartGraphs have been extended with a new option to create Hybrid SmartGraphs.
Hybrid SmartGraphs are capable of using SatelliteCollections within their graph
definition and therefore can make use of all the benefits of
[SatelliteCollections](satellites.md).

Edge definitions can now be created between SmartCollections and
SatelliteCollections. As SatelliteCollections are globally replicated to each
participating DB-Server, regular graph traversals, weighted traversals,
shortest path, and k shortest paths queries can partially be executed locally on
each DB-Server. This means that query execution can be fully local whenever
actual data from the SatelliteCollections is being processed. This can improve
data locality and reduce the number of network hops between cluster nodes.

In case you do have collections that are needed in almost every traversal but
are small enough to be copied over to every participating DB-Server,
Hybrid SmartGraphs are the perfect fit, as this will increase the amount of
local query execution.

Hybrid SmartGraphs can also be disjoint. A Disjoint SmartGraph prohibits edges
connecting different SmartGraph components. The same rule applies to
[Hybrid Disjoint SmartGraphs](graphs-smart-graphs.html#Benefits-of-Hybrid-Disjoint-SmartGraphs).
If your graph does not need edges between vertices with different SmartGraph
attribute values, then you should enable this option. This topology restriction
allows the query optimizer to improve traversal execution times, because the
execution can be pushed down to a single DB-Server in many cases.

[Hybrid SmartGraphs](graphs-smart-graphs.html#benefits-of-hybrid-smartgraphs)
are only available in the Enterprise Edition.

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

UI
--

### Configurable root redirect

Added two options to `arangod` to allow HTTP redirection customization for
root (`/`) call of the HTTP API:

- `--http.permanently-redirect-root`: if true (default), use a permanent
  redirection (use HTTP 301 code), if false fall back to temporary redirection
  (use HTTP 302 code).

- `--http.redirect-root-to`: redirect of root URL to a specified path.
  Redirects to `/_admin/aardvark/index.html` if not set (default).

Server options
--------------

The _arangod_ server now provides a command `--version-json` to print version
information in JSON format. This output can be used by tools that need to 
programmatically inspect an _arangod_ executable.

Client tools
------------

### More powerful arangovpack

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

The minimum architecture requirements have been raised from the Westmere
architecture to the Sandy Bridge architecture. 256-bit AVX instructions are
now expected to be present on all targets that run ArangoDB 3.9 executables.
If a target does not support AVX instructions, it may fail with SIGILL at
runtime.
