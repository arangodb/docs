---
layout: default
description: There are two fundamental types of AQL queries, data access and data modification queries.
title: AQL Data Queries
redirect_from:
  - examples-data-modification-queries.html # 3.10 -> 3.10
---
Data Queries
============

There are two fundamental types of AQL queries:
- queries which access data (read documents)
- queries which modify data (create, update, replace, delete documents)

Data Access Queries
-------------------

Retrieving data from the database with AQL does always include a **RETURN**
operation. It can be used to return a static value, such as a string:

```aql
RETURN "Hello ArangoDB!"
```

The query result is always an array of elements, even if a single element was
returned and contains a single element in that case: `["Hello ArangoDB!"]`

The function `DOCUMENT()` can be called to retrieve a single document via
its document identifier, for instance:

```aql
RETURN DOCUMENT("users/phil")
```

`RETURN` is usually accompanied by a **FOR** loop to iterate over the
documents of a collection. The following query executes the loop body for all
documents of a collection called `users`. Each document is returned unchanged
in this example:

```aql
FOR doc IN users
  RETURN doc
```

Instead of returning the raw `doc`, one can easily create a projection:

```aql
FOR doc IN users
  RETURN { user: doc, newAttribute: true }
```

For every user document, an object with two attributes is returned. The value
of the attribute `user` is set to the content of the user document, and
`newAttribute` is a static attribute with the boolean value `true`.

Operations like **FILTER**, **SORT** and **LIMIT** can be added to the loop body
to narrow and order the result. Instead of above shown call to `DOCUMENT()`,
one can also retrieve the document that describes user `phil` like so:

```aql
FOR doc IN users
  FILTER doc._key == "phil"
  RETURN doc
```

The document key is used in this example, but any other attribute could equally
be used for filtering. Since the document key is guaranteed to be unique, no
more than a single document can match this filter. For other attributes this
may not be the case. To return a subset of active users (determined by an
attribute called `status`), sorted by name in ascending order, you can do: 

```aql
FOR doc IN users
  FILTER doc.status == "active"
  SORT doc.name
  LIMIT 10
```

Note that operations do not have to occur in a fixed order and that their order
can influence the result significantly. Limiting the number of documents
before a filter is usually not what you want, because it easily misses a lot
of documents that would fulfill the filter criterion, but are ignored because
of a premature `LIMIT` clause. Because of the aforementioned reasons, `LIMIT`
is usually put at the very end, after `FILTER`, `SORT` and other operations.

See the [High Level Operations](operations.html) chapter for more details.

Data Modification Queries
-------------------------

AQL supports the following data modification operations:

- **INSERT**: insert new documents into a collection
- **UPDATE**: partially update existing documents in a collection
- **REPLACE**: completely replace existing documents in a collection
- **REMOVE**: remove existing documents from a collection
- **UPSERT**: conditionally insert or update documents in a collection

You can use them to modify the data of one or multiple documents with a single
query. This is superior to fetching and updating the documents individually with
multiple queries. However, if only a single document needs to be modified,
ArangoDB's specialized data modification operations for single documents might
execute faster.

Below you find some simple example queries that use these operations.
The operations are detailed in the chapter [High Level Operations](operations.html).

### Modifying a single document

Let's start with the basics: `INSERT`, `UPDATE` and `REMOVE` operations on single documents.
Here is an example that inserts a document into a collection called `users` with
the [`INSERT` operation](operations-insert.html):

```aql
INSERT {
  firstName: "Anna",
  name: "Pavlova",
  profession: "artist"
} INTO users
```

The collection needs to exist before executing the query. AQL queries cannot
create collections.

If you run the above query, the result is an empty array because we did
not specify what to return using a `RETURN` keyword. It is optional in
modification queries, but mandatory in data access queries. Despite the empty
result, the above query still creates a new user document.

You may provide a key for the new document; if not provided, ArangoDB creates one for you.

```aql
INSERT {
  _key: "GilbertoGil",
  firstName: "Gilberto",
  name: "Gil",
  city: "Fortalezza"
} INTO users
```

As ArangoDB is schema-free, attributes of the documents may vary: 

```aql
INSERT {
  _key: "PhilCarpenter",
  firstName: "Phil",
  name: "Carpenter",
  middleName: "G.",
  status: "inactive"
} INTO users
```

```aql
INSERT {
  _key: "NatachaDeclerck",
  firstName: "Natacha",
  name: "Declerck",
  location: "Antwerp"
} INTO users 
```

The [`UPDATE` operation](operations-update.html) lets you add or change
attributes of existing documents. The following query modifies a previously
created user, changing the `status` attribute and adding a `location` attribute:

```aql
UPDATE "PhilCarpenter" WITH {
  status: "active",
  location: "Beijing"
} IN users
```

The [`REPLACE` operation](operations-replace.html) is an alternative to the
`UPDATE` operation that lets you replace all attributes of a document
(except for attributes that cannot be changed, like `_key`):

```aql
REPLACE {
  _key: "NatachaDeclerck",
  firstName: "Natacha",
  name: "Leclerc",
  status: "active",
  level: "premium"
} IN users
```

You can delete a document with the [`REMOVE` operation](operations-remove.html),
only requiring the document key to identify it:

```aql
REMOVE "GilbertoGil" IN users
```

### Modifying multiple documents

Data modification operations are normally combined with `FOR` loops to
iterate over a given list of documents. They can optionally be combined with
`FILTER` statements and the like.

To create multiple new documents, use the `INSERT` operation together with `FOR`.
You can also use `INSERT` to generate copies of existing documents from other
collections, or to create synthetic documents (e.g. for testing purposes).
The following query creates 1000 test users with some attributes and stores
them in the `users` collection:

```aql
FOR i IN 1..1000
  INSERT {
    id: 100000 + i,
    age: 18 + FLOOR(RAND() * 25),
    name: CONCAT('test', TO_STRING(i)),
    status: i % 2 == 0 ? "active" : "not active",
    active: false,
    gender: i % 3 == 0 ? "male" : i % 3 == 1 ? "female" : "diverse"
  } IN users
```

Let's modify existing documents that match some condition:

```aql
FOR u IN users
  FILTER u.status == "not active"
  UPDATE u WITH { status: "inactive" } IN users
```

You can also update existing attributes based on their previous value:

```aql
FOR u IN users
  FILTER u.active == true
  UPDATE u WITH { numberOfLogins: u.numberOfLogins + 1 } IN users
```

The above query only works if there is already a `numberOfLogins` attribute
present in the document. If it is unclear whether there is a `numberOfLogins`
attribute in the document, the increase must be made conditional:

```aql
FOR u IN users
  FILTER u.active == true
  UPDATE u WITH {
    numberOfLogins: HAS(u, "numberOfLogins") ? u.numberOfLogins + 1 : 1
  } IN users
```

Updates of multiple attributes can be combined in a single query:

```aql
FOR u IN users
  FILTER u.active == true
  UPDATE u WITH {
    lastLogin: DATE_NOW(),
    numberOfLogins: HAS(u, "numberOfLogins") ? u.numberOfLogins + 1 : 1
  } IN users
```

Note than an update query might fail during execution, for example, because a
document to be updated does not exist. In this case, the query aborts at
the first error. In single server mode, all modifications done by the query
are rolled back as if they never happened.

You can copy documents from one collection to another by reading from one
collection but write to another.
Let's copy the contents of the `users` collection into the `backup` collection:

```aql
FOR u IN users
  INSERT u IN backup
```

Note that both collections must already exist when the query is executed.
The query might fail if the `backup` collection already contains documents,
as executing the insert might attempt to insert the same document (identified
by the `_key` attribute) again. This triggers a unique key constraint violation
and aborts the query. In single server mode, all changes made by the query
are also rolled back.
To make such a copy operation work in all cases, the target collection can
be emptied beforehand, using a `REMOVE` query or by truncating it by other means.

To not just partially update, but completely replace existing documents, use
the `REPLACE` operation.
The following query replaces all documents in the `backup` collection with
the documents found in the `users` collection. Documents common to both
collections are replaced. All other documents remain unchanged.
Documents are compared using their `_key` attributes:

```aql
FOR u IN users
  REPLACE u IN backup
```

The above query fails if there are documents in the `users` collection that are
not in the `backup` collection yet. In this case, the query would attempt to replace
documents that do not exist. If such case is detected while executing the query,
the query is aborted. In single server mode, all changes made by the query are
rolled back.

To make the query succeed regardless of the errors, use the `ignoreErrors`
query option:

```aql
FOR u IN users
  REPLACE u IN backup OPTIONS { ignoreErrors: true }
```

This continues the query execution if errors occur during a `REPLACE`, `UPDATE`,
`INSERT`, or `REMOVE` operation.

Finally, let's find some documents in collection `users` and remove them
from collection `backup`. The link between the documents in both collections is
established via the documents' keys:

```aql
FOR u IN users
  FILTER u.status == "deleted"
  REMOVE u IN backup
```

The following example removes all documents from both `users` and `backup`:

```aql
LET r1 = (FOR u IN users  REMOVE u IN users)
LET r2 = (FOR u IN backup REMOVE u IN backup)
RETURN true
```

### Altering substructures

To modify lists in documents, for example, to update specific attributes of
objects in an array, you can compute a new array and then update the document
attribute in question. This may involve the use of subqueries and temporary
variables.

Create a collection named `complexCollection` and run the following query:

```aql
FOR doc IN [
  {
    "topLevelAttribute": "a",
    "subList": [
      {
        "attributeToAlter": "value to change",
        "filterByMe": true
      },
      {
        "attributeToAlter": "another value to change",
        "filterByMe": true
      },
      {
        "attributeToAlter": "keep this value",
        "filterByMe": false
      }
    ]
  },
  {
    "topLevelAttribute": "b",
    "subList": [
      {
        "attributeToAlter": "keep this value",
        "filterByMe": false
      }
    ]
  }
] INSERT doc INTO complexCollection
```

The following query updates the `subList` top-level attribute of documents.
The `attributeToAlter` values in the nested object are changed if the adjacent
`filterByMe` attribute is `true`:

```aql
FOR doc in complexCollection
  LET alteredList = (
    FOR element IN doc.subList
       RETURN element.filterByMe
              ? MERGE(element, { attributeToAlter: "new value" })
              : element
  )
  UPDATE doc WITH { subList: alteredList } IN complexCollection
  RETURN NEW
```

```json
[
  {
    "_key": "2607",
    "_id": "complexCollection/2607",
    "_rev": "_fWb_iOO---",
    "topLevelAttribute": "a",
    "subList": [
      {
        "attributeToAlter": "new value",
        "filterByMe": true
      },
      {
        "attributeToAlter": "new value",
        "filterByMe": true
      },
      {
        "attributeToAlter": "keep this value",
        "filterByMe": false
      }
    ]
  },
  {
    "_key": "2608",
    "_id": "complexCollection/2608",
    "_rev": "_fWb_iOO--_",
    "topLevelAttribute": "b",
    "subList": [
      {
        "attributeToAlter": "keep this value",
        "filterByMe": false
      }
    ]
  }
]
```

To improve the query's performance, you can only update documents if there is
a change to the `subList` to be saved. Instead of comparing the current and the
altered list directly, you may compare their hash values using the
[`HASH()` function](functions-miscellaneous.html#hash), which is faster for
larger objects and arrays. You can also replace the subquery with an
[inline expression](advanced-array-operators.html#inline-expressions):

```aql
FOR doc in complexCollection
  LET alteredList = doc.subList[*
    RETURN CURRENT.filterByMe
    ? MERGE(CURRENT, { attributeToAlter: "new value" })
    : CURRENT
  ]
  FILTER HASH(doc.subList) != HASH(alteredList)
  UPDATE doc WITH { subList: alteredList } IN complexCollection
  RETURN NEW
```

### Returning documents

Data modification queries can optionally return documents. In order to reference
the inserted, removed or modified documents in a `RETURN` statement, data modification 
statements introduce the `OLD` and/or `NEW` pseudo-values:

```aql
FOR i IN 1..100
  INSERT { value: i } IN test 
  RETURN NEW
```

```aql
FOR u IN users
  FILTER u.status == "deleted"
  REMOVE u IN users 
  RETURN OLD
```

```aql
FOR u IN users
  FILTER u.status == "not active"
  UPDATE u WITH { status: "inactive" } IN users 
  RETURN NEW
```

`NEW` refers to the inserted or modified document revision, and `OLD` refers
to the document revision before update or removal. `INSERT` statements can 
only refer to the `NEW` pseudo-value, and `REMOVE` operations only to `OLD`. 
`UPDATE`, `REPLACE` and `UPSERT` can refer to either.

In all cases, the full documents are returned with all their attributes,
including the potentially auto-generated attributes, such as `_id`, `_key`, and `_rev`,
and the attributes not specified in the update expression of a partial update.

#### Projections of OLD and NEW

It is possible to return a projection of the documents with `OLD` or `NEW` instead of 
returning the entire documents. This can be used to reduce the amount of data returned 
by queries.

For example, the following query returns only the keys of the inserted documents:

```aql
FOR i IN 1..100
  INSERT { value: i } IN test 
  RETURN NEW._key
```

#### Using OLD and NEW in the same query

For `UPDATE`, `REPLACE`, and `UPSERT` operations, both `OLD` and `NEW` can be used
to return the previous revision of a document together with the updated revision:

```aql
FOR u IN users
  FILTER u.status == "not active"
  UPDATE u WITH { status: "inactive" } IN users 
  RETURN { old: OLD, new: NEW }
```

#### Calculations with OLD or NEW

It is also possible to run additional calculations with `LET` statements between the
data modification part and the final `RETURN` of an AQL query. For example, the following
query performs an upsert operation and returns whether an existing document was
updated, or a new document was inserted. It does so by checking the `OLD` variable
after the `UPSERT` and using a `LET` statement to store a temporary string for
the operation type:
  
```aql
UPSERT { name: "test" }
  INSERT { name: "test" }
  UPDATE { } IN users
LET opType = IS_NULL(OLD) ? "insert" : "update"
RETURN { _key: NEW._key, type: opType }
```

### Restrictions

The name of the modified collection (`users` and `backup` in the above cases) 
must be known to the AQL executor at query-compile time and cannot change at 
runtime. Using a bind parameter to specify the
[collection name](../data-modeling-collections.html#collection-names) is allowed.

It is not possible to use multiple data modification operations for the same
collection in the same query, or follow up a data modification operation for a
specific collection with a read operation for the same collection.  Neither is
it possible to follow up any data modification operation with a traversal query
(which may read from arbitrary collections not necessarily known at the start of
the traversal).

That means you may not place several `REMOVE` or `UPDATE` statements for the same 
collection into the same query. It is however possible to modify different collections
by using multiple data modification operations for different collections in the
same query.
In case you have a query with several places that need to remove documents from the
same collection, it is recommended to collect these documents or their keys in an array 
and have the documents from that array removed using a single `REMOVE` operation.

Data modification operations can optionally be followed by `LET` operations to 
perform further calculations and a `RETURN` operation to return data.


### Transactional Execution
  
On a single server, data modification operations are executed transactionally.
If a data modification operation fails, any changes made by it are rolled 
back automatically as if they never happened. 

If the RocksDB engine is used and intermediate commits are enabled, a query may 
execute intermediate transaction commits in case the running transaction (AQL
query) hits the specified size thresholds. In this case, the query's operations 
carried out so far are committed and not rolled back in case of a later abort/rollback. 
That behavior can be controlled by adjusting the intermediate commit settings for 
the RocksDB engine. 

In a cluster, AQL data modification queries are not executed transactionally.
Additionally, AQL queries with `UPDATE`, `REPLACE`, `UPSERT`, or `REMOVE`
operations require the `_key` attribute to be specified for all documents that
should be modified or removed, even if a shard key attribute other than `_key`
is chosen for the collection.
