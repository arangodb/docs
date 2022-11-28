---
fileID: collection-modifying
title: Modifying a Collection
weight: 2055
description: 
layout: default
---
<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/load:
    put:
      description: "\nSince ArangoDB version 3.9.0 this API does nothing. Previously\
        \ it used to\nload a collection into memory. \n\nThe request body object might\
        \ optionally contain the following attribute:\n\n- *count*: If set, this controls\
        \ whether the return value should include\n  the number of documents in the\
        \ collection. Setting *count* to\n  *false* may speed up loading a collection.\
        \ The default value for\n  *count* is *true*.\n\nA call to this API returns\
        \ an object with the following attributes for\ncompatibility reasons:\n\n\
        - *id*: The identifier of the collection.\n\n- *name*: The name of the collection.\n\
        \n- *count*: The number of documents inside the collection. This is only\n\
        \  returned if the *count* input parameters is set to *true* or has\n  not\
        \ been specified.\n\n- *status*: The status of the collection as number.\n\
        \n- *type*: The collection type. Valid types are:\n  - 2: document collection\n\
        \  - 3: edge collection\n\n- *isSystem*: If *true* then the collection is\
        \ a system collection.\n\n"
      operationId: ' handleCommandPut:loadCollection'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      responses:
        '400':
          description: |2+
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
      tags:
      - Collections
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCollectionIdentifierLoad
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn, { waitForSync: true });
    var url = "/_api/collection/"+ coll.name() + "/load";
    var response = logCurlRequest('PUT', url, '');
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/unload:
    put:
      description: |2+
        Since ArangoDB version 3.9.0 this API does nothing. Previously it used to
        unload a collection from memory, while preserving all documents.
        When calling the API an object with the following attributes is
        returned for compatibility reasons:
        - *id*: The identifier of the collection.
        - *name*: The name of the collection.
        - *status*: The status of the collection as number.
        - *type*: The collection type. Valid types are:
          - 2: document collection
          - 3: edges collection
        - *isSystem*: If *true* then the collection is a system collection.
      operationId: ' handleCommandPut:collectionUnload'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |2+
        in: path
      responses:
        '400':
          description: |2+
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
      tags:
      - Collections
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCollectionIdentifierUnload
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn, { waitForSync: true });
    var url = "/_api/collection/"+ coll.name() + "/unload";
    var response = logCurlRequest('PUT', url, '');
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/loadIndexesIntoMemory:
    put:
      description: |2+
        You can call this endpoint to try to cache this collection's index entries in
        the main memory. Index lookups served from the memory cache can be much faster
        than lookups not stored in the cache, resulting in a performance boost.
        The endpoint iterates over suitable indexes of the collection and stores the
        indexed values (not the entire document data) in memory. This is implemented for
        edge indexes only.
        The endpoint returns as soon as the index warmup has been scheduled. The index
        warmup may still be ongoing in the background, even after the return value has
        already been sent. As all suitable indexes are scanned, it may cause significant
        I/O activity and background load.
        This feature honors memory limits. If the indexes you want to load are smaller
        than your memory limit, this feature guarantees that most index values are
        cached. If the index is larger than your memory limit, this feature fills
        up values up to this limit. You cannot control which indexes of the collection
        should have priority over others.
        It is guaranteed that the in-memory cache data is consistent with the stored
        index data at all times.
        On success, this endpoint returns an object with attribute `result` set to `true`.
      operationId: ' handleCommandPut:loadIndexes'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |2+
        in: path
      responses:
        '200':
          description: |2+
            If the index loading has been scheduled for all suitable indexes.
        '400':
          description: |2+
            If the `collection-name` is missing, then a *HTTP 400* is
            returned.
      tags:
      - Collections
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCollectionIdentifierLoadIndexesIntoMemory
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn);
    var url = "/_api/collection/"+ coll.name() + "/loadIndexesIntoMemory";
    var response = logCurlRequest('PUT', url, '');
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/properties:
    put:
      description: |2+
        Changes the properties of a collection. Only the provided attributes are
        updated. Collection properties **cannot be changed** once a collection is
        created except for the listed properties, as well as the collection name via
        the rename endpoint (but not in clusters).
      operationId: ' handleCommandPut:modifyProperties'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                waitForSync:
                  type: boolean
                  description: |+
                    If *true* then the data is synchronized to disk before returning from a
                    document create, update, replace or removal operation. (default false)
                cacheEnabled:
                  type: boolean
                  description: |+
                    Whether the in-memory hash cache for documents should be enabled for this
                    collection (default *false*). Can be controlled globally with the `--cache.size`
                    startup option. The cache can speed up repeated reads of the same documents via
                    their document keys. If the same documents are not fetched often or are
                    modified frequently, then you may disable the cache to avoid the maintenance
                    costs.
                schema:
                  type: object
                  description: |+
                    Optional object that specifies the collection level schema for
                    documents. The attribute keys `rule`, `level` and `message` must follow the
                    rules documented in [Document Schema Validation](https//www.arangodb.com/docs/stable/data-modeling-documents-schema-validation.html)
                computedValues:
                  type: array
                  schema:
                    $ref: '#/components/schemas/put_api_collection_properties_computed_field'
                  description: |+
                    An optional list of objects, each representing a computed value.
                replicationFactor:
                  type: integer
                  description: |+
                    (The default is *1*) in a cluster, this attribute determines how many copies
                    of each shard are kept on different DB-Servers. The value 1 means that only one
                    copy (no synchronous replication) is kept. A value of k means that k-1 replicas
                    are kept. It can also be the string `"satellite"` for a SatelliteCollection,
                    where the replication factor is matched to the number of DB-Servers
                    (Enterprise Edition only).
                    Any two copies reside on different DB-Servers. Replication between them is
                    synchronous, that is, every write operation to the "leader" copy will be replicated
                    to all "follower" replicas, before the write operation is reported successful.
                    If a server fails, this is detected automatically and one of the servers holding
                    copies take over, usually without an error being reported.
                writeConcern:
                  type: integer
                  description: |+
                    Write concern for this collection (default 1).
                    It determines how many copies of each shard are required to be
                    in sync on the different DB-Servers. If there are less then these many copies
                    in the cluster a shard will refuse to write. Writes to shards with enough
                    up-to-date copies will succeed at the same time however. The value of
                    *writeConcern* can not be larger than *replicationFactor*. _(cluster only)_
              required: []
      responses:
        '400':
          description: |2+
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
      tags:
      - Collections
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCollectionIdentifierPropertiesSync
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn, { waitForSync: true });
    var url = "/_api/collection/"+ coll.name() + "/properties";
    var response = logCurlRequest('PUT', url, {"waitForSync" : true });
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/rename:
    put:
      description: |2+
        Renames a collection. Expects an object with the attribute(s)
        - *name*: The new name.
        It returns an object with the attributes
        - *id*: The identifier of the collection.
        - *name*: The new name of the collection.
        - *status*: The status of the collection as number.
        - *type*: The collection type. Valid types are:
          - 2: document collection
          - 3: edges collection
        - *isSystem*: If *true* then the collection is a system collection.
        If renaming the collection succeeds, then the collection is also renamed in
        all graph definitions inside the `_graphs` collection in the current database.
        **Note**: this method is not available in a cluster.
      operationId: ' handleCommandPut:renameCollection'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection to rename.
        in: path
      responses:
        '400':
          description: |2+
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
      tags:
      - Collections
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCollectionIdentifierRename
release: stable
version: '3.10'
---
    var cn = "products1";
    var cnn = "newname";
    db._drop(cn);
    db._drop(cnn);
    var coll = db._create(cn);
    var url = "/_api/collection/" + coll.name() + "/rename";
    var response = logCurlRequest('PUT', url, { name: cnn });
    assert(response.code === 200);
    db._flushCache();
    db._drop(cnn);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/recalculateCount:
    put:
      description: |2+
        Recalculates the document count of a collection, if it ever becomes inconsistent.
        It returns an object with the attributes
        - *result*: will be *true* if recalculating the document count succeeded.
      operationId: ' handleCommandPut:recalculateCount'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      responses:
        '200':
          description: |2+
            If the document count was recalculated successfully, *HTTP 200* is returned.
      tags:
      - Collections
```



```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/compact:
    put:
      description: |2+
        Compacts the data of a collection in order to reclaim disk space.
        The operation will compact the document and index data by rewriting the
        underlying .sst files and only keeping the relevant entries.
        Under normal circumstances, running a compact operation is not necessary, as
        the collection data will eventually get compacted anyway. However, in some
        situations, e.g. after running lots of update/replace or remove operations,
        the disk data for a collection may contain a lot of outdated data for which the
        space shall be reclaimed. In this case the compaction operation can be used.
      operationId: ' RestCompactCollectionHandler'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          Name of the collection to compact
        in: path
      responses:
        '200':
          description: |2+
            Compaction started successfully
      tags:
      - Collections
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestApiCollectionCompact
release: stable
version: '3.10'
---
    var cn = "testCollection";
    db._drop(cn);
    db._create(cn);
    var response = logCurlRequest('PUT', '/_api/collection/' + cn + '/compact', '');
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

