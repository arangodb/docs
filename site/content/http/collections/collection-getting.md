---
fileID: collection-getting
title: Getting Information about a Collection
weight: 2230
description: 
layout: default
---
<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}:
    get:
      description: |2+
        The result is an object describing the collection with the following
        attributes:
        - *id*: The identifier of the collection.
        - *name*: The name of the collection.
        - *status*: The status of the collection as number.
          - 3: loaded
          - 5: deleted
        Every other status indicates a corrupted collection.
        - *type*: The type of the collection as number.
          - 2: document collection (normal case)
          - 3: edge collection
        - *isSystem*: If *true* then the collection is a system collection.
      operationId: ' handleCommandGet:collectionGetProperties'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      tags:
      - Collections
```



<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/properties:
    get:
      description: ' Read properties of a collection'
      operationId: ' handleCommandGet:collectionProperties'
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
        '404':
          description: |2+
            If the *collection-name* is unknown, then a *HTTP 404*
            is returned.
        '200':
          description: |2+
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/collection_info'
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
name: RestCollectionGetCollectionIdentifier
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn, { waitForSync: true });
    var url = "/_api/collection/"+ coll._id + "/properties";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
  ~ db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCollectionGetCollectionName
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    db._create(cn, { waitForSync: true });
    var url = "/_api/collection/products/properties";
    var response = logCurlRequest('GET', url);
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
  /_api/collection/{collection-name}/count:
    get:
      description: |2+
        In addition to the above, the result also contains the number of documents.
        **Note** that this will always load the collection into memory.
        - *count*: The number of documents inside the collection.
      operationId: ' handleCommandGet:getCollectionCount'
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
name: RestCollectionGetCollectionCount
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn, { waitForSync: true });
    for(var i=0;i<100;i++) {
       coll.save({"count" :  i });
    }
    var url = "/_api/collection/"+ coll.name() + "/count";
    var response = logCurlRequest('GET', url);
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
  /_api/collection/{collection-name}/figures:
    get:
      description: |2+
        In addition to the above, the result also contains the number of documents
        and additional statistical information about the collection.
      operationId: ' handleCommandGet:collectionFigures'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      - name: details
        schema:
          type: boolean
        required: false
        description: |+
          Setting `details` to `true` will return extended storage engine-specific
          details to the figures. The details are intended for debugging ArangoDB itself
          and their format is subject to change. By default, `details` is set to `false`,
          so no details are returned and the behavior is identical to previous versions
          of ArangoDB.
          Please note that requesting `details` may cause additional load and thus have
          an impact on performace.
        in: query
      responses:
        '200':
          description: |2+
            Returns information about the collection
        '400':
          description: |2+
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
          content:
            application/json:
              schema:
                type: object
                properties:
                  figures:
                    type: object
                    schema:
                      $ref: '#/components/schemas/collection_figures'
                    description: |+
                      metrics of the collection
                required:
                - figures
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
name: RestCollectionGetCollectionFigures
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn);
    coll.save({"test":"hello"});
    require("internal").wal.flush(true, true);
    var url = "/_api/collection/"+ coll.name() + "/figures";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCollectionGetCollectionFiguresDetails
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn);
    coll.save({"test":"hello"});
    require("internal").wal.flush(true, true);
    var url = "/_api/collection/"+ coll.name() + "/figures?details=true";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/responsibleShard:
    put:
      description: |2+
        Returns the ID of the shard that is responsible for the given document
        (if the document exists) or that would be responsible if such document
        existed.
        The request must body must contain a JSON document with at least the
        collection's shard key attributes set to some values.
        The response is a JSON object with a *shardId* attribute, which will
        contain the ID of the responsible shard.
        **Note** : This method is only available in a cluster Coordinator.
      operationId: ' getResponsibleShard:Collection'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                document:
                  type: object
                  description: |+
                    The body must consist of a JSON object with at least the shard key
                    attributes set to some values.
              required:
              - document
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
            Returns the ID of the responsible shard.
        '400':
          description: |2+
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
            Additionally, if not all of the collection's shard key
            attributes are present in the input document, then a
            *HTTP 400* is returned as well.
        '404':
          description: |2+
            If the *collection-name* is unknown, then an *HTTP 404*
            is returned.
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
name: RestGetResponsibleShardExample_cluster
release: stable
version: '3.10'
---
    var cn = "testCollection";
    db._drop(cn);
    db._create(cn, { numberOfShards: 3, shardKeys: ["_key"] });
    var body = JSON.stringify({ _key: "testkey", value: 23 });
    var response = logCurlRequestRaw('PUT', "/_api/collection/" + cn + "/responsibleShard", body);
    assert(response.code === 200);
    assert(JSON.parse(response.body).hasOwnProperty("shardId"));
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/shards:
    get:
      description: |2+
        By default returns a JSON array with the shard IDs of the collection.
        If the `details` parameter is set to `true`, it will return a JSON object with the
        shard IDs as object attribute keys, and the responsible servers for each shard mapped to them.
        In the detailed response, the leader shards will be first in the arrays.
        **Note** : This method is only available in a cluster Coordinator.
      operationId: ' shards:Collection'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      - name: details
        schema:
          type: boolean
        required: false
        description: |+
          If set to true, the return value will also contain the responsible servers for the collections' shards.
        in: query
      responses:
        '200':
          description: |2+
            Returns the collection's shards.
        '400':
          description: |2+
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
        '404':
          description: |2+
            If the *collection-name* is unknown, then an *HTTP 404*
            is returned.
      tags:
      - Collections
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input
name: RestGetShards_cluster
release: stable
version: '3.10'
---
    var cn = "testCollection";
    db._drop(cn);
    db._create(cn, { numberOfShards: 3 });
    var response = logCurlRequest('GET', "/_api/collection/" + cn + "/shards");
    assert(response.code === 200);
    logRawResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input
name: RestGetShardsWithDetails_cluster
release: stable
version: '3.10'
---
    var cn = "testCollection";
    db._drop(cn);
    db._create(cn, { numberOfShards: 3 });
    var response = logCurlRequest('GET', "/_api/collection/" + cn + "/shards?details=true");
    assert(response.code === 200);
    logRawResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/revision:
    get:
      description: |2+
        In addition to the above, the result will also contain the
        collection's revision id. The revision id is a server-generated
        string that clients can use to check whether data in a collection
        has changed since the last revision check.
        - *revision*: The collection revision id as a string.
      operationId: ' handleCommandGet:collectionRevision'
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
name: RestCollectionGetCollectionRevision
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn, { waitForSync: false });
    var url = "/_api/collection/"+ coll.name() + "/revision";
    var response = logCurlRequest('GET', url);
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
  /_api/collection/{collection-name}/checksum:
    get:
      description: |2+
        Will calculate a checksum of the meta-data (keys and optionally revision ids) and
        optionally the document data in the collection.
        The checksum can be used to compare if two collections on different ArangoDB
        instances contain the same contents. The current revision of the collection is
        returned too so one can make sure the checksums are calculated for the same
        state of data.
        By default, the checksum will only be calculated on the *_key* system attribute
        of the documents contained in the collection. For edge collections, the system
        attributes *_from* and *_to* will also be included in the calculation.
        By setting the optional query parameter *withRevisions* to *true*, then revision
        ids (*_rev* system attributes) are included in the checksumming.
        By providing the optional query parameter *withData* with a value of *true*,
        the user-defined document attributes will be included in the calculation too.
        **Note**: Including user-defined attributes will make the checksumming slower.
        The response is a JSON object with the following attributes:
        - *checksum*: The calculated checksum as a number.
        - *revision*: The collection revision id as a string.
      operationId: ' handleCommandGet:collectionChecksum'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      - name: withRevisions
        schema:
          type: boolean
        required: false
        description: |+
          Whether or not to include document revision ids in the checksum calculation.
        in: query
      - name: withData
        schema:
          type: boolean
        required: false
        description: |+
          Whether or not to include document body data in the checksum calculation.
        in: query
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
name: RestCollectionGetCollectionChecksum
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn);
    coll.save({ foo: "bar" });
    var url = "/_api/collection/" + coll.name() + "/checksum";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestCollectionGetCollectionChecksumNoRev
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn);
    coll.save({ foo: "bar" });
    var url = "/_api/collection/" + coll.name() + "/checksum?withRevisions=false&withData=true";
    var response = logCurlRequest('GET', url);
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
  /_api/collection:
    get:
      description: |2+
        Returns an object with an attribute *result* containing an
        array of all collection descriptions.
        By providing the optional query parameter *excludeSystem* with a value of
        *true*, all system collections will be excluded from the response.
      operationId: ' handleCommandGet'
      parameters:
      - name: excludeSystem
        schema:
          type: boolean
        required: false
        description: |+
          Whether or not system collections should be excluded from the result.
        in: query
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
name: RestCollectionGetAllCollections
release: stable
version: '3.10'
---
    var url = "/_api/collection";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

