---
fileID: replications-replication-logger
title: Replication Logger Commands
weight: 2255
description: 
layout: default
---
All data-modification operations are written to the server's write-ahead log and are
not handled by a separate replication logger.

You can query the current state of the logger and fetch the latest changes
written by the logger. The operations return the state and data from the
write-ahead log.

```http-spec
openapi: 3.0.2
paths:
  /_api/replication/logger-state:
    get:
      description: |2+
        Returns the current state of the server's replication logger. The state will
        include information about whether the logger is running and about the last
        logged tick value. This tick value is important for incremental fetching of
        data.
        The body of the response contains a JSON object with the following
        attributes:
        - *state*: the current logger state as a JSON object with the following
          sub-attributes:
          - *running*: whether or not the logger is running
          - *lastLogTick*: the tick value of the latest tick the logger has logged.
            This value can be used for incremental fetching of log data.
          - *totalEvents*: total number of events logged since the server was started.
            The value is not reset between multiple stops and re-starts of the logger.
          - *time*: the current date and time on the logger server
        - *server*: a JSON object with the following sub-attributes:
          - *version*: the logger server's version
          - *serverId*: the logger server's id
        - *clients*: returns the last fetch status by replication clients connected to
          the logger. Each client is returned as a JSON object with the following attributes:
          - *syncerId*: id of the client syncer
          - *serverId*: server id of client
          - *lastServedTick*: last tick value served to this client via the WAL tailing API
          - *time*: date and time when this client last called the WAL tailing API
      operationId: ' handleCommandLoggerState'
      responses:
        '200':
          description: |2+
            is returned if the logger state could be determined successfully.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
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
name: RestReplicationLoggerStateActive
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    var url = "/_api/replication/logger-state";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


To query the latest changes logged by the replication logger, the HTTP interface
also provides the `logger-follow` method.

This method should be used by replication clients to incrementally fetch updates 
from an ArangoDB database.

```http-spec
openapi: 3.0.2
paths:
  /_api/replication/logger-follow:
    get:
      description: |2+
        Returns data from the server's replication log. This method can be called
        by replication clients after an initial synchronization of data. The method
        will return all "recent" log entries from the logger server, and the clients
        can replay and apply these entries locally so they get to the same data
        state as the logger server.
        Clients can call this method repeatedly to incrementally fetch all changes
        from the logger server. In this case, they should provide the *from* value so
        they will only get returned the log events since their last fetch.
        When the *from* query parameter is not used, the logger server will return log
        entries starting at the beginning of its replication log. When the *from*
        parameter is used, the logger server will only return log entries which have
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
        - *cid*: id of the collection the event was for
        - *tid*: id of the transaction the event was contained in
        - *key*: document key
        - *rev*: document revision id
        - *data*: the original document data
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
        - *x-arango-replication-lasttick*: the last tick value the logger server has
          logged (not necessarily included in the result). By comparing the the last
          tick and last included tick values, clients have an approximate indication of
          how many events there are still left to fetch.
        - *x-arango-replication-checkmore*: whether or not there already exists more
          log data which the client could fetch immediately. If there is more log data
          available, the client could call *logger-follow* again with an adjusted *from*
          value to fetch remaining log entries until there are no more.
          If there isn't any more log data to fetch, the client might decide to go
          to sleep for a while before calling the logger again.
        **Note**: this method is not supported on a Coordinator in a cluster.
      operationId: ' handleCommandLoggerFollow'
      parameters:
      - name: from
        schema:
          type: number
        required: false
        description: |+
          Exclusive lower bound tick value for results.
        in: query
      - name: to
        schema:
          type: number
        required: false
        description: |+
          Inclusive upper bound tick value for results.
        in: query
      - name: chunkSize
        schema:
          type: number
        required: false
        description: |+
          Approximate maximum size of the returned result.
        in: query
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
name: RestReplicationLoggerFollowEmpty
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    var lastTick = re.logger.state().state.lastLogTick;
    var url = "/_api/replication/logger-follow?from=" + lastTick;
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
name: RestReplicationLoggerFollowSome
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
    var url = "/_api/replication/logger-follow?from=" + lastTick;
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
name: RestReplicationLoggerFollowBufferLimit
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
    var url = "/_api/replication/logger-follow?from=" + lastTick + "&chunkSize=400";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


To check what range of changes is available (identified by tick values), the HTTP
interface provides the methods `logger-first-tick` and `logger-tick-ranges`.
Replication clients can use the methods to determine if certain data (identified
by a tick *date*) is still available on the Leader.

```http-spec
openapi: 3.0.2
paths:
  /_api/replication/logger-first-tick:
    get:
      description: |2+
        Returns the first available tick value that can be served from the server's
        replication log. This method can be called by replication clients after to
        determine if certain data (identified by a tick value) is still available
        for replication.
        The result is a JSON object containing the attribute *firstTick*. This
        attribute contains the minimum tick value available in the server's
        replication
        log.
        **Note**: this method is not supported on a Coordinator in a cluster.
      operationId: ' handleCommandLoggerFirstTick'
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
name: RestReplicationLoggerFirstTick
release: stable
version: '3.10'
---
    var url = "/_api/replication/logger-first-tick";
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
  /_api/replication/logger-tick-ranges:
    get:
      description: |2+
        Returns the currently available ranges of tick values for all currently
        available WAL logfiles. The tick values can be used to determine if certain
        data (identified by tick value) are still available for replication.
        The body of the response contains a JSON array. Each array member is an
        object
        that describes a single logfile. Each object has the following attributes:
        * *datafile*: name of the logfile
        * *status*: status of the datafile, in textual form (e.g. "sealed", "open")
        * *tickMin*: minimum tick value contained in logfile
        * *tickMax*: maximum tick value contained in logfile
      operationId: handleCommandLoggerTickRanges
      responses:
        '200':
          description: |2+
            is returned if the tick ranges could be determined successfully.
        '405':
          description: |2+
            is returned when an invalid HTTP method is used.
        '500':
          description: |2+
            is returned if the logger state could not be determined.
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
name: RestReplicationLoggerTickRanges
release: stable
version: '3.10'
---
    var url = "/_api/replication/logger-tick-ranges";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}

