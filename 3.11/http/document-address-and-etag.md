---
layout: default
description: Documents in ArangoDB are JSON objects
---
Basics and Terminology
======================

Documents, Keys, Handles and Revisions
--------------------------------------

Documents in ArangoDB are JSON objects. These objects can be nested (to
any depth) and may contain lists. Each document has a unique 
[primary key](../appendix-glossary.html#document-key) which 
identifies it within its collection. Furthermore, each document is 
uniquely identified
by its [document handle](../appendix-glossary.html#document-handle) 
across all collections in the same database. Different revisions of
the same document (identified by its handle) can be distinguished by their 
[document revision](../appendix-glossary.html#document-revision).
Any transaction only ever sees a single revision of a document.

Here is an example document:

```json
{
  "_id" : "myusers/3456789",
  "_key" : "3456789",
  "_rev" : "14253647",
  "firstName" : "John",
  "lastName" : "Doe",
  "address" : {
    "street" : "Road To Nowhere 1",
    "city" : "Gotham"
  },
  "hobbies" : [
    {"name": "swimming", "howFavorite": 10},
    {"name": "biking", "howFavorite": 6},
    {"name": "programming", "howFavorite": 4}
  ]
}
```

All documents contain special attributes: the 
[document handle](../appendix-glossary.html#document-handle) is stored
as a string in `_id`, the
[document's primary key](../appendix-glossary.html#document-key) in 
`_key` and the 
[document revision](../appendix-glossary.html#document-revision) in
`_rev`. The value of the `_key` attribute can be specified by the user when
creating a document. `_id` and `_key` values are immutable once the document
has been created. The `_rev` value is maintained by ArangoDB automatically.


Document Handle
---------------

A document handle uniquely identifies a document in the database. It
is a string and consists of the collection's name and the document key
(`_key` attribute) separated by `/`.


Document Key
------------

A document key uniquely identifies a document in the collection it is
stored in. It can and should be used by clients when specific documents
are queried. The document key is stored in the `_key` attribute of
each document. The key values are automatically indexed by ArangoDB in
a collection's primary index. Thus looking up a document by its
key is a fast operation. The _key value of a document is
immutable once the document has been created. By default, ArangoDB generates
a document key automatically if no `_key` attribute is specified, and uses
the user-specified `_key` otherwise.

This behavior can be changed on a per-collection level by creating
collections with the `keyOptions` attribute.

Using `keyOptions` it is possible to disallow user-specified keys
completely, or to force a specific regime for auto-generating the `_key`
values.


Document Revision
-----------------

Every document in ArangoDB has a revision, stored in the system attribute
`_rev`. It is fully managed by the server and read-only for the user.

Its value should be treated as opaque, no guarantees regarding its format
and properties are given except that it will be different after a
document update. More specifically, `_rev` values are unique across all
documents and all collections in a single server setup. In a cluster setup,
within one shard it is guaranteed that two different document revisions
have a different `_rev` string, even if they are written in the same
millisecond.

The `_rev` attribute can be used as a pre-condition for queries, to avoid
_lost update_ situations. That is, if a client fetches a document from the server,
modifies it locally (but with the `_rev` attribute untouched) and sends it back
to the server to update the document, but meanwhile the document was changed by
another operation, then the revisions do not match anymore and the operation
is cancelled by the server. Without this mechanism, the client would
accidentally overwrite changes made to the document without knowing about it.

When an existing document is updated or replaced, ArangoDB will write a new
version of this document to the write-ahead logfile (regardless of the
storage engine). When the new version of the document has been written, the
old version(s) will still be present, at least on disk. The same is true when
an existing document (version) gets removed: the old version of the document
plus the removal operation will be on disk for some time.

On disk it is therefore possible that multiple revisions of the same document
(as identified by the same `_key` value) exist at the same time. However,
stale revisions **are not accessible**. Once a document was updated or removed
successfully, no query or other data retrieval operation done by the user
will be able to see it any more. Furthermore, after some time, old revisions
will be removed internally. This is to avoid ever-growing disk usage.

{% hint 'warning' %}
From a **user perspective**, there is just **one single document revision
present per different `_key`** at every point in time. There is no built-in
system to automatically keep a history of all changes done to a document
and old versions of a document can not be restored via the `_rev` value.
{% endhint %}


Document Etag
-------------

ArangoDB tries to adhere to the existing HTTP standard as far as
possible. To this end, results of single document queries have the HTTP
header `Etag` set to the document revision enclosed in double quotes.

The basic operations (create, read, exists, replace, update, delete)
for documents are mapped to the standard HTTP methods (`POST`, `GET`,
`HEAD`, `PUT`, `PATCH` and `DELETE`).

If you modify a document, you can use the `If-Match` field to detect conflicts. 
The revision of a document can be checking using the HTTP method `HEAD`.


Multiple Documents in a single Request
--------------------------------------

The document API can handle not only single documents but multiple documents in
a single request. This is crucial for performance, in particular in the cluster
situation, in which a single request can involve multiple network hops
within the cluster. Another advantage is that it reduces the overhead of
the HTTP protocol and individual network round trips between the client
and the server. The general idea to perform multiple document operations 
in a single request is to use a JSON array of objects in the place of a 
single document. As a consequence, document keys, handles and revisions
for preconditions have to be supplied embedded in the individual documents
given. Multiple document operations are restricted to a single document
or edge collections. 
See the [API descriptions](document-working-with-documents.html) for details.

Note that the `GET`, `HEAD` and `DELETE` HTTP operations generally do
not allow to pass a message body. Thus, they cannot be used to perform
multiple document operations in one request. However, there are other
endpoints to request and delete multiple documents in one request.
See [Bulk Document Operations](document-working-with-documents.html#bulk-document-operations).

URI of a Document
-----------------

Any document can be retrieved using its unique URI:

```
http://server:port/_api/document/<document-handle>
```

For example, assuming that the document handle
is `demo/362549736`, then the URL of that document
is:

```
http://localhost:8529/_api/document/demo/362549736
```

The above URL schema does not specify a 
[database name](../appendix-glossary.html#database-name) 
explicitly, so the default `_system` database is used.
To explicitly specify the database context, use
the following URL schema:

```
http://server:port/_db/<database-name>/_api/document/<document-handle>
```

Example:

```
http://localhost:8529/_db/mydb/_api/document/demo/362549736
```

**Note**: The following examples use the short URL format for brevity.

The [document revision](../appendix-glossary.html#document-revision) 
is returned in the "Etag" HTTP header when requesting a document.

If you obtain a document using `GET` and you want to check whether a 
newer revision
is available, then you can use the `If-None-Match` header. If the document is
unchanged, a *HTTP 412* (precondition failed) error is returned.

If you want to query, replace, update or delete a document, then you
can use the `If-Match` header. If the document has changed, then the
operation is aborted and an *HTTP 412* error is returned.

Read from Followers
-------------------

<small>Introduced in: v3.10.0</small>

{% include hint-ee-arangograph.md feature="Reading from followers in cluster deployments" %}

In an ArangoDB cluster, all reads and writes are performed via
the shard leaders. Shard replicas replicate all operations, but are
only on hot standby to take over in case of a failure. This is to ensure
consistency of reads and writes and allows giving a certain amount of
transactional guarantees.

If high throughput is more important than consistency and transactional
guarantees for you, then you may allow for so-called "dirty reads" or
"reading from followers", for certain read-only operations. In this case,
Coordinators are allowed to read not only from
leader shards but also from follower shards. This has a positive effect,
because the reads can scale out to all DB-Servers which have copies of
the data. Therefore, the read throughput is higher. Note however, that you
still have to go through your Coordinators. To get the desired result, you
have to have enough Coordinators, load balance your client requests
across all of them, and then allow reads from followers.

You may observe the following data inconsistencies (dirty reads) when
reading from followers:

- It is possible to see old, **obsolete revisions** of documents. More
  exactly, it is possible that documents are already updated on the leader shard
  but the updates have not yet been replicated to the follower shard
  from which you are reading.

- It is also possible to see changes to documents that
  **have already happened on a replica**, but are not yet officially
  committed on the leader shard.

When no writes are happening, allowing reading from followers is generally safe.

The following APIs support reading from followers:

- Single document reads (`GET /_api/document`)
- Batch document reads (`PUT /_api/document?onlyget=true`)
- Read-only AQL queries (`POST /_api/cursor`)
- The edge API (`GET /_api/edges`)
- Read-only Stream Transactions and their sub-operations
  (`POST /_api/transaction/begin` etc.)

The following APIs do not support reading from followers:

- The graph API (`GET /_api/gharial` etc.)
- JavaScript Transactions (`POST /_api/transaction`)

You need to set the following HTTP header in API requests to ask for reads
from followers:

```
x-arango-allow-dirty-read: true
```

This is in line with the older support to read from followers in the
[Active Failover](../architecture-deployment-modes-active-failover.html#reading-from-followers)
deployment mode.

For single requests, you specify this header in the read request.
For Stream Transactions, the header has to be set on the request that
creates a read-only transaction.

The `POST /_api/cursor` endpoint also supports a query option that you can set
instead of the HTTP header:

```json
{ "query": "...", "options": { "allowDirtyReads": true } }
```

Every response to a request that could produce dirty reads has
the following HTTP header:

```
x-arango-potential-dirty-read: true
```
