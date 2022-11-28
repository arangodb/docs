---
fileID: replications-replication-dump
title: Replication Dump Commands
weight: 2250
description: 
layout: default
---
The *inventory* method can be used to query an ArangoDB database's current
set of collections plus their indexes. Clients can use this method to get an 
overview of which collections are present in the database. They can use this information
to either start a full or a partial synchronization of data, e.g. to initiate a backup
or the incremental data synchronization.

<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/inventory:
    get:
      description: "\nReturns the array of collections and their indexes, and the\
        \ array of views available. These\narrays can be used by replication clients\
        \ to initiate an initial synchronization with the\nserver. \nThe response\
        \ will contain all collections, their indexes and views in the requested database\n\
        if *global* is not set, and all collections, indexes and views in all databases\
        \ if *global*\nis set.\nIn case *global* is not set, it is possible to restrict\
        \ the response to a single collection\nby setting the *collection* parameter.\
        \ In this case the response will contain only information\nabout the requested\
        \ collection in the *collections* array, and no information about views\n\
        (i.e. the *views* response attribute will be an empty array).\n\nThe response\
        \ will contain a JSON object with the *collections*, *views*, *state* and\n\
        *tick* attributes.\n\n*collections* is an array of collections with the following\
        \ sub-attributes:\n\n- *parameters*: the collection properties\n\n- *indexes*:\
        \ an array of the indexes of a the collection. Primary indexes and edge indexes\n\
        \   are not included in this array.\n\nThe *state* attribute contains the\
        \ current state of the replication logger. It\ncontains the following sub-attributes:\n\
        \n- *running*: whether or not the replication logger is currently active.\
        \ Note:\n  since ArangoDB 2.2, the value will always be *true*\n\n- *lastLogTick*:\
        \ the value of the last tick the replication logger has written\n\n- *time*:\
        \ the current time on the server\n\n*views* is an array of available views.\n\
        \nReplication clients should note the *lastLogTick* value returned. They can\
        \ then\nfetch collections' data using the dump method up to the value of lastLogTick,\
        \ and\nquery the continuous replication log for log events after this tick\
        \ value.\n\nTo create a full copy of the collections on the server, a replication\
        \ client\ncan execute these steps:\n\n- call the */inventory* API method.\
        \ This returns the *lastLogTick* value and the\n  array of collections and\
        \ indexes from the server.\n\n- for each collection returned by */inventory*,\
        \ create the collection locally and\n  call */dump* to stream the collection\
        \ data to the client, up to the value of\n  *lastLogTick*.\n  After that,\
        \ the client can create the indexes on the collections as they were\n  reported\
        \ by */inventory*.\n\nIf the clients wants to continuously stream replication\
        \ log events from the logger\nserver, the following additional steps need\
        \ to be carried out:\n\n- the client should call */_api/wal/tail* initially\
        \ to fetch the first batch of\n  replication events that were logged after\
        \ the client's call to */inventory*.\n\n  The call to */_api/wal/tail* should\
        \ use a *from* parameter with the value of the\n  *lastLogTick* as reported\
        \ by */inventory*. The call to */_api/wal/tail* will\n  return the *x-arango-replication-lastincluded*\
        \ header which will contain the\n  last tick value included in the response.\n\
        \n- the client can then continuously call */_api/wal/tail* to incrementally\
        \ fetch new\n  replication events that occurred after the last transfer.\n\
        \n  Calls should use a *from* parameter with the value of the *x-arango-replication-lastincluded*\n\
        \  header of the previous response. If there are no more replication events,\
        \ the\n  response will be empty and clients can go to sleep for a while and\
        \ try again\n  later.\n\n**Note**: on a Coordinator, this request must have\
        \ the query parameter\n*DBserver* which must be an ID of a DB-Server.\nThe\
        \ very same request is forwarded synchronously to that DB-Server.\nIt is an\
        \ error if this attribute is not bound in the Coordinator case.\n\n**Note**:\
        \ Using the `global` parameter the top-level object contains a key `databases`\n\
        under which each key represents a database name, and the value conforms to\
        \ the above description.\n\n"
      operationId: ' handleCommandInventory'
      parameters:
      - name: includeSystem
        schema:
          type: boolean
        required: false
        description: |+
          Include system collections in the result. The default value is *true*.
        in: query
      - name: global
        schema:
          type: boolean
        required: false
        description: |+
          Include all databases in the response. Only works on `_system` The default value is *false*.
        in: query
      - name: batchId
        schema:
          type: number
        required: true
        description: |+
          A valid batchId is required for this API call
        in: query
      - name: collection
        schema:
          type: string
        required: false
        description: |+
          If this parameter is set, the response will be restricted to a single collection (the one
          specified), and no views will be returned. This can be used as an optimization to reduce
          the size of the response.
        in: query
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
      tags:
      - Replication
```



The *batch* method will create a snapshot of the current state that then can be
dumped. A batchId is required when using the dump API with RocksDB.

```http-spec
openapi: 3.0.2
paths:
  /_api/replication/batch:
    post:
      description: |2+
        Creates a new dump batch and returns the batch's id.
        The response is a JSON object with the following attributes:
        - *id*: the id of the batch
        - *lastTick*: snapshot tick value using when creating the batch
        - *state*: additional leader state information (only present if the
          `state` URL parameter was set to `true` in the request)
        **Note**: on a Coordinator, this request must have the query parameter
        *DBserver* which must be an ID of a DB-Server.
        The very same request is forwarded synchronously to that DB-Server.
        It is an error if this attribute is not bound in the Coordinator case.
      operationId: ' handleCommandBatch:Create'
      parameters:
      - name: state
        schema:
          type: boolean
        required: false
        description: "setting `state` to true will make the response also contain\n\
          a `state` attribute with information about the leader state.\nThis is used\
          \ only internally during the replication process \nand should not be used\
          \ by client applications.\n\n"
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                ttl:
                  type: integer
                  description: |+
                    The time-to-live for the new batch (in seconds).
              required:
              - ttl
      responses:
        '200':
          description: |2+
            is returned if the batch was created successfully.
        '400':
          description: |2+
            is returned if the ttl value is invalid or if *DBserver* attribute
            is not specified or illegal on a Coordinator.
      tags:
      - Replication
```


```http-spec
openapi: 3.0.2
paths:
  /_api/replication/batch/{id}:
    delete:
      description: |2+
        Deletes the existing dump batch, allowing compaction and cleanup to resume.
        **Note**: on a Coordinator, this request must have the query parameter
        *DBserver* which must be an ID of a DB-Server.
        The very same request is forwarded synchronously to that DB-Server.
        It is an error if this attribute is not bound in the Coordinator case.
      operationId: handleCommandBatch:DELETE
      parameters:
      - name: id
        schema:
          type: string
        required: true
        description: |+
          The id of the batch.
        in: path
      responses:
        '204':
          description: |2+
            is returned if the batch was deleted successfully.
        '400':
          description: |2+
            is returned if the batch was not found.
      tags:
      - Replication
```


```http-spec
openapi: 3.0.2
paths:
  /_api/replication/batch/{id}:
    put:
      description: |2+
        Extends the ttl of an existing dump batch, using the batch's id and
        the provided ttl value.
        If the batch's ttl can be extended successfully, the response is empty.
        **Note**: on a Coordinator, this request must have the query parameter
        *DBserver* which must be an ID of a DB-Server.
        The very same request is forwarded synchronously to that DB-Server.
        It is an error if this attribute is not bound in the Coordinator case.
      operationId: ' handleCommandBatch:Prolong'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                ttl:
                  type: integer
                  description: |+
                    the time-to-live for the new batch (in seconds)
              required:
              - ttl
      parameters:
      - name: id
        schema:
          type: string
        required: true
        description: |+
          The id of the batch.
        in: path
      responses:
        '204':
          description: |2+
            is returned if the batch's ttl was extended successfully.
        '400':
          description: |2+
            is returned if the ttl value is invalid or the batch was not found.
      tags:
      - Replication
```



The *dump* method can be used to fetch data from a specific collection. As the
results of the dump command can be huge, *dump* may not return all data from a collection
at once. Instead, the dump command may be called repeatedly by replication clients
until there is no more data to fetch. The dump command will not only return the
current documents in the collection, but also document updates and deletions.

Please note that the *dump* method will only return documents, updates and deletions
from a collection's journals and datafiles. Operations that are stored in the write-ahead
log only will not be returned. In order to ensure that these operations are included
in a dump, the write-ahead log must be flushed first. 

To get to an identical state of data, replication clients should apply the individual
parts of the dump results in the same order as they are provided.

<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/dump:
    get:
      description: |2+
        Returns the data from the collection for the requested range.
        The *chunkSize* query parameter can be used to control the size of the result.
        It must be specified in bytes. The *chunkSize* value will only be honored
        approximately. Otherwise a too low *chunkSize* value could cause the server
        to not be able to put just one entry into the result and return it.
        Therefore, the *chunkSize* value will only be consulted after an entry has
        been written into the result. If the result size is then bigger than
        *chunkSize*, the server will respond with as many entries as there are
        in the response already. If the result size is still smaller than *chunkSize*,
        the server will try to return more data if there's more data left to return.
        If *chunkSize* is not specified, some server-side default value will be used.
        The *Content-Type* of the result is *application/x-arango-dump*. This is an
        easy-to-process format, with all entries going onto separate lines in the
        response body.
        Each line itself is a JSON object, with at least the following attributes:
        - *tick*: the operation's tick attribute
        - *key*: the key of the document/edge or the key used in the deletion operation
        - *rev*: the revision id of the document/edge or the deletion operation
        - *data*: the actual document/edge data for types 2300 and 2301. The full
          document/edge data will be returned even for updates.
        - *type*: the type of entry. Possible values for *type* are:
          - 2300: document insertion/update
          - 2301: edge insertion/update
          - 2302: document/edge deletion
        **Note**: there will be no distinction between inserts and updates when calling this method.
      operationId: handleCommandDump
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name or id of the collection to dump.
        in: query
      - name: chunkSize
        schema:
          type: number
        required: false
        description: |+
          Approximate maximum size of the returned result.
        in: query
      - name: batchId
        schema:
          type: number
        required: true
        description: |+
          The id of the snapshot to use
        in: query
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully and data was returned. The header
            `x-arango-replication-lastincluded` is set to the tick of the last document returned.
        '204':
          description: |2+
            is returned if the request was executed successfully, but there was no content available.
            The header `x-arango-replication-lastincluded` is `0` in this case.
        '404':
          description: |2+
            is returned when the collection could not be found.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
      tags:
      - Replication
```



<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/revisions/tree:
    get:
      description: |2+
        Returns the Merkle tree from the collection.
        The result will be JSON/VelocyPack in the following format:
        ```
        {
          version: <Number>,
          branchingFactor: <Number>
          maxDepth: <Number>,
          rangeMin: <String, revision>,
          rangeMax: <String, revision>,
          nodes: [
            { count: <Number>, hash: <String, revision> },
            { count: <Number>, hash: <String, revision> },
            ...
            { count: <Number>, hash: <String, revision> }
          ]
        }
        ```
        At the moment, there is only one version, 1, so this can safely be ignored for
        now.
        Each `<String, revision>` value type is a 64-bit value encoded as a string of
        11 characters, using the same encoding as our document `_rev` values. The
        reason for this is that 64-bit values cannot necessarily be represented in full
        in JavaScript, as it handles all numbers as floating point, and can only
        represent up to `2^53-1` faithfully.
        The node count should correspond to a full tree with the given `maxDepth` and
        `branchingFactor`. The nodes are laid out in level-order tree traversal, so the
        root is at index `0`, its children at indices `[1, branchingFactor]`, and so
        on.
      operationId: handleCommandRevisionTree
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name or id of the collection to query.
        in: query
      - name: batchId
        schema:
          type: number
        required: true
        description: |+
          The id of the snapshot to use
        in: query
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully and data was returned.
        '401':
          description: |2+
            is returned if necessary parameters are missing
        '404':
          description: |2+
            is returned when the collection or snapshot could not be found.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if an error occurred while assembling the response.
      tags:
      - Replication
```


```http-spec
openapi: 3.0.2
paths:
  /_api/replication/revisions/tree:
    post:
      description: |2+
        Rebuilds the Merkle tree for the collection.
        If successful, there will be no return body.
      operationId: handleCommandRebuildRevisionTree
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name or id of the collection to query.
        in: query
      responses:
        '204':
          description: |2+
            is returned if the request was executed successfully.
        '401':
          description: |2+
            is returned if necessary parameters are missing
        '404':
          description: |2+
            is returned when the collection or could not be found.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if an error occurred while assembling the response.
      tags:
      - Replication
```


```http-spec
openapi: 3.0.2
paths:
  /_api/replication/revisions/ranges:
    put:
      description: |2+
        Returns the revision IDs of documents within requested ranges
        The body of the request should be JSON/VelocyPack and should consist of an
        array of pairs of string-encoded revision IDs:
        ```
        [
          [<String, revision>, <String, revision>],
          [<String, revision>, <String, revision>],
          ...
          [<String, revision>, <String, revision>]
        ]
        ```
        In particular, the pairs should be non-overlapping, and sorted in ascending
        order of their decoded values.
        The result will be JSON/VelocyPack in the following format:
        ```
        {
          ranges: [
            [<String, revision>, <String, revision>, ... <String, revision>],
            [<String, revision>, <String, revision>, ... <String, revision>],
            ...,
            [<String, revision>, <String, revision>, ... <String, revision>]
          ]
          resume: <String, revision>
        }
        ```
        The `resume` field is optional. If specified, then the response is to be
        considered partial, only valid through the revision specified. A subsequent
        request should be made with the same request body, but specifying the `resume`
        URL parameter with the value specified. The subsequent response will pick up
        from the appropriate request pair, and omit any complete ranges or revisions
        which are less than the requested resume revision. As an example (ignoring the
        string-encoding for a moment), if ranges `[1, 3], [5, 9], [12, 15]` are
        requested, then a first response may return `[], [5, 6]` with a resume point of
        `7` and a subsequent response might be `[8], [12, 13]`.
        If a requested range contains no revisions, then an empty array is returned.
        Empty ranges will not be omitted.
        Each `<String, revision>` value type is a 64-bit value encoded as a string of
        11 characters, using the same encoding as our document `_rev` values. The
        reason for this is that 64-bit values cannot necessarily be represented in full
        in JavaScript, as it handles all numbers as floating point, and can only
        represent up to `2^53-1` faithfully.
      operationId: handleCommandRevisionRanges
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name or id of the collection to query.
        in: query
      - name: batchId
        schema:
          type: number
        required: true
        description: |+
          The id of the snapshot to use
        in: query
      - name: resume
        schema:
          type: string
        required: false
        description: |+
          The revision at which to resume, if a previous request was truncated
        in: query
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully and data was returned.
        '401':
          description: |2+
            is returned if necessary parameters are missing or incorrect
        '404':
          description: |2+
            is returned when the collection or snapshot could not be found.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if an error occurred while assembling the response.
      tags:
      - Replication
```


```http-spec
openapi: 3.0.2
paths:
  /_api/replication/revisions/documents:
    put:
      description: |2+
        Returns documents by revision
        The body of the request should be JSON/VelocyPack and should consist of an
        array of string-encoded revision IDs:
        ```
        [
          <String, revision>,
          <String, revision>,
          ...
          <String, revision>
        ]
        ```
        In particular, the revisions should be sorted in ascending order of their
        decoded values.
        The result will be a JSON/VelocyPack array of document objects. If there is no
        document corresponding to a particular requested revision, an empty object will
        be returned in its place.
        The response may be truncated if it would be very long. In this case, the
        response array length will be less than the request array length, and
        subsequent requests can be made for the omitted documents.
        Each `<String, revision>` value type is a 64-bit value encoded as a string of
        11 characters, using the same encoding as our document `_rev` values. The
        reason for this is that 64-bit values cannot necessarily be represented in full
        in JavaScript, as it handles all numbers as floating point, and can only
        represent up to `2^53-1` faithfully.
      operationId: handleCommandRevisionDocuments
      parameters:
      - name: collection
        schema:
          type: string
        required: true
        description: |+
          The name or id of the collection to query.
        in: query
      - name: batchId
        schema:
          type: number
        required: true
        description: |+
          The id of the snapshot to use
        in: query
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully and data was returned.
        '401':
          description: |2+
            is returned if necessary parameters are missing or incorrect
        '404':
          description: |2+
            is returned when the collection or snapshot could not be found.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if an error occurred while assembling the response.
      tags:
      - Replication
```



<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/sync:
    put:
      description: |2+
        Starts a full data synchronization from a remote endpoint into the local
        ArangoDB database.
        The *sync* method can be used by replication clients to connect an ArangoDB database
        to a remote endpoint, fetch the remote list of collections and indexes, and collection
        data. It will thus create a local backup of the state of data at the remote ArangoDB
        database. *sync* works on a per-database level.
        *sync* will first fetch the list of collections and indexes from the remote endpoint.
        It does so by calling the *inventory* API of the remote database. It will then purge
        data in the local ArangoDB database, and after start will transfer collection data
        from the remote database to the local ArangoDB database. It will extract data from the
        remote database by calling the remote database's *dump* API until all data are fetched.
        In case of success, the body of the response is a JSON object with the following
        attributes:
        - *collections*: an array of collections that were transferred from the endpoint
        - *lastLogTick*: the last log tick on the endpoint at the time the transfer
          was started. Use this value as the *from* value when starting the continuous
          synchronization later.
        WARNING: calling this method will synchronize data from the collections found
        on the remote endpoint to the local ArangoDB database. All data in the local
        collections will be purged and replaced with data from the endpoint.
        Use with caution!
        **Note**: this method is not supported on a Coordinator in a cluster.
      operationId: ' handleCommandSync'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                endpoint:
                  type: string
                  description: |+
                    the leader endpoint to connect to (e.g. "tcp//192.168.173.138529").
                database:
                  type: string
                  description: |+
                    the database name on the leader (if not specified, defaults to the
                    name of the local current database).
                username:
                  type: string
                  description: |+
                    an optional ArangoDB username to use when connecting to the endpoint.
                password:
                  type: string
                  description: |+
                    the password to use when connecting to the endpoint.
                includeSystem:
                  type: boolean
                  description: |+
                    whether or not system collection operations will be applied
                incremental:
                  type: boolean
                  description: |+
                    if set to *true*, then an incremental synchronization method will be used
                    for synchronizing data in collections. This method is useful when
                    collections already exist locally, and only the remaining differences need
                    to be transferred from the remote endpoint. In this case, the incremental
                    synchronization can be faster than a full synchronization.
                    The default value is *false*, meaning that the complete data from the remote
                    collection will be transferred.
                restrictType:
                  type: string
                  description: |+
                    an optional string value for collection filtering. When
                    specified, the allowed values are *include* or *exclude*.
                restrictCollections:
                  type: array
                  description: |+
                    an optional array of collections for use with
                    *restrictType*. If *restrictType* is *include*, only the specified collections
                    will be synchronized. If *restrictType* is *exclude*, all but the specified
                    collections will be synchronized.
                initialSyncMaxWaitTime:
                  type: integer
                  description: |+
                    the maximum wait time (in seconds) that the initial synchronization will
                    wait for a response from the leader when fetching initial collection data.
                    This wait time can be used to control after what time the initial synchronization
                    will give up waiting for a response and fail.
                    This value will be ignored if set to *0*.
              required:
              - endpoint
              - password
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully.
        '400':
          description: |2+
            is returned if the configuration is incomplete or malformed.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if an error occurred during synchronization.
      tags:
      - Replication
```



<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/clusterInventory:
    get:
      description: |2+
        Returns the array of collections and indexes available on the cluster.
        The response will be an array of JSON objects, one for each collection.
        Each collection containscontains exactly two keys "parameters" and
        "indexes". This
        information comes from Plan/Collections/{DB-Name}/* in the Agency,
        just that the *indexes* attribute there is relocated to adjust it to
        the data format of arangodump.
      operationId: ' handleCommandClusterInventory'
      parameters:
      - name: includeSystem
        schema:
          type: boolean
        required: false
        description: |+
          Include system collections in the result. The default value is *true*.
        in: query
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
      tags:
      - Replication
```


