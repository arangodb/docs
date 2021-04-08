---
layout: default
description: It is recommended to check the following list of incompatible changes before upgrading to ArangoDB 3.9
---
Incompatible changes in ArangoDB 3.9
====================================

It is recommended to check the following list of incompatible changes **before**
upgrading to ArangoDB 3.9, and adjust any client programs if necessary.

The following incompatible changes have been made in ArangoDB 3.9:

Startup options
---------------

## Disallowed usage of collection names in AQL expressions

The startup option `--query.allow-collections-in-expressions` added in 3.8.0
controls whether collection names are allowed in arbitrary places in AQL
expressions. The default was *true*, but is now changed to *false* in 3.9.0 to
make queries like `FOR doc IN collection RETURN collection` fail, where it was
probably intended to `RETURN doc` instead. Also see
[ArangoDB Server Query Options](programs-arangod-query.html#allowing-the-usage-of-collection-names-in-aql-expressions)

Such unintentional usage of collection names in queries now makes the query
fail with error 1568 ("collection used as expression operand") by default.
The option can be set to *true* to restore the 3.8 behavior. However, the
option is deprecated from 3.9.0 on and will be removed in future versions.
From then on, unintended usage of collection names will always be disallowed.

If you use queries like `RETURN collection` then you should replace them with
`FOR doc IN collection RETURN doc` to ensure future compatibility.
