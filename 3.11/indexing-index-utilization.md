---
layout: default
description: Index Utilization
---
Index Utilization
=================

In most cases ArangoDB will use a single index per collection in a given query. AQL queries can
use more than one index per collection when multiple `FILTER` conditions are combined with a 
logical `OR` and these can be covered by indexes. AQL queries will use a single index per
collection when `FILTER` conditions are combined with logical `AND`.

Creating multiple indexes on different attributes of the same collection may give the query
optimizer more choices when picking an index. Creating multiple indexes on different attributes 
can also help in speeding up different queries, with `FILTER` conditions on different attributes.

It is often beneficial to create an index on more than just one attribute. By adding more attributes 
to an index, an index can become more selective and thus reduce the number of documents that 
queries need to process.

ArangoDB's primary indexes, edges indexes and hash indexes will automatically provide selectivity
estimates. Index selectivity estimates are provided in the web interface, the `indexes()` return 
value and in the `explain()` output for a given query. 

The more selective an index is, the more documents it will filter on average. The index selectivity 
estimates are therefore used by the optimizer when creating query execution plans when there are 
multiple indexes the optimizer can choose from. The optimizer will then select a combination of
indexes with the lowest estimated total cost. In general, the optimizer will pick the indexes with
the highest estimated selectivity.

Sparse indexes may or may not be picked by the optimizer in a query. As sparse indexes do not contain 
`null` values, they will not be used for queries if the optimizer cannot safely determine whether a
`FILTER` condition includes `null` values for the index attributes. The optimizer policy is to produce 
correct results, regardless of whether or which index is used to satisfy `FILTER` conditions. If it is 
unsure about whether using an index will violate the policy, it will not make use of the index.


Troubleshooting
---------------

When in doubt about whether and which indexes will be used for executing a given AQL query,
click the **Explain** button in the web interface in the **Queries** view or use
the `explain()` method for the statement as follows (from the ArangoShell):

```js
var query = "FOR doc IN collection FILTER doc.value > 42 RETURN doc";
var stmt = db._createStatement(query);
stmt.explain();
```

The `explain()` command will return a detailed JSON representation of the query's execution plan.
The JSON explain output is intended to be used programmatically. To get a human-readable and much more
compact explanation of the query, there use `db._explain(query)`:

```js
var query = "FOR doc IN collection FILTER doc.value > 42 RETURN doc";
db._explain(query);
```

If any of the explain methods shows that a query is not using indexes, the following steps may help:

- Check if the attribute names in the query are correctly spelled. In a schema-free database, documents
  in the same collection can have varying structures. There is no such thing as a *non-existing attribute*
  error. A query that refers to attribute names not present in any of the documents will not return an
  error, and obviously will not benefit from indexes.

- Check the return value of the `indexes()` method for the collections used in the query and validate
  that indexes are actually present on the attributes used in the query's filter conditions. 

- If indexes are present but not used by the query, the query's `FILTER` condition may not be adequate:
  an index will be used only for comparison operators `==`, `<`, `<=`, `>`, `>=` and `IN`.

- Using indexed attributes as function parameters or in arbitrary expressions will likely lead to the index
  on the attribute not being used. For example, the following queries will not use an index on `value`:
  
  ```aql
  FOR doc IN collection FILTER TO_NUMBER(doc.value) == 42 RETURN doc
  ```

  ```aql
  FOR doc IN collection FILTER doc.value - 1 == 42 RETURN doc
  ```

  In these cases the queries should be rewritten so that only the index attribute is present on one side of 
  the operator, or additional filters and indexes should be used to restrict the amount of documents otherwise.

- Certain AQL functions such as `WITHIN()` or `FULLTEXT()` do utilize indexes internally, but their use is
  not mentioned in the query explanation for functions in general. These functions will raise query errors
  (at runtime) if no suitable index is present for the collection in question.

- The query optimizer will generally pick one index per collection in a query. It can pick more than
  one index per collection if the `FILTER` condition contains multiple branches combined with logical `OR`.
  For example, the following queries can use indexes:

  ```aql
  FOR doc IN collection FILTER doc.value1 == 42 || doc.value1 == 23 RETURN doc
  ```

  ```aql
  FOR doc IN collection FILTER doc.value1 == 42 || doc.value2 == 23 RETURN doc
  ```

  ```aql
  FOR doc IN collection FILTER doc.value1 < 42 || doc.value2 > 23 RETURN doc
  ```

  The two `OR`s in the first query will be converted to an `IN` lookup, and if there is a suitable index on
  `value1`, it will be used. The second query requires two separate indexes on `value1` and `value2` and
  will use them if present. The third query can use the indexes on `value1` and `value2` when they are
  sorted.

- For indexes on multiple attributes (combined indexes), the index attribute order is also important.
  For example, when creating an index on `["value1", "value2"]` (in this order), the index can be
  used to satisfy the following `FILTER` conditions:

  ```aql
  FILTER doc.value1 == ...
  FILTER doc.value1 > ...
  FILTER doc.value1 >= ...
  FILTER doc.value1 < ...
  FILTER doc.value1 <= ...
  FILTER doc.value1 > ... && doc.value1 < ...
  FILTER doc.value1 >= ... && doc.value1 < ...
  FILTER doc.value1 > ... && doc.value1 <= ...
  FILTER doc.value1 >= ... && doc.value1 <= ...
  FILTER doc.value1 IN ...
  ```

  ```aql
  FILTER doc.value1 == ... && doc.value2 == ...
  FILTER doc.value1 == ... && doc.value2 > ...
  FILTER doc.value1 == ... && doc.value2 >= ...
  FILTER doc.value1 == ... && doc.value2 < ...
  FILTER doc.value1 == ... && doc.value2 <= ...
  FILTER doc.value1 == ... && doc.value2 > ... && doc.value2 < ...
  FILTER doc.value1 == ... && doc.value2 >= ... && doc.value2 < ...
  FILTER doc.value1 == ... && doc.value2 > ... && doc.value2 <= ...
  FILTER doc.value1 == ... && doc.value2 >= ... && doc.value2 <= ...
  FILTER doc.value1 == ... && doc.value2 IN ...
  ```

  The index cannot be used to satisfy FILTER conditions on `value2` alone.

  For a combined index to be used in a query, the following algorithm is applied:

  - The index attributes are checked in order, from left to right (e.g. `value1`, `value2`).
  - If there is a `FILTER` condition on an index attribute, the index is considered a valid candidate
    for the query.
  - If the `FILTER` condition on the current attribute does not use `==` or `IN`, the following index
    attributes are not considered anymore. Otherwise, they will be considered and the algorithm will
    check the next index attribute.
