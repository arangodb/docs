---
layout: default
description: >-
  The HTTP API for documents lets you create, read, update, and delete documents
  in collections, either one or multiple at a time
redirect_from:
  - document-address-and-etag.html # 3.10 -> 3.10
  - document-working-with-documents.html # 3.10 -> 3.10
---
# HTTP interface for documents

{{ page.description }}
{:class="lead"}

## Basics and terminology

**Documents** in ArangoDB are JSON objects. These objects can be nested (to
any depth) and may contain lists. Each document has a unique
[**document key**](../appendix-glossary.html#document-key) (or _primary key_)
which identifies it within its collection. Furthermore, each document is
uniquely identified
by its [**document identifier**](../appendix-glossary.html#document-handle)
(also called a _document handle_)
across all collections in the same database. Different revisions of
the same document (identified by its identifier) can be distinguished by their
[**document revision**](../appendix-glossary.html#document-revision).
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

All documents contain special attributes that start with an underscore, known
as **system attributes**:

- The [document identifier](../appendix-glossary.html#document-handle) is stored
  as a string in `_id` attribute.
- The [document key](../appendix-glossary.html#document-key) is stored as a
  string in the `_key` attribute.
- The [document revision](../appendix-glossary.html#document-revision) is stored
  as a string in the `_rev` attribute.

You can specify a value for the `_key` attribute when creating a document.
The `_id` and `_key` values are immutable once the document has been created.
The `_rev` value is maintained by ArangoDB automatically.

### Document identifiers

A document identifier (or document handle) uniquely identifies a document in the
database. It consists of the collection's name and the document key
(`_key` attribute) separated by `/`, like `collection-name/document-key`.

### Document keys

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


### Document revisions

{% docublock documentRevision %}

### Document ETags

ArangoDB tries to adhere to the existing HTTP standard as far as
possible. To this end, results of single document queries have the HTTP
header `ETag` set to the document revision enclosed in double quotes.

The basic operations (create, read, exists, replace, update, delete)
for documents are mapped to the standard HTTP methods (`POST`, `GET`,
`HEAD`, `PUT`, `PATCH` and `DELETE`).

If you modify a document, you can use the `If-Match` field to detect conflicts.
The revision of a document can be checking using the HTTP method `HEAD`.

## Document API

### Addresses of documents

Any document can be retrieved using its unique URI:

```
http://server:port/_api/document/<document-identifier>
```

For example, assuming that the document identifier is `demo/362549736`, then the URL
of that document is:

```
http://localhost:8529/_api/document/demo/362549736
```

The above URL schema does not specify a [database name](../appendix-glossary.html#database-name)
explicitly, so the default `_system` database is used. To explicitly specify the
database context, use the following URL schema:

```
http://server:port/_db/<database-name>/_api/document/<document-identifier>
```

For example, using the a database called `mydb`:

```
http://localhost:8529/_db/mydb/_api/document/demo/362549736
```

{% hint 'tip' %}
Many examples in the documentation use the short URL format (and thus the
`_system` database) for brevity.
{% endhint %}

The [document revision](../appendix-glossary.html#document-revision)
is returned in the `ETag` HTTP header when requesting a document.

If you obtain a document using `GET` and you want to check whether a
newer revision
is available, then you can use the `If-None-Match` header. If the document is
unchanged, a **HTTP 412** (precondition failed) error is returned.

If you want to query, replace, update or delete a document, then you
can use the `If-Match` header. If the document has changed, then the
operation is aborted and an **HTTP 412** error is returned.

### Multiple documents in a single request

The document API can handle not only single documents but multiple documents in
a single request. This is crucial for performance, in particular in the cluster
situation, in which a single request can involve multiple network hops
within the cluster. Another advantage is that it reduces the overhead of
the HTTP protocol and individual network round trips between the client
and the server. The general idea to perform multiple document operations
in a single request is to use a JSON array of objects in the place of a
single document. As a consequence, document keys, identifiers and revisions
for preconditions have to be supplied embedded in the individual documents
given. Multiple document operations are restricted to a single collection
(document collection or edge collection).

<!-- TODO: The spec has been changed long ago and payloads are allowed, but there is still a lot of incompatible software -->
Note that the `GET`, `HEAD` and `DELETE` HTTP operations generally do
not allow to pass a message body. Thus, they cannot be used to perform
multiple document operations in one request. However, there are alternative
endpoints to request and delete multiple documents in one request.

### Single document operations

{% docublock get_read_document, h4 %}
{% docublock head_read_document_header, h4 %}
{% docublock post_create_document, h4 %}
{% docublock put_replace_document, h4 %}
{% docublock patch_update_document, h4 %}
{% docublock delete_remove_document, h4 %}

### Multiple document operations

ArangoDB supports working with documents in bulk. Bulk operations affect a
*single* collection. Using this API variant allows clients to amortize the
overhead of single requests over an entire batch of documents. Bulk operations
are **not guaranteed** to be executed serially, ArangoDB _may_ execute the
operations in parallel. This can translate into large performance improvements
especially in a cluster deployment.

ArangoDB continues to process the remaining operations should an error
occur during the processing of one operation. Errors are returned _inline_ in
the response body as an error document (see below for more details).
Additionally, the `X-Arango-Error-Codes` header contains a map of the
error codes that occurred together with their multiplicities, like
`1205:10,1210:17` which means that in 10 cases the error 1205
(illegal document handle) and in 17 cases the error 1210
(unique constraint violated) has happened.

Generally, the bulk operations expect an input array and the result body
contains a JSON array of the same length.

{% docublock get_read_document_MULTI, h4 %}
{% docublock post_create_document_MULTI, h4 %}
{% docublock put_replace_document_MULTI, h4 %}
{% docublock patch_update_document_MULTI, h4 %}
{% docublock delete_remove_document_MULTI, h4 %}

### Read from followers

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
