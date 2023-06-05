---
layout: default
description: >-
  You can get information stored in ArangoDB back out using queries, optionally
  accelerated by indexes, and possibly in result batches
---
# Data Retrieval

{{ page.description }}
{:class="lead"}

**Queries** are used to filter documents based on certain criteria, to compute
or store new data, as well as to manipulate or delete existing documents.
Queries can be as simple as returning individual records, or as complex as
traversing graphs or performing [joins](aql/examples-join.html) using many
collections. Queries are written in the [ArangoDB Query Language](aql/),
**AQL** for short.

**Cursors** are used to iterate over the result of queries, so that you get
easily processable batches instead of one big hunk.

**Indexes** are used to speed up queries. There are multiple types of indexes,
such as [persistent indexes](indexing-persistent.html) and
[geo-spatial indexes](indexing-geo.html).

**Views** are another type of index, primarily for full-text search. See
[ArangoSearch](arangosearch.html).
