---
layout: default
description: AQL queries can be executed using
---
How to invoke AQL
=================

AQL queries can be executed using:

- the web interface,
- the `db` object (either in arangosh or in a Foxx service)
- or the raw HTTP API.

There are always calls to the server's API under the hood, but the web interface
and the `db` object abstract away the low-level communication details and are
thus easier to use.

The ArangoDB Web Interface has a [specific tab for AQL queries execution](invocation-withwebinterface.html).

You can run [AQL queries from the ArangoDB Shell](invocation-witharangosh.html)
with the [_query](invocation-witharangosh.html#with-dbquery) and
[_createStatement](invocation-witharangosh.html#with-createstatement-arangostatement) methods
of the [`db` object](../manual/appendix-references-dbobject.html). This chapter
also describes how to use bind parameters, statistics, counting and cursors with
arangosh.

If you are using Foxx, see [how to write database queries](../manual/foxx-gettingstarted.html#writing-database-queries)
for examples including tagged template strings.

If you want to run AQL queries from your application via the HTTP REST API,
see the full API description at [HTTP Interface for AQL Query Cursors](../http/aqlquerycursor.html).
