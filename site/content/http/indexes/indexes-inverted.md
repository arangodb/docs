---
fileID: indexes-inverted
title: Working with Inverted Indexes
weight: 2185
description: 
layout: default
---
```http-spec
openapi: 3.0.2
paths:
  /_api/index#inverted:
    post:
      description: |2+
        Creates an inverted index for the collection `collection-name`, if
        it does not already exist. The call expects an object containing the index
        details.
      operationId: ' createIndex:inverted'
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The collection name.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                type:
                  type: string
                  description: |+
                    Must be equal to `"inverted"`.
                name:
                  type: string
                  description: |+
                    An easy-to-remember name for the index to look it up or refer to it in index hints.
                    Index names are subject to the same character restrictions as collection names.
                    If omitted, a name is auto-generated so that it is unique with respect to the
                    collection, e.g. `idx_832910498`.
                fields:
                  type: array
                  schema:
                    $ref: '#/components/schemas/post_api_index_inverted_fields'
                  description: |+
                    An array of attribute paths. You can use strings to index the fields with the
                    default options, or objects to specify options for the fields (with the
                    attribute path in the `name` property), or a mix of both.
                searchField:
                  type: boolean
                  description: |+
                    This option only applies if you use the inverted index in a `search-alias` Views.
                    You can set the option to `true` to get the same behavior as with `arangosearch`
                    Views regarding the indexing of array values as the default. If enabled, both,
                    array and primitive values (strings, numbers, etc.) are accepted. Every element
                    of an array is indexed according to the `trackListPositions` option.
                    If set to `false`, it depends on the attribute path. If it explicitly expands an
                    array (`[*]`), then the elements are indexed separately. Otherwise, the array is
                    indexed as a whole, but only `geopoint` and `aql` Analyzers accept array inputs.
                    You cannot use an array expansion if `searchField` is enabled.
                    Default `false`
                storedValues:
                  type: array
                  schema:
                    $ref: '#/components/schemas/post_api_index_inverted_storedvalues'
                  description: "The optional `storedValues` attribute can contain\
                    \ an array of paths to additional \nattributes to store in the\
                    \ index. These additional attributes cannot be used for\nindex\
                    \ lookups or for sorting, but they can be used for projections.\
                    \ This allows an\nindex to fully cover more queries and avoid\
                    \ extra document lookups.\n\n"
                primarySort:
                  type: object
                  schema:
                    $ref: '#/components/schemas/post_api_index_inverted_primarysort'
                  description: |+
                    You can define a primary sort order to enable an AQL optimization. If a query
                    iterates over all documents of a collection, wants to sort them by attribute values,
                    and the (left-most) fields to sort by, as well as their sorting direction, match
                    with the `primarySort` definition, then the `SORT` operation is optimized away.
                analyzer:
                  type: string
                  description: |+
                    The name of an Analyzer to use by default. This Analyzer is applied to the
                    values of the indexed fields for which you don't define Analyzers explicitly.
                    Default `identity`
                features:
                  type: array
                  description: |+
                    A list of Analyzer features. You can set this option to overwrite what features
                    are enabled for the default `analyzer`. Possible features
                    - `"frequency"`
                    - `"norm"`
                    - `"position"`
                    - `"offset"`
                    Default the features as defined by the Analyzer itself.
                includeAllFields:
                  type: boolean
                  description: |+
                    This option only applies if you use the inverted index in a `search-alias` Views.
                    If set to `true`, then all document attributes are indexed, excluding any
                    sub-attributes that are configured in the `fields` array (and their sub-attributes).
                    The `analyzer` and `features` properties apply to the sub-attributes.
                    Default `false`
                    **Warning** Using `includeAllFields` for a lot of attributes in combination
                    with complex Analyzers may significantly slow down the indexing process.
                trackListPositions:
                  type: boolean
                  description: |+
                    This option only applies if you use the inverted index in a `search-alias` Views.
                    If set to `true`, then track the value position in arrays for array values.
                    For example, when querying a document like `{ attr [ "valueX", "valueY", "valueZ" ] }`,
                    you need to specify the array element, e.g. `doc.attr[1] == "valueY"`.
                    If set to `false`, all values in an array are treated as equal alternatives.
                    You don't specify an array element in queries, e.g. `doc.attr == "valueY"`, and
                    all elements are searched for a match.
                parallelism:
                  type: integer
                  description: |+
                    The number of threads to use for indexing the fields. Default `2`
                inBackground:
                  type: boolean
                  description: |+
                    This attribute can be set to `true` to create the index
                    in the background, not write-locking the underlying collection for
                    as long as if the index is built in the foreground. The default value is `false`.
                cleanupIntervalStep:
                  type: integer
                  description: |+
                    Wait at least this many commits between removing unused files in the
                    ArangoSearch data directory (default 2, to disable use 0).
                    For the case where the consolidation policies merge segments often (i.e. a lot
                    of commit+consolidate), a lower value will cause a lot of disk space to be
                    wasted.
                    For the case where the consolidation policies rarely merge segments (i.e. few
                    inserts/deletes), a higher value will impact performance without any added
                    benefits.
                    _Background_
                      With every "commit" or "consolidate" operation a new state of the View
                      internal data-structures is created on disk.
                      Old states/snapshots are released once there are no longer any users
                      remaining.
                      However, the files for the released states/snapshots are left on disk, and
                      only removed by "cleanup" operation.
                commitIntervalMsec:
                  type: integer
                  description: |+
                    Wait at least this many milliseconds between committing View data store
                    changes and making documents visible to queries (default 1000, to disable
                    use 0).
                    For the case where there are a lot of inserts/updates, a lower value, until
                    commit, will cause the index not to account for them and memory usage would
                    continue to grow.
                    For the case where there are a few inserts/updates, a higher value will impact
                    performance and waste disk space for each commit call without any added
                    benefits.
                    _Background_
                      For data retrieval ArangoSearch Views follow the concept of
                      "eventually-consistent", i.e. eventually all the data in ArangoDB will be
                      matched by corresponding query expressions.
                      The concept of ArangoSearch View "commit" operation is introduced to
                      control the upper-bound on the time until document addition/removals are
                      actually reflected by corresponding query expressions.
                      Once a "commit" operation is complete all documents added/removed prior to
                      the start of the "commit" operation will be reflected by queries invoked in
                      subsequent ArangoDB transactions, in-progress ArangoDB transactions will
                      still continue to return a repeatable-read state.
                consolidationIntervalMsec:
                  type: integer
                  description: |+
                    Wait at least this many milliseconds between applying 'consolidationPolicy' to
                    consolidate View data store and possibly release space on the filesystem
                    (default 1000, to disable use 0).
                    For the case where there are a lot of data modification operations, a higher
                    value could potentially have the data store consume more space and file handles.
                    For the case where there are a few data modification operations, a lower value
                    will impact performance due to no segment candidates available for
                    consolidation.
                    _Background_
                      For data modification ArangoSearch Views follow the concept of a
                      "versioned data store". Thus old versions of data may be removed once there
                      are no longer any users of the old data. The frequency of the cleanup and
                      compaction operations are governed by 'consolidationIntervalMsec' and the
                      candidates for compaction are selected via 'consolidationPolicy'.
                consolidationPolicy:
                  type: object
                  schema:
                    $ref: '#/components/schemas/post_api_index_inverted_policy'
                  description: |+
                    The consolidation policy to apply for selecting which segments should be merged
                    (default {}).
                    _Background_
                      With each ArangoDB transaction that inserts documents one or more
                      ArangoSearch internal segments gets created.
                      Similarly for removed documents the segments that contain such documents
                      will have these documents marked as 'deleted'.
                      Over time this approach causes a lot of small and sparse segments to be
                      created.
                      A "consolidation" operation selects one or more segments and copies all of
                      their valid documents into a single new segment, thereby allowing the
                      search algorithm to perform more optimally and for extra file handles to be
                      released once old segments are no longer used.
                writebufferIdle:
                  type: integer
                  description: |+
                    Maximum number of writers (segments) cached in the pool
                    (default 64, use 0 to disable)
                writebufferActive:
                  type: integer
                  description: |+
                    Maximum number of concurrent active writers (segments) that perform a
                    transaction. Other writers (segments) wait till current active writers
                    (segments) finish (default 0, use 0 to disable)
                writebufferSizeMax:
                  type: integer
                  description: |+
                    Maximum memory byte size per writer (segment) before a writer (segment) flush
                    is triggered. `0` value turns off this limit for any writer (buffer) and data
                    will be flushed periodically based on the value defined for the flush thread
                    (ArangoDB server startup option). `0` value should be used carefully due to
                    high potential memory consumption
                    (default 33554432, use 0 to disable)
              required:
              - type
              - fields
      responses:
        '200':
          description: |2+
            If the index already exists, then a *HTTP 200* is returned.
        '201':
          description: |2+
            If the index does not already exist and can be created, then a *HTTP 201*
            is returned.
      tags:
      - Indexes
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestIndexCreateNewInverted
release: stable
version: '3.10'
---
    var cn = "products";
    db._create(cn);
    var url = "/_api/index?collection=" + cn;
    var body = {
      type: "inverted",
      fields: [ "a", { name: "b", analyzer: "text_en" } ]
    };
    var response = logCurlRequest('POST', url, body);
    assert(response.code === 201);
    logJsonResponse(response);
    db._drop(cn);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

