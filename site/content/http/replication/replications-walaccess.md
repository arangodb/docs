---
fileID: replications-walaccess
title: WAL Access API
weight: 2270
description: 
layout: default
---
The WAL Access API is used to facilitate faster and
more reliable asynchronous replication. The API offers access to the 
write-ahead log or operations log of the ArangoDB server. As a public
API it is only supported to access these REST endpoints on a single-server
instance. While these APIs are also available on DB-Server instances, accessing them
as a user is not supported. This API replaces some of the APIs in `/_api/replication`.

<!-- arangod/RestHandler/RestWALHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/wal/range:
    get:
      description: |2+
        Returns the currently available ranges of tick values for all WAL files.
        The tick values can be used to determine if certain
        data (identified by tick value) are still available for replication.
        The body of the response contains a JSON object.
        * *tickMin*: minimum tick available
        * *tickMax*: maximum tick available
        * *time*: the server time as string in format "YYYY-MM-DDTHH:MM:SSZ"
        * *server*: An object with fields *version* and *serverId*
      operationId: ' handleCommandTickRange'
      responses:
        '200':
          description: |2+
            is returned if the tick ranges could be determined successfully.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if the server operations state could not be determined.
      tags:
      - Replication
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestWalAccessTickRange
release: stable
version: '3.10'
---
    var url = "/_api/wal/range";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/wal/lastTick:
    get:
      description: |2+
        Returns the last available tick value that can be served from the server's
        replication log. This corresponds to the tick of the latest successfull operation.
        The result is a JSON object containing the attributes *tick*, *time* and *server*.
        * *tick*: contains the last available tick, *time*
        * *time*: the server time as string in format "YYYY-MM-DDTHH:MM:SSZ"
        * *server*: An object with fields *version* and *serverId*
        **Note**: this method is not supported on a Coordinator in a cluster.
      operationId: ' handleCommandLastTick'
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if an error occurred while assembling the response.
      tags:
      - Replication
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input/output
name: RestWalAccessFirstTick
release: stable
version: '3.10'
---
    var url = "/_api/wal/lastTick";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

```http-spec
openapi: 3.0.2
paths:
  /_api/wal/tail:
    get:
      description: |2+
        Returns data from the server's write-ahead log (also named replication log). This method can be called
        by replication clients after an initial synchronization of data. The method
        will return all "recent" logged operations from the server. Clients
        can replay and apply these operations locally so they get to the same data
        state as the server.
        Clients can call this method repeatedly to incrementally fetch all changes
        from the server. In this case, they should provide the *from* value so
        they will only get returned the log events since their last fetch.
        When the *from* query parameter is not used, the server will return log
        entries starting at the beginning of its replication log. When the *from*
        parameter is used, the server will only return log entries which have
        higher tick values than the specified *from* value (note: the log entry with a
        tick value equal to *from* will be excluded). Use the *from* value when
        incrementally fetching log data.
        The *to* query parameter can be used to optionally restrict the upper bound of
        the result to a certain tick value. If used, the result will contain only log events
        with tick values up to (including) *to*. In incremental fetching, there is no
        need to use the *to* parameter. It only makes sense in special situations,
        when only parts of the change log are required.
        The *chunkSize* query parameter can be used to control the size of the result.
        It must be specified in bytes. The *chunkSize* value will only be honored
        approximately. Otherwise a too low *chunkSize* value could cause the server
        to not be able to put just one log entry into the result and return it.
        Therefore, the *chunkSize* value will only be consulted after a log entry has
        been written into the result. If the result size is then bigger than
        *chunkSize*, the server will respond with as many log entries as there are
        in the response already. If the result size is still smaller than *chunkSize*,
        the server will try to return more data if there's more data left to return.
        If *chunkSize* is not specified, some server-side default value will be used.
        The *Content-Type* of the result is *application/x-arango-dump*. This is an
        easy-to-process format, with all log events going onto separate lines in the
        response body. Each log event itself is a JSON object, with at least the
        following attributes:
        - *tick*: the log event tick value
        - *type*: the log event type
        Individual log events will also have additional attributes, depending on the
        event type. A few common attributes which are used for multiple events types
        are:
        - *cuid*: globally unique id of the View or collection the event was for
        - *db*: the database name the event was for
        - *tid*: id of the transaction the event was contained in
        - *data*: the original document data
        A more detailed description of the individual replication event types and their
        data structures can be found in [Operation Types](#operation-types).
        The response will also contain the following HTTP headers:
        - *x-arango-replication-active*: whether or not the logger is active. Clients
          can use this flag as an indication for their polling frequency. If the
          logger is not active and there are no more replication events available, it
          might be sensible for a client to abort, or to go to sleep for a long time
          and try again later to check whether the logger has been activated.
        - *x-arango-replication-lastincluded*: the tick value of the last included
          value in the result. In incremental log fetching, this value can be used
          as the *from* value for the following request. **Note** that if the result is
          empty, the value will be *0*. This value should not be used as *from* value
          by clients in the next request (otherwise the server would return the log
          events from the start of the log again).
        - *x-arango-replication-lastscanned*: the last tick the server scanned while
          computing the operation log. This might include operations the server did not
          returned to you due to various reasons (i.e. the value was filtered or skipped).
          You may use this value in the *lastScanned* header to allow the rocksdb engine
          to break up requests over multiple responses.
        - *x-arango-replication-lasttick*: the last tick value the server has
          logged in its write ahead log (not necessarily included in the result). By comparing the the last
          tick and last included tick values, clients have an approximate indication of
          how many events there are still left to fetch.
        - *x-arango-replication-frompresent*: is set to _true_ if server returned
          all tick values starting from the specified tick in the _from_ parameter.
          Should this be set to false the server did not have these operations anymore
          and the client might have missed operations.
        - *x-arango-replication-checkmore*: whether or not there already exists more
          log data which the client could fetch immediately. If there is more log data
          available, the client could call the tailing API again with an adjusted *from*
          value to fetch remaining log entries until there are no more.
          If there isn't any more log data to fetch, the client might decide to go
          to sleep for a while before calling the logger again.
        **Note**: this method is not supported on a Coordinator in a cluster.
      operationId: ' handleCommandTail'
      parameters:
      - name: global
        schema:
          type: boolean
        required: false
        description: "If set to *true*, tails the WAL for all databases. If set to\
          \ *false*, tails the \nWAL for the selected database.\n\n"
        in: query
      - name: from
        schema:
          type: number
        required: false
        description: |+
          Exclusive lower bound tick value for results. On successive calls
          to this API you should set this to the value returned
          with the *x-arango-replication-lastincluded* header (Unless that header
          contains 0).
        in: query
      - name: to
        schema:
          type: number
        required: false
        description: |+
          Inclusive upper bound tick value for results.
        in: query
      - name: lastScanned
        schema:
          type: number
        required: false
        description: |+
          Should be set to the value of the *x-arango-replication-lastscanned* header
          or alternatively 0 on first try. This allows the rocksdb engine to break up
          large transactions over multiple responses.
        in: query
      - name: global
        schema:
          type: boolean
        required: false
        description: |+
          Whether operations for all databases should be included. When set to *false*
          only the operations for the current database are included. The value *true* is
          only valid on the *_system* database. The default is *false*.
        in: query
      - name: chunkSize
        schema:
          type: number
        required: false
        description: |+
          Approximate maximum size of the returned result.
        in: query
      - name: syncerId
        schema:
          type: number
        required: false
        description: |+
          Id of the client used to tail results. The server will use this to
          keep operations until the client has fetched them. Must be a positive integer.
          **Note** this or serverId is required to have a chance at fetching reading all
          operations with the rocksdb storage engine.
        in: query
      - name: serverId
        schema:
          type: number
        required: false
        description: |+
          Id of the client machine. If *syncerId* is unset, the server will use
          this to keep operations until the client has fetched them. Must be a positive
          integer.
          **Note** this or syncerId is required to have a chance at fetching reading all
          operations with the rocksdb storage engine.
        in: query
      - name: clientInfo
        schema:
          type: string
        required: false
        description: |+
          Short description of the client, used for informative purposes only.
        in: query
      responses:
        '200':
          description: |2+
            is returned if the request was executed successfully, and there are log
            events available for the requested range. The response body will not be empty
            in this case.
        '204':
          description: |2+
            is returned if the request was executed successfully, but there are no log
            events available for the requested range. The response body will be empty
            in this case.
        '400':
          description: |2+
            is returned if either the *from* or *to* values are invalid.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if an error occurred while assembling the response.
      tags:
      - Replication
```

**Examples**
{{< version "3.10" >}}
{{< tabs >}}
{{% tab name="curl" %}}
```curl
---
render: input
name: RestWalAccessTailingEmpty
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    var lastTick = re.logger.state().state.lastLogTick;
    var url = "/_api/wal/tail?from=" + lastTick;
    var response = logCurlRequest('GET', url);
    assert(response.code === 204);
    logRawResponse(response);
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
name: RestWalAccessTailingSome
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    db._drop("products");
    var lastTick = re.logger.state().state.lastLogTick;
    db._create("products");
    db.products.save({ "_key": "p1", "name" : "flux compensator" });
    db.products.save({ "_key": "p2", "name" : "hybrid hovercraft", "hp" : 5100 });
    db.products.remove("p1");
    db.products.update("p2", { "name" : "broken hovercraft" });
    db.products.drop();
    require("internal").wait(1);
    var url = "/_api/wal/tail?from=" + lastTick;
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonLResponse(response);
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
name: RestWalAccessTailingBufferLimit
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    db._drop("products");
    var lastTick = re.logger.state().state.lastLogTick;
    db._create("products");
    db.products.save({ "_key": "p1", "name" : "flux compensator" });
    db.products.save({ "_key": "p2", "name" : "hybrid hovercraft", "hp" : 5100 });
    db.products.remove("p1");
    db.products.update("p2", { "name" : "broken hovercraft" });
    db.products.drop();
    require("internal").wait(1);
    var url = "/_api/wal/tail?from=" + lastTick + "&chunkSize=400";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


## Operation Types

There are several different operation types thar an ArangoDB server might print. 
All operations include a `tick` value which identified their place in the operations log.
The numeric fields _tick_ and _tid_ always contain stringified numbers to avoid problems with 
drivers where numbers in JSON might be mishandled.

The following operation types are used in ArangoDB:

### Create Database (1100)

Create a database. Contains the field _db_ with the database name and the field _data_, 
contains the database definition.
```json
{
  "tick": "2103",
  "type": 1100,
  "db": "test",
  "data": {
    "database": 337,
    "id": "337",
    "name": "test"
  }
}
```

### Drop Database (1101)

Drop a database. Contains the field _db_ with the database name.
```json
{
  "tick": "3453",
  "type": 1101,
  "db": "test"
}
```

### Create Collection (2000)

Create a collection. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this collection. The *data* attribute contains the collection definition.

```json
{
  "tick": "3702",
  "db": "_system",
  "cuid": "hC0CF79DA83B4/555",
  "type": 2000,
  "data": {
    "allowUserKeys": true,
    "cacheEnabled": false,
    "cid": "555",
    "deleted": false,
    "globallyUniqueId": "hC0CF79DA83B4/555",
    "id": "555",
    "indexes": [],
    "isSystem": false,
    "keyOptions": {
      "allowUserKeys": true,
      "lastValue": 0,
      "type": "traditional"
    },
    "name": "test"
  }
}
```

### Drop Collection (2001)

Drop a collection. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this collection.

```json
{
  "tick": "154",
  "type": 2001,
  "db": "_system",
  "cuid": "hD15F8FE99859/555"
}
```

### Rename Collection (2002)

Rename a collection. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this collection. The _data_ field contains the *name* field
with the new name

```json
{
  "tick": "385",
  "db": "_system",
  "cuid": "hD15F8FE99859/135",
  "type": 2002,
  "data": {
    "name": "other"
  }
}
```

### Change Collection (2003)

Change collection properties. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this collection. The *data* attribute contains the updated collection definition.

```json
{
  "tick": "154",
  "type": 2003,
  "db": "_system",
  "cuid": "hD15F8FE99859/555",
  "data": {
    "waitForSync": true
  }
}
```

### Truncate Collection (2004)

Truncate a collection. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this collection.

```json
{
  "tick": "154",
  "type": 2004,
  "db": "_system",
  "cuid": "hD15F8FE99859/555"
}
```

### Create Index (2100)

Create an index. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this collection. The field _data_ contains the index
definition.

```json
{
  "tick": "1327",
  "type": 2100,
  "db": "_system",
  "cuid": "hD15F8FE99859/555",
  "data": {
    "deduplicate": true,
    "fields": [
      "value"
    ],
    "id": "260",
    "selectivityEstimate": 1,
    "sparse": false,
    "type": "persistent",
    "unique": false
  }
}
```

### Drop Index (2101)

Drop an index. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this collection. The field _data_ contains the field
*id* with the index id.

```json
{
  "tick": "1522",
  "type": 2101,
  "db": "_system",
  "cuid": "hD15F8FE99859/555",
  "data": {
    "id": "260"
  }
}
```

### Create View (2110)

Create a view. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this view. The field _data_ contains the view definition

```json
{
  "tick": "1833",
  "type": 2110,
  "db": "_system",
  "cuid": "hD15F8FE99859/322",
  "data": {
    "cleanupIntervalStep": 10,
    "collections": [],
    "commitIntervalMsec": 60000,
    "consolidate": {
      "segmentThreshold": 300,
      "threshold": 0.8500000238418579,
      "type": "tier"
    },
    "deleted": false,
    "globallyUniqueId": "hD15F8FE99859/322",
    "id": "322",
    "isSystem": false,
    "locale": "C",
    "name": "myview",
    "type": "arangosearch"
  }
}
```

### Drop View (2111)

Drop a view. Contains the field _db_ with the database name, and _cuid_ with the 
globally unique id to identify this view.

```json
{
  "tick": "3113",
  "type": 2111,
  "db": "_system",
  "cuid": "hD15F8FE99859/322"
}
```

### Change View (2112)

Change view properties (including the name). Contains the field _db_ with the database name and _cuid_ with the 
globally unique id to identify this view. The *data* attribute contain the updated properties.

```json
{
  "tick": "3014",
  "type": 2112,
  "db": "_system",
  "cuid": "hD15F8FE99859/457",
  "data": {
    "cleanupIntervalStep": 10,
    "collections": [
      135
    ],
    "commitIntervalMsec": 60000,
    "consolidate": {
      "segmentThreshold": 300,
      "threshold": 0.8500000238418579,
      "type": "tier"
    },
    "deleted": false,
    "globallyUniqueId": "hD15F8FE99859/457",
    "id": "457",
    "isSystem": false,
    "locale": "C",
    "name": "renamedview",
    "type": "arangosearch"
  }
}
```

### Start Transaction (2200)

Mark the beginning of a transaction. Contains the field _db_ with the database name
and the field _tid_ for the transaction id. This log entry might be followed
by zero or more document operations and then either one commit **or** an abort operation 
(i.e. types *2300*, *2302* and *2201* / *2202*) with the same _tid_ value.

```json
{
  "tick": "3651",
  "type": 2200,
  "db": "_system",
  "tid": "556"
}
```

### Commit Transaction (2201)

Mark the successful end of a transaction. Contains the field _db_ with the database name
and the field _tid_ for the transaction id.

```json
{
  "tick": "3652",
  "type": 2201,
  "db": "_system",
  "tid": "556"
}
```

### Abort Transaction (2202)

Mark the abortion of a transaction. Contains the field _db_ with the database name
and the field _tid_ for the transaction id.

```json
{
  "tick": "3654",
  "type": 2202,
  "db": "_system",
  "tid": "556"
}
```

### Insert / Replace Document (2300)

Insert or replace a document. Contains the field _db_ with the database name,
_cuid_ with the globally unique id to identify the collection and the field _tid_ for 
the transaction id. The field *tid* might contain the value *"0"* to identify a single
operation that is not part of a multi-document transaction. The field *data* contains the
document. If the field *_rev* exists the client can choose to perform a revision check against
a locally available version of the document to ensure consistency.

```json
{
  "tick": "196",
  "type": 2300,
  "db": "_system",
  "tid": "0",
  "cuid": "hE0E3D7BE511D/119",
  "data": {
    "_id": "users/194",
    "_key": "194",
    "_rev": "_XUJFD3C---",
    "value": "test"
  }
}
```

### Remove Document (2302)

Remove a document. Contains the field _db_ with the database name,
_cuid_ with the globally unique id to identify the collection and the field _tid_ for 
the transaction id. The field *tid* might contain the value *"0"* to identify a single
operation that is not part of a multi-document transaction. The field *data* contains the 
*_key* and *_rev* of the removed document. The client can choose to perform a revision check against
a locally available version of the document to ensure consistency.

```json
{
  "cuid": "hE0E3D7BE511D/119",
  "data": {
    "_key": "194",
    "_rev": "_XUJIbS---_"
  },
  "db": "_system",
  "tick": "397",
  "tid": "0",
  "type": 2302
}
```
