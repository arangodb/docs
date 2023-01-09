---
fileID: collection-creating
title: Creating and Deleting Collections
weight: 1955
description: 
layout: default
---
<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection:
    post:
      description: |2+
        Creates a new collection with a given name. The request must contain an
        object with the following attributes.
      operationId: ' handleCommandPost:CreateCollection'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: |+
                    The name of the collection.
                waitForSync:
                  type: boolean
                  description: |+
                    If `true` then the data is synchronized to disk before returning from a
                    document create, update, replace or removal operation. (Default: `false`)
                isSystem:
                  type: boolean
                  description: |+
                    If `true`, create a system collection. In this case, the `collection-name`
                    should start with an underscore. End-users should normally create non-system
                    collections only. API implementors may be required to create system
                    collections in very special occasions, but normally a regular collection will do.
                    (The default is `false`)
                schema:
                  type: object
                  description: |+
                    Optional object that specifies the collection level schema for
                    documents. The attribute keys `rule`, `level` and `message` must follow the
                    rules documented in [Document Schema Validation](https://www.arangodb.com/docs/stable/documents-schema-validation.html)
                computedValues:
                  $ref: '#/components/schemas/post_api_collection_computed_field'
                  items:
                    type: post_api_collection_computed_field
                  description: |+
                    An optional list of objects, each representing a computed value.
                keyOptions:
                  $ref: '#/components/schemas/post_api_collection_opts'
                  description: |+
                    additional options for key generation. If specified, then `keyOptions`
                    should be a JSON object containing the following attributes:
                type:
                  type: integer
                  format: int64
                  description: |+
                    (The default is `2`): the type of the collection to create.
                    The following values for `type` are valid:
                    - `2`: document collection
                    - `3`: edge collection
                cacheEnabled:
                  type: boolean
                  description: |+
                    Whether the in-memory hash cache for documents should be enabled for this
                    collection (default: `false`). Can be controlled globally with the `--cache.size`
                    startup option. The cache can speed up repeated reads of the same documents via
                    their document keys. If the same documents are not fetched often or are
                    modified frequently, then you may disable the cache to avoid the maintenance
                    costs.
                numberOfShards:
                  type: integer
                  format: int64
                  description: |+
                    (The default is `1`): in a cluster, this value determines the
                    number of shards to create for the collection. In a single
                    server setup, this option is meaningless.
                shardKeys:
                  type: string
                  description: |+
                    (The default is `[ "_key" ]`): in a cluster, this attribute determines
                    which document attributes are used to determine the target shard for documents.
                    Documents are sent to shards based on the values of their shard key attributes.
                    The values of all shard key attributes in a document are hashed,
                    and the hash value is used to determine the target shard.
                    **Note**: Values of shard key attributes cannot be changed once set.
                      This option is meaningless in a single server setup.
                replicationFactor:
                  type: integer
                  format: int64
                  description: |+
                    (The default is `1`): in a cluster, this attribute determines how many copies
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
                  format: int64
                  description: |+
                    Write concern for this collection (default: 1).
                    It determines how many copies of each shard are required to be
                    in sync on the different DB-Servers. If there are less then these many copies
                    in the cluster a shard will refuse to write. Writes to shards with enough
                    up-to-date copies will succeed at the same time however. The value of
                    `writeConcern` cannot be larger than `replicationFactor`. _(cluster only)_
                shardingStrategy:
                  type: string
                  description: |+
                    This attribute specifies the name of the sharding strategy to use for
                    the collection. Since ArangoDB 3.4 there are different sharding strategies
                    to select from when creating a new collection. The selected `shardingStrategy`
                    value remains fixed for the collection and cannot be changed afterwards.
                    This is important to make the collection keep its sharding settings and
                    always find documents already distributed to shards using the same
                    initial sharding algorithm.
                    The available sharding strategies are:
                    - `community-compat`: default sharding used by ArangoDB
                      Community Edition before version 3.4
                    - `enterprise-compat`: default sharding used by ArangoDB
                      Enterprise Edition before version 3.4
                    - `enterprise-smart-edge-compat`: default sharding used by smart edge
                      collections in ArangoDB Enterprise Edition before version 3.4
                    - `hash`: default sharding used for new collections starting from version 3.4
                      (excluding smart edge collections)
                    - `enterprise-hash-smart-edge`: default sharding used for new
                      smart edge collections starting from version 3.4
                    - `enterprise-hex-smart-vertex`: sharding used for vertex collections of
                      EnterpriseGraphs
                    If no sharding strategy is specified, the default is `hash` for
                    all normal collections, `enterprise-hash-smart-edge` for all smart edge
                    collections, and `enterprise-hex-smart-vertex` for EnterpriseGraph
                    vertex collections (the latter two require the *Enterprise Edition* of ArangoDB).
                    Manually overriding the sharding strategy does not yet provide a
                    benefit, but it may later in case other sharding strategies are added.
                distributeShardsLike:
                  type: string
                  description: |+
                    The name of another collection. If this property is set in a cluster, the
                    collection copies the `replicationFactor`, `numberOfShards` and `shardingStrategy`
                    properties from the specified collection (referred to as the _prototype collection_)
                    and distributes the shards of this collection in the same way as the shards of
                    the other collection. In an Enterprise Edition cluster, this data co-location is
                    utilized to optimize queries.
                    You need to use the same number of `shardKeys` as the prototype collection, but
                    you can use different attributes.
                    The default is `""`.
                    **Note**: Using this parameter has consequences for the prototype
                    collection. It can no longer be dropped, before the sharding-imitating
                    collections are dropped. Equally, backups and restores of imitating
                    collections alone generate warnings (which can be overridden)
                    about a missing sharding prototype.
                isSmart:
                  type: boolean
                  description: |+
                    Whether the collection is for a SmartGraph or EnterpriseGraph
                    (Enterprise Edition only). This is an internal property.
                isDisjoint:
                  type: boolean
                  description: |+
                    Whether the collection is for a Disjoint SmartGraph
                    (Enterprise Edition only). This is an internal property.
                smartGraphAttribute:
                  type: string
                  description: |+
                    The attribute that is used for sharding: vertices with the same value of
                    this attribute are placed in the same shard. All vertices are required to
                    have this attribute set and it has to be a string. Edges derive the
                    attribute from their connected vertices.
                    This feature can only be used in the *Enterprise Edition*.
                smartJoinAttribute:
                  type: string
                  description: |+
                    In an *Enterprise Edition* cluster, this attribute determines an attribute
                    of the collection that must contain the shard key value of the referred-to
                    SmartJoin collection. Additionally, the shard key for a document in this
                    collection must contain the value of this attribute, followed by a colon,
                    followed by the actual primary key of the document.
                    This feature can only be used in the *Enterprise Edition* and requires the
                    `distributeShardsLike` attribute of the collection to be set to the name
                    of another collection. It also requires the `shardKeys` attribute of the
                    collection to be set to a single shard key attribute, with an additional ':'
                    at the end.
                    A further restriction is that whenever documents are stored or updated in the
                    collection, the value stored in the `smartJoinAttribute` must be a string.
              required:
              - name
      parameters:
      - name: waitForSyncReplication
        schema:
          type: boolean
        required: false
        description: |+
          The default is `true`, which means the server only reports success back to the
          client when all replicas have created the collection. Set it to `false` if you want
          faster server responses and don't care about full replication.
        in: query
      - name: enforceReplicationFactor
        schema:
          type: boolean
        required: false
        description: |+
          The default is `true`, which means the server checks if there are enough replicas
          available at creation time and bail out otherwise. Set it to `false` to disable
          this extra check.
        in: query
      responses:
        '400':
          description: |2
            If the `collection-name` is missing, then an *HTTP 400* is
            returned.
        '404':
          description: |2
            If the `collection-name` is unknown, then an *HTTP 404* is returned.
        '200':
          description: |2+
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
name: RestCollectionCreateCollection
release: stable
version: '3.10'
---
    var url = "/_api/collection";
    var body = {
      name: "testCollectionBasics"
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    body = {
      name: "testCollectionEdges",
      type : 3
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    db._flushCache();
    db._drop("testCollectionBasics");
    db._drop("testCollectionEdges");
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
name: RestCollectionCreateKeyopt
release: stable
version: '3.10'
---
    var url = "/_api/collection";
    var body = {
      name: "testCollectionUsers",
      keyOptions : {
        type : "autoincrement",
        increment : 5,
        allowUserKeys : true
      }
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
    db._flushCache();
    db._drop("testCollectionUsers");
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}:
    delete:
      description: |2+
        Drops the collection identified by *collection-name*.
        If the collection was successfully dropped, an object is returned with
        the following attributes:
        - *error*: *false*
        - *id*: The identifier of the dropped collection.
      operationId: ' handleCommandDelete:collection'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection to drop.
        in: path
      - name: isSystem
        schema:
          type: boolean
        required: false
        description: |+
          Whether or not the collection to drop is a system collection. This parameter
          must be set to *true* in order to drop a system collection.
        in: query
      responses:
        '400':
          description: |2
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
        '404':
          description: |2
            If the *collection-name* is unknown, then a *HTTP 404* is returned.
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
name: RestCollectionDeleteCollectionIdentifier
release: stable
version: '3.10'
---
    var cn = "products1";
    var coll = db._create(cn, { waitForSync: true });
    var url = "/_api/collection/"+ coll._id;
    var response = logCurlRequest('DELETE', url);
    db[cn] = undefined;
    assert(response.code === 200);
    logJsonResponse(response);
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
name: RestCollectionDeleteCollectionName
release: stable
version: '3.10'
---
    var cn = "products1";
    db._drop(cn);
    db._create(cn);
    var url = "/_api/collection/products1";
    var response = logCurlRequest('DELETE', url);
    db[cn] = undefined;
    assert(response.code === 200);
    logJsonResponse(response);
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
name: RestCollectionDeleteCollectionSystem
release: stable
version: '3.10'
---
    var cn = "_example";
    db._drop(cn, { isSystem: true });
    db._create(cn, { isSystem: true });
    var url = "/_api/collection/_example?isSystem=true";
    var response = logCurlRequest('DELETE', url);
    db[cn] = undefined;
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- js/actions/api-collection.js -->
```http-spec
openapi: 3.0.2
paths:
  /_api/collection/{collection-name}/truncate:
    put:
      description: |2+
        Removes all documents from the collection, but leaves the indexes intact.
      operationId: ' handleCommandPut:truncateCollection'
      parameters:
      - name: collection-name
        schema:
          type: string
        required: true
        description: |+
          The name of the collection.
        in: path
      - name: waitForSync
        schema:
          type: boolean
        required: false
        description: |+
          If *true* then the data is synchronized to disk before returning from the
          truncate operation (default *false*)
        in: query
      - name: compact
        schema:
          type: boolean
        required: false
        description: "If *true* (default) then the storage engine is told to start\
          \ a compaction\nin order to free up disk space. This can be resource intensive.\
          \ If the only \nintention is to start over with an empty collection, specify\
          \ *false*.\n\n"
        in: query
      responses:
        '400':
          description: |2
            If the *collection-name* is missing, then a *HTTP 400* is
            returned.
        '404':
          description: |2
            If the *collection-name* is unknown, then a *HTTP 404*
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
name: RestCollectionIdentifierTruncate
release: stable
version: '3.10'
---
    var cn = "products";
    db._drop(cn);
    var coll = db._create(cn, { waitForSync: true });
    var url = "/_api/collection/"+ coll.name() + "/truncate";
    var response = logCurlRequest('PUT', url, '');
    assert(response.code === 200);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

