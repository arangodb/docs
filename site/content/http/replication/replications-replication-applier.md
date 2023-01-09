---
fileID: replications-replication-applier
title: Replication Applier Commands
weight: 2170
description: 
layout: default
---
The applier commands allow to remotely start, stop, and query the state and 
configuration of an ArangoDB database's replication applier.

<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/applier-config:
    get:
      description: |2+
        Returns the configuration of the replication applier.
        The body of the response is a JSON object with the configuration. The
        following attributes may be present in the configuration:
        - *endpoint*: the logger server to connect to (e.g. "tcp://192.168.173.13:8529").
        - *database*: the name of the database to connect to (e.g. "_system").
        - *username*: an optional ArangoDB username to use when connecting to the endpoint.
        - *password*: the password to use when connecting to the endpoint.
        - *maxConnectRetries*: the maximum number of connection attempts the applier
          will make in a row. If the applier cannot establish a connection to the
          endpoint in this number of attempts, it will stop itself.
        - *connectTimeout*: the timeout (in seconds) when attempting to connect to the
          endpoint. This value is used for each connection attempt.
        - *requestTimeout*: the timeout (in seconds) for individual requests to the endpoint.
        - *chunkSize*: the requested maximum size for log transfer packets that
          is used when the endpoint is contacted.
        - *autoStart*: whether or not to auto-start the replication applier on
          (next and following) server starts
        - *adaptivePolling*: whether or not the replication applier will use
          adaptive polling.
        - *includeSystem*: whether or not system collection operations will be applied
        - *autoResync*: whether or not the follower should perform a full automatic
          resynchronization with the leader in case the leader cannot serve log data
          requested by the follower, or when the replication is started and no tick
          value
          can be found.
        - *autoResyncRetries*: number of resynchronization retries that will be performed
          in a row when automatic resynchronization is enabled and kicks in. Setting this
          to *0* will effectively disable *autoResync*. Setting it to some other value
          will limit the number of retries that are performed. This helps preventing endless
          retries in case resynchronizations always fail.
        - *initialSyncMaxWaitTime*: the maximum wait time (in seconds) that the initial
          synchronization will wait for a response from the leader when fetching initial
          collection data.
          This wait time can be used to control after what time the initial synchronization
          will give up waiting for a response and fail. This value is relevant even
          for continuous replication when *autoResync* is set to *true* because this
          may re-start the initial synchronization when the leader cannot provide
          log data the follwer requires.
          This value will be ignored if set to *0*.
        - *connectionRetryWaitTime*: the time (in seconds) that the applier will
          intentionally idle before it retries connecting to the leader in case of
          connection problems.
          This value will be ignored if set to *0*.
        - *idleMinWaitTime*: the minimum wait time (in seconds) that the applier will
          intentionally idle before fetching more log data from the leader in case
          the leader has already sent all its log data. This wait time can be used
          to control the frequency with which the replication applier sends HTTP log
          fetch requests to the leader in case there is no write activity on the leader.
          This value will be ignored if set to *0*.
        - *idleMaxWaitTime*: the maximum wait time (in seconds) that the applier will
          intentionally idle before fetching more log data from the leader in case the
          leader has already sent all its log data and there have been previous log
          fetch attempts that resulted in no more log data. This wait time can be used
          to control the maximum frequency with which the replication applier sends HTTP
          log fetch requests to the leader in case there is no write activity on the
          leader for longer periods. This configuration value will only be used if the
          option *adaptivePolling* is set to *true*.
          This value will be ignored if set to *0*.
        - *requireFromPresent*: if set to *true*, then the replication applier will check
          at start whether the start tick from which it starts or resumes replication is
          still present on the leader. If not, then there would be data loss. If
          *requireFromPresent* is *true*, the replication applier will abort with an
          appropriate error message. If set to *false*, then the replication applier will
          still start, and ignore the data loss.
        - *verbose*: if set to *true*, then a log line will be emitted for all operations
          performed by the replication applier. This should be used for debugging
          replication
          problems only.
        - *restrictType*: the configuration for *restrictCollections*
        - *restrictCollections*: the optional array of collections to include or exclude,
          based on the setting of *restrictType*
      operationId: ' handleCommandApplierGetConfig'
      parameters:
      - name: global
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, returns the configuration of the global replication applier for all
          databases. If set to *false*, returns the configuration of the replication applier in the
          selected database.
        in: query
      responses:
        '200':
          description: |2
            is returned if the request was executed successfully.
        '405':
          description: |2
            is returned when an invalid HTTP method is used.
        '500':
          description: |2
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
name: RestReplicationApplierGetConfig
release: stable
version: '3.10'
---
    var url = "/_api/replication/applier-config";
    var response = logCurlRequest('GET', url);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/applier-config:
    put:
      description: |2+
        Sets the configuration of the replication applier. The configuration can
        only be changed while the applier is not running. The updated configuration
        will be saved immediately but only become active with the next start of the
        applier.
        In case of success, the body of the response is a JSON object with the updated
        configuration.
      operationId: handleCommandApplierSetConfig
      parameters:
      - name: global
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, adjusts the configuration of the global replication applier for all
          databases. If set to *false*, adjusts the configuration of the replication applier in the
          selected database.
        in: query
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                endpoint:
                  type: string
                  description: |+
                    the logger server to connect to (e.g. "tcp://192.168.173.13:8529"). The endpoint must be specified.
                database:
                  type: string
                  description: |+
                    the name of the database on the endpoint. If not specified, defaults to the current local database name.
                username:
                  type: string
                  description: |+
                    an optional ArangoDB username to use when connecting to the endpoint.
                password:
                  type: string
                  description: |+
                    the password to use when connecting to the endpoint.
                maxConnectRetries:
                  type: integer
                  format: int64
                  description: |+
                    the maximum number of connection attempts the applier
                    will make in a row. If the applier cannot establish a connection to the
                    endpoint in this number of attempts, it will stop itself.
                connectTimeout:
                  type: integer
                  format: int64
                  description: |+
                    the timeout (in seconds) when attempting to connect to the
                    endpoint. This value is used for each connection attempt.
                requestTimeout:
                  type: integer
                  format: int64
                  description: |+
                    the timeout (in seconds) for individual requests to the endpoint.
                chunkSize:
                  type: integer
                  format: int64
                  description: |+
                    the requested maximum size for log transfer packets that
                    is used when the endpoint is contacted.
                autoStart:
                  type: boolean
                  description: |+
                    whether or not to auto-start the replication applier on
                    (next and following) server starts
                adaptivePolling:
                  type: boolean
                  description: |+
                    if set to *true*, the replication applier will fall
                    to sleep for an increasingly long period in case the logger server at the
                    endpoint does not have any more replication events to apply. Using
                    adaptive polling is thus useful to reduce the amount of work for both the
                    applier and the logger server for cases when there are only infrequent
                    changes. The downside is that when using adaptive polling, it might take
                    longer for the replication applier to detect that there are new replication
                    events on the logger server.
                    Setting *adaptivePolling* to false will make the replication applier
                    contact the logger server in a constant interval, regardless of whether
                    the logger server provides updates frequently or seldom.
                includeSystem:
                  type: boolean
                  description: |+
                    whether or not system collection operations will be applied
                autoResync:
                  type: boolean
                  description: |+
                    whether or not the follower should perform a full automatic resynchronization
                    with the leader in case the leader cannot serve log data requested by the
                    follower, or when the replication is started and no tick value can be found.
                autoResyncRetries:
                  type: integer
                  format: int64
                  description: |+
                    number of resynchronization retries that will be performed in a row when
                    automatic resynchronization is enabled and kicks in. Setting this to *0*
                    will
                    effectively disable *autoResync*. Setting it to some other value will limit
                    the number of retries that are performed. This helps preventing endless
                    retries
                    in case resynchronizations always fail.
                initialSyncMaxWaitTime:
                  type: integer
                  format: int64
                  description: |+
                    the maximum wait time (in seconds) that the initial synchronization will
                    wait for a response from the leader when fetching initial collection data.
                    This wait time can be used to control after what time the initial
                    synchronization
                    will give up waiting for a response and fail. This value is relevant even
                    for continuous replication when *autoResync* is set to *true* because this
                    may re-start the initial synchronization when the leader cannot provide
                    log data the follower requires.
                    This value will be ignored if set to *0*.
                connectionRetryWaitTime:
                  type: integer
                  format: int64
                  description: |+
                    the time (in seconds) that the applier will intentionally idle before
                    it retries connecting to the leader in case of connection problems.
                    This value will be ignored if set to *0*.
                idleMinWaitTime:
                  type: integer
                  format: int64
                  description: |+
                    the minimum wait time (in seconds) that the applier will intentionally idle
                    before fetching more log data from the leader in case the leader has
                    already sent all its log data. This wait time can be used to control the
                    frequency with which the replication applier sends HTTP log fetch requests
                    to the leader in case there is no write activity on the leader.
                    This value will be ignored if set to *0*.
                idleMaxWaitTime:
                  type: integer
                  format: int64
                  description: |+
                    the maximum wait time (in seconds) that the applier will intentionally idle
                    before fetching more log data from the leader in case the leader has
                    already sent all its log data and there have been previous log fetch attempts
                    that resulted in no more log data. This wait time can be used to control the
                    maximum frequency with which the replication applier sends HTTP log fetch
                    requests to the leader in case there is no write activity on the leader for
                    longer periods. This configuration value will only be used if the option
                    *adaptivePolling* is set to *true*.
                    This value will be ignored if set to *0*.
                requireFromPresent:
                  type: boolean
                  description: |+
                    if set to *true*, then the replication applier will check
                    at start whether the start tick from which it starts or resumes replication is
                    still present on the leader. If not, then there would be data loss. If
                    *requireFromPresent* is *true*, the replication applier will abort with an
                    appropriate error message. If set to *false*, then the replication applier will
                    still start, and ignore the data loss.
                verbose:
                  type: boolean
                  description: |+
                    if set to *true*, then a log line will be emitted for all operations
                    performed by the replication applier. This should be used for debugging replication
                    problems only.
                restrictType:
                  type: string
                  description: |+
                    the configuration for *restrictCollections*; Has to be either *include* or *exclude*
                restrictCollections:
                  type: array
                  items:
                    type: string
                  description: |+
                    the array of collections to include or exclude,
                    based on the setting of *restrictType*
              required:
              - endpoint
              - database
              - password
              - maxConnectRetries
              - connectTimeout
              - requestTimeout
              - chunkSize
              - autoStart
              - adaptivePolling
              - includeSystem
              - requireFromPresent
              - verbose
              - restrictType
      responses:
        '200':
          description: |2
            is returned if the request was executed successfully.
        '400':
          description: |2
            is returned if the configuration is incomplete or malformed, or if the
            replication applier is currently running.
        '405':
          description: |2
            is returned when an invalid HTTP method is used.
        '500':
          description: |2
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
name: RestReplicationApplierSetConfig
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    re.applier.stop();
    var url = "/_api/replication/applier-config";
    var body = {
      endpoint: "tcp://127.0.0.1:8529",
      username: "replicationApplier",
      password: "applier1234@foxx",
      chunkSize: 4194304,
      autoStart: false,
      adaptivePolling: true
    };
    var response = logCurlRequest('PUT', url, body);
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/applier-start:
    put:
      description: |2+
        Starts the replication applier. This will return immediately if the
        replication applier is already running.
        If the replication applier is not already running, the applier configuration
        will be checked, and if it is complete, the applier will be started in a
        background thread. This means that even if the applier will encounter any
        errors while running, they will not be reported in the response to this
        method.
        To detect replication applier errors after the applier was started, use the
        */_api/replication/applier-state* API instead.
      operationId: handleCommandApplierStart
      parameters:
      - name: global
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, starts the global replication applier for all
          databases. If set to *false*, starts the replication applier in the
          selected database.
        in: query
      - name: from
        schema:
          type: string
        required: false
        description: |+
          The remote *lastLogTick* value from which to start applying. If not specified,
          the last saved tick from the previous applier run is used. If there is no
          previous applier state saved, the applier will start at the beginning of the
          logger server's log.
        in: query
      responses:
        '200':
          description: |2
            is returned if the request was executed successfully.
        '400':
          description: |2
            is returned if the replication applier is not fully configured or the
            configuration is invalid.
        '405':
          description: |2
            is returned when an invalid HTTP method is used.
        '500':
          description: |2
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
name: RestReplicationApplierStart
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    re.applier.stop();
    re.applier.properties({
      endpoint: "tcp://127.0.0.1:8529",
      username: "replicationApplier",
      password: "applier1234@foxx",
      autoStart: false,
      adaptivePolling: true
    });
    var url = "/_api/replication/applier-start";
    var response = logCurlRequest('PUT', url, "");
    re.applier.stop();
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/applier-stop:
    put:
      description: |2+
        Stops the replication applier. This will return immediately if the
        replication applier is not running.
      operationId: handleCommandApplierStop
      parameters:
      - name: global
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, stops the global replication applier for all
          databases. If set to *false*, stops the replication applier in the
          selected database.
        in: query
      responses:
        '200':
          description: |2
            is returned if the request was executed successfully.
        '405':
          description: |2
            is returned when an invalid HTTP method is used.
        '500':
          description: |2
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
name: RestReplicationApplierStop
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    re.applier.stop();
    re.applier.properties({
      endpoint: "tcp://127.0.0.1:8529",
      username: "replicationApplier",
      password: "applier1234@foxx",
      autoStart: false,
      adaptivePolling: true
    });
    re.applier.start();
    var url = "/_api/replication/applier-stop";
    var response = logCurlRequest('PUT', url, "");
    re.applier.stop();
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/applier-state:
    get:
      description: |2
        Returns the state of the replication applier, regardless of whether the
        applier is currently running or not.
        The response is a JSON object with the following attributes:
        - *state*: a JSON object with the following sub-attributes:
          - *running*: whether or not the applier is active and running
          - *lastAppliedContinuousTick*: the last tick value from the continuous
            replication log the applier has applied.
          - *lastProcessedContinuousTick*: the last tick value from the continuous
            replication log the applier has processed.
            Regularly, the last applied and last processed tick values should be
            identical. For transactional operations, the replication applier will first
            process incoming log events before applying them, so the processed tick
            value might be higher than the applied tick value. This will be the case
            until the applier encounters the *transaction commit* log event for the
            transaction.
          - *lastAvailableContinuousTick*: the last tick value the remote server can
            provide, for all databases.
          - *ticksBehind*: this attribute will be present only if the applier is currently
            running. It will provide the number of log ticks between what the applier
            has applied/seen and the last log tick value provided by the remote server.
            If this value is zero, then both servers are in sync. If this is non-zero,
            then the remote server has additional data that the applier has not yet
            fetched and processed, or the remote server may have more data that is not
            applicable to the applier.
            Client applications can use it to determine approximately how far the applier
            is behind the remote server, and can periodically check if the value is
            increasing (applier is falling behind) or decreasing (applier is catching up).
            Please note that as the remote server will only keep one last log tick value
            for all of its databases, but replication may be restricted to just certain
            databases on the applier, this value is more meaningful when the global applier
            is used.
            Additionally, the last log tick provided by the remote server may increase
            due to writes into system collections that are not replicated due to replication
            configuration. So the reported value may exaggerate the reality a bit for
            some scenarios.
          - *time*: the time on the applier server.
          - *totalRequests*: the total number of requests the applier has made to the
            endpoint.
          - *totalFailedConnects*: the total number of failed connection attempts the
            applier has made.
          - *totalEvents*: the total number of log events the applier has processed.
          - *totalOperationsExcluded*: the total number of log events excluded because
            of *restrictCollections*.
          - *progress*: a JSON object with details about the replication applier progress.
            It contains the following sub-attributes if there is progress to report:
            - *message*: a textual description of the progress
            - *time*: the date and time the progress was logged
            - *failedConnects*: the current number of failed connection attempts
          - *lastError*: a JSON object with details about the last error that happened on
            the applier. It contains the following sub-attributes if there was an error:
            - *errorNum*: a numerical error code
            - *errorMessage*: a textual error description
            - *time*: the date and time the error occurred
            In case no error has occurred, *lastError* will be empty.
        - *server*: a JSON object with the following sub-attributes:
          - *version*: the applier server's version
          - *serverId*: the applier server's id
        - *endpoint*: the endpoint the applier is connected to (if applier is
          active) or will connect to (if applier is currently inactive)
        - *database*: the name of the database the applier is connected to (if applier is
          active) or will connect to (if applier is currently inactive)
        Please note that all "tick" values returned do not have a specific unit. Tick
        values are only meaningful when compared to each other. Higher tick values mean
        "later in time" than lower tick values.
      operationId: handleCommandApplierGetState
      parameters:
      - name: global
        schema:
          type: boolean
        required: false
        description: |+
          If set to *true*, returns the state of the global replication applier for all
          databases. If set to *false*, returns the state of the replication applier in the
          selected database.
        in: query
      responses:
        '200':
          description: |2
            is returned if the request was executed successfully.
        '405':
          description: |2
            is returned when an invalid HTTP method is used.
        '500':
          description: |2
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
name: RestReplicationApplierStateNotRunning
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    re.applier.stop();
    var url = "/_api/replication/applier-state";
    var response = logCurlRequest('GET', url);
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
name: RestReplicationApplierStateRunning
release: stable
version: '3.10'
---
    var re = require("@arangodb/replication");
    re.applier.stop();
    re.applier.start();
    var url = "/_api/replication/applier-state";
    var response = logCurlRequest('GET', url);
    re.applier.stop();
    assert(response.code === 200);
    logJsonResponse(response);
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}


<!-- arangod/RestHandler/RestReplicationHandler.cpp -->
```http-spec
openapi: 3.0.2
paths:
  /_api/replication/make-follower:
    put:
      description: |2+
        Starts a full data synchronization from a remote endpoint into the local ArangoDB
        database and afterwards starts the continuous replication.
        The operation works on a per-database level.
        All local database data will be removed prior to the synchronization.
        In case of success, the body of the response is a JSON object with the following
        attributes:
        - *state*: a JSON object with the following sub-attributes:
          - *running*: whether or not the applier is active and running
          - *lastAppliedContinuousTick*: the last tick value from the continuous
            replication log the applier has applied.
          - *lastProcessedContinuousTick*: the last tick value from the continuous
            replication log the applier has processed.
            Regularly, the last applied and last processed tick values should be
            identical. For transactional operations, the replication applier will first
            process incoming log events before applying them, so the processed tick
            value might be higher than the applied tick value. This will be the case
            until the applier encounters the *transaction commit* log event for the
            transaction.
          - *lastAvailableContinuousTick*: the last tick value the remote server can
            provide.
          - *ticksBehind*: this attribute will be present only if the applier is currently
            running. It will provide the number of log ticks between what the applier
            has applied/seen and the last log tick value provided by the remote server.
            If this value is zero, then both servers are in sync. If this is non-zero,
            then the remote server has additional data that the applier has not yet
            fetched and processed, or the remote server may have more data that is not
            applicable to the applier.
            Client applications can use it to determine approximately how far the applier
            is behind the remote server, and can periodically check if the value is
            increasing (applier is falling behind) or decreasing (applier is catching up).
            Please note that as the remote server will only keep one last log tick value
            for all of its databases, but replication may be restricted to just certain
            databases on the applier, this value is more meaningful when the global applier
            is used.
            Additionally, the last log tick provided by the remote server may increase
            due to writes into system collections that are not replicated due to replication
            configuration. So the reported value may exaggerate the reality a bit for
            some scenarios.
          - *time*: the time on the applier server.
          - *totalRequests*: the total number of requests the applier has made to the
            endpoint.
          - *totalFailedConnects*: the total number of failed connection attempts the
            applier has made.
          - *totalEvents*: the total number of log events the applier has processed.
          - *totalOperationsExcluded*: the total number of log events excluded because
            of *restrictCollections*.
          - *progress*: a JSON object with details about the replication applier progress.
            It contains the following sub-attributes if there is progress to report:
            - *message*: a textual description of the progress
            - *time*: the date and time the progress was logged
            - *failedConnects*: the current number of failed connection attempts
          - *lastError*: a JSON object with details about the last error that happened on
            the applier. It contains the following sub-attributes if there was an error:
            - *errorNum*: a numerical error code
            - *errorMessage*: a textual error description
            - *time*: the date and time the error occurred
            In case no error has occurred, *lastError* will be empty.
        - *server*: a JSON object with the following sub-attributes:
          - *version*: the applier server's version
          - *serverId*: the applier server's id
        - *endpoint*: the endpoint the applier is connected to (if applier is
          active) or will connect to (if applier is currently inactive)
        - *database*: the name of the database the applier is connected to (if applier is
          active) or will connect to (if applier is currently inactive)
        Please note that all "tick" values returned do not have a specific unit. Tick
        values are only meaningful when compared to each other. Higher tick values mean
        "later in time" than lower tick values.
        WARNING: calling this method will synchronize data from the collections found
        on the remote leader to the local ArangoDB database. All data in the local
        collections will be purged and replaced with data from the leader.
        Use with caution!
        Please also keep in mind that this command may take a long time to complete
        and return. This is because it will first do a full data synchronization with
        the leader, which will take time roughly proportional to the amount of data.
        **Note**: this method is not supported on a Coordinator in a cluster.
      operationId: ' handleCommandMakeFollower'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                endpoint:
                  type: string
                  description: |+
                    the leader endpoint to connect to (e.g. "tcp://192.168.173.13:8529").
                database:
                  type: string
                  description: |+
                    the database name on the leader (if not specified, defaults to the
                    name of the local current database).
                username:
                  type: string
                  description: |+
                    an optional ArangoDB username to use when connecting to the leader.
                password:
                  type: string
                  description: |+
                    the password to use when connecting to the leader.
                includeSystem:
                  type: boolean
                  description: |+
                    whether or not system collection operations will be applied
                restrictType:
                  type: string
                  description: |+
                    an optional string value for collection filtering. When
                    specified, the allowed values are *include* or *exclude*.
                restrictCollections:
                  type: array
                  items:
                    type: string
                  description: |+
                    an optional array of collections for use with *restrictType*.
                    If *restrictType* is *include*, only the specified collections
                    will be synchronized. If *restrictType* is *exclude*, all but the specified
                    collections will be synchronized.
                maxConnectRetries:
                  type: integer
                  format: int64
                  description: |+
                    the maximum number of connection attempts the applier
                    will make in a row. If the applier cannot establish a connection to the
                    endpoint in this number of attempts, it will stop itself.
                connectTimeout:
                  type: integer
                  format: int64
                  description: |+
                    the timeout (in seconds) when attempting to connect to the
                    endpoint. This value is used for each connection attempt.
                requestTimeout:
                  type: integer
                  format: int64
                  description: |+
                    the timeout (in seconds) for individual requests to the endpoint.
                chunkSize:
                  type: integer
                  format: int64
                  description: |+
                    the requested maximum size for log transfer packets that
                    is used when the endpoint is contacted.
                adaptivePolling:
                  type: boolean
                  description: |+
                    whether or not the replication applier will use adaptive polling.
                autoResync:
                  type: boolean
                  description: |+
                    whether or not the follower should perform an automatic resynchronization with
                    the leader in case the leader cannot serve log data requested by the follower,
                    or when the replication is started and no tick value can be found.
                autoResyncRetries:
                  type: integer
                  format: int64
                  description: |+
                    number of resynchronization retries that will be performed in a row when
                    automatic resynchronization is enabled and kicks in. Setting this to *0* will
                    effectively disable *autoResync*. Setting it to some other value will limit
                    the number of retries that are performed. This helps preventing endless retries
                    in case resynchronizations always fail.
                initialSyncMaxWaitTime:
                  type: integer
                  format: int64
                  description: |+
                    the maximum wait time (in seconds) that the initial synchronization will
                    wait for a response from the leader when fetching initial collection data.
                    This wait time can be used to control after what time the initial synchronization
                    will give up waiting for a response and fail. This value is relevant even
                    for continuous replication when *autoResync* is set to *true* because this
                    may re-start the initial synchronization when the leader cannot provide
                    log data the follower requires.
                    This value will be ignored if set to *0*.
                connectionRetryWaitTime:
                  type: integer
                  format: int64
                  description: |+
                    the time (in seconds) that the applier will intentionally idle before
                    it retries connecting to the leader in case of connection problems.
                    This value will be ignored if set to *0*.
                idleMinWaitTime:
                  type: integer
                  format: int64
                  description: |+
                    the minimum wait time (in seconds) that the applier will intentionally idle
                    before fetching more log data from the leader in case the leader has
                    already sent all its log data. This wait time can be used to control the
                    frequency with which the replication applier sends HTTP log fetch requests
                    to the leader in case there is no write activity on the leader.
                    This value will be ignored if set to *0*.
                idleMaxWaitTime:
                  type: integer
                  format: int64
                  description: |+
                    the maximum wait time (in seconds) that the applier will intentionally idle
                    before fetching more log data from the leader in case the leader has
                    already sent all its log data and there have been previous log fetch attempts
                    that resulted in no more log data. This wait time can be used to control the
                    maximum frequency with which the replication applier sends HTTP log fetch
                    requests to the leader in case there is no write activity on the leader for
                    longer periods. This configuration value will only be used if the option
                    *adaptivePolling* is set to *true*.
                    This value will be ignored if set to *0*.
                requireFromPresent:
                  type: boolean
                  description: |+
                    if set to *true*, then the replication applier will check
                    at start of its continuous replication if the start tick from the dump phase
                    is still present on the leader. If not, then there would be data loss. If
                    *requireFromPresent* is *true*, the replication applier will abort with an
                    appropriate error message. If set to *false*, then the replication applier will
                    still start, and ignore the data loss.
                verbose:
                  type: boolean
                  description: |+
                    if set to *true*, then a log line will be emitted for all operations
                    performed by the replication applier. This should be used for debugging
                    replication
                    problems only.
              required:
              - endpoint
              - database
              - password
              - includeSystem
      responses:
        '200':
          description: |2
            is returned if the request was executed successfully.
        '400':
          description: |2
            is returned if the configuration is incomplete or malformed.
        '405':
          description: |2
            is returned when an invalid HTTP method is used.
        '500':
          description: |2
            is returned if an error occurred during synchronization or when starting the
            continuous replication.
        '501':
          description: |2
            is returned when this operation is called on a Coordinator in a cluster.
      tags:
      - Replication
```


