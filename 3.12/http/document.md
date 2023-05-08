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

The basic operations for documents are mapped to the standard HTTP methods:

- Create: `POST`
- Read: `GET`
- Update: `PATCH` (partially modify)
- Replace: `PUT`
- Delete: `DELETE`
- Check: `HEAD` (test for existence and get document metadata)

## Addresses of documents

Any document can be retrieved using its unique URI:

```
http://server:port/_api/document/<document-identifier>
```

For example, assuming that the document identifier is `demo/362549736`, then the URL
of that document is:

```
http://localhost:8529/_api/document/demo/362549736
```

The above URL schema does not specify a [database name](../data-modeling-databases.html#database-names)
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

{% docublock get_api_document_collection_key, h4 %}
{% docublock head_api_document_collection_key, h4 %}
{% docublock post_api_document_collection, h4 %}
{% docublock put_api_document_collection_key, h4 %}
{% docublock patch_api_document_collection_key, h4 %}
{% docublock delete_api_document_collection_key, h4 %}

#### Document ETags

ArangoDB tries to adhere to the existing HTTP standard as far as
possible. To this end, results of single document queries have the `ETag`
HTTP header set to the [document revision](../data-modeling-documents.html#document-revisions)
(the value of `_rev` document attribute) enclosed in double quotes.

You can check the revision of a document using the `HEAD` HTTP method.

If you want to query, replace, update, replace, or delete a document, then you
can use the `If-Match` header to detect conflicts. If the document has changed,
the operation is aborted and an HTTP `412 Precondition failed` status code is
returned.

If you obtain a document using `GET` and you want to check whether a newer
revision is available, then you can use the `If-None-Match` HTTP header. If the
document is unchanged (same document revision), an HTTP `412 Precondition failed`
status code is returned.

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

{% docublock get_api_document_collection, h4 %}
{% docublock post_api_document_collection_multiple, h4 %}
{% docublock put_api_document_collection, h4 %}
{% docublock patch_api_document_collection, h4 %}
{% docublock delete_api_document_collection, h4 %}

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
