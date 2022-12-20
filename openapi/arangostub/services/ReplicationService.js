/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Returns the configuration of the replication applier. The body of the response is a JSON object with the configuration. The following attributes may be present in the configuration: - *endpoint*: the logger server to connect to (e.g. \"tcp://192.168.173.13:8529\"). - *database*: the name of the database to connect to (e.g. \"_system\"). - *username*: an optional ArangoDB username to use when connecting to the endpoint. - *password*: the password to use when connecting to the endpoint. - *maxConnectRetries*: the maximum number of connection attempts the applier   will make in a row. If the applier cannot establish a connection to the   endpoint in this number of attempts, it will stop itself. - *connectTimeout*: the timeout (in seconds) when attempting to connect to the   endpoint. This value is used for each connection attempt. - *requestTimeout*: the timeout (in seconds) for individual requests to the endpoint. - *chunkSize*: the requested maximum size for log transfer packets that   is used when the endpoint is contacted. - *autoStart*: whether or not to auto-start the replication applier on   (next and following) server starts - *adaptivePolling*: whether or not the replication applier will use   adaptive polling. - *includeSystem*: whether or not system collection operations will be applied - *autoResync*: whether or not the follower should perform a full automatic   resynchronization with the leader in case the leader cannot serve log data   requested by the follower, or when the replication is started and no tick   value   can be found. - *autoResyncRetries*: number of resynchronization retries that will be performed   in a row when automatic resynchronization is enabled and kicks in. Setting this   to *0* will effectively disable *autoResync*. Setting it to some other value   will limit the number of retries that are performed. This helps preventing endless   retries in case resynchronizations always fail. - *initialSyncMaxWaitTime*: the maximum wait time (in seconds) that the initial   synchronization will wait for a response from the leader when fetching initial   collection data.   This wait time can be used to control after what time the initial synchronization   will give up waiting for a response and fail. This value is relevant even   for continuous replication when *autoResync* is set to *true* because this   may re-start the initial synchronization when the leader cannot provide   log data the follwer requires.   This value will be ignored if set to *0*. - *connectionRetryWaitTime*: the time (in seconds) that the applier will   intentionally idle before it retries connecting to the leader in case of   connection problems.   This value will be ignored if set to *0*. - *idleMinWaitTime*: the minimum wait time (in seconds) that the applier will   intentionally idle before fetching more log data from the leader in case   the leader has already sent all its log data. This wait time can be used   to control the frequency with which the replication applier sends HTTP log   fetch requests to the leader in case there is no write activity on the leader.   This value will be ignored if set to *0*. - *idleMaxWaitTime*: the maximum wait time (in seconds) that the applier will   intentionally idle before fetching more log data from the leader in case the   leader has already sent all its log data and there have been previous log   fetch attempts that resulted in no more log data. This wait time can be used   to control the maximum frequency with which the replication applier sends HTTP   log fetch requests to the leader in case there is no write activity on the   leader for longer periods. This configuration value will only be used if the   option *adaptivePolling* is set to *true*.   This value will be ignored if set to *0*. - *requireFromPresent*: if set to *true*, then the replication applier will check   at start whether the start tick from which it starts or resumes replication is   still present on the leader. If not, then there would be data loss. If   *requireFromPresent* is *true*, the replication applier will abort with an   appropriate error message. If set to *false*, then the replication applier will   still start, and ignore the data loss. - *verbose*: if set to *true*, then a log line will be emitted for all operations   performed by the replication applier. This should be used for debugging   replication   problems only. - *restrictType*: the configuration for *restrictCollections* - *restrictCollections*: the optional array of collections to include or exclude,   based on the setting of *restrictType* 
*
* global Boolean If set to *true*, returns the configuration of the global replication applier for all databases. If set to *false*, returns the configuration of the replication applier in the selected database.  (optional)
* no response value expected for this operation
* */
const _apiReplicationApplierConfigGET = ({ global }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        global,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Sets the configuration of the replication applier. The configuration can only be changed while the applier is not running. The updated configuration will be saved immediately but only become active with the next start of the applier. In case of success, the body of the response is a JSON object with the updated configuration. 
*
* global Boolean If set to *true*, adjusts the configuration of the global replication applier for all databases. If set to *false*, adjusts the configuration of the replication applier in the selected database.  (optional)
* apiReplicationApplierConfigGetRequest ApiReplicationApplierConfigGetRequest  (optional)
* no response value expected for this operation
* */
const _apiReplicationApplierConfigPUT = ({ global, apiReplicationApplierConfigGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        global,
        apiReplicationApplierConfigGetRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Starts the replication applier. This will return immediately if the replication applier is already running. If the replication applier is not already running, the applier configuration will be checked, and if it is complete, the applier will be started in a background thread. This means that even if the applier will encounter any errors while running, they will not be reported in the response to this method. To detect replication applier errors after the applier was started, use the *_/_api/replication/applier-state* API instead. 
*
* global Boolean If set to *true*, starts the global replication applier for all databases. If set to *false*, starts the replication applier in the selected database.  (optional)
* from String The remote *lastLogTick* value from which to start applying. If not specified, the last saved tick from the previous applier run is used. If there is no previous applier state saved, the applier will start at the beginning of the logger server's log.  (optional)
* no response value expected for this operation
* */
const _apiReplicationApplierStartPUT = ({ global, from }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        global,
        from,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the state of the replication applier, regardless of whether the applier is currently running or not. The response is a JSON object with the following attributes: - *state*: a JSON object with the following sub-attributes:   - *running*: whether or not the applier is active and running   - *lastAppliedContinuousTick*: the last tick value from the continuous     replication log the applier has applied.   - *lastProcessedContinuousTick*: the last tick value from the continuous     replication log the applier has processed.     Regularly, the last applied and last processed tick values should be     identical. For transactional operations, the replication applier will first     process incoming log events before applying them, so the processed tick     value might be higher than the applied tick value. This will be the case     until the applier encounters the *transaction commit* log event for the     transaction.   - *lastAvailableContinuousTick*: the last tick value the remote server can     provide, for all databases.   - *ticksBehind*: this attribute will be present only if the applier is currently     running. It will provide the number of log ticks between what the applier     has applied/seen and the last log tick value provided by the remote server.     If this value is zero, then both servers are in sync. If this is non-zero,     then the remote server has additional data that the applier has not yet     fetched and processed, or the remote server may have more data that is not     applicable to the applier.     Client applications can use it to determine approximately how far the applier     is behind the remote server, and can periodically check if the value is     increasing (applier is falling behind) or decreasing (applier is catching up).     Please note that as the remote server will only keep one last log tick value     for all of its databases, but replication may be restricted to just certain     databases on the applier, this value is more meaningful when the global applier     is used.     Additionally, the last log tick provided by the remote server may increase     due to writes into system collections that are not replicated due to replication     configuration. So the reported value may exaggerate the reality a bit for     some scenarios.   - *time*: the time on the applier server.   - *totalRequests*: the total number of requests the applier has made to the     endpoint.   - *totalFailedConnects*: the total number of failed connection attempts the     applier has made.   - *totalEvents*: the total number of log events the applier has processed.   - *totalOperationsExcluded*: the total number of log events excluded because     of *restrictCollections*.   - *progress*: a JSON object with details about the replication applier progress.     It contains the following sub-attributes if there is progress to report:     - *message*: a textual description of the progress     - *time*: the date and time the progress was logged     - *failedConnects*: the current number of failed connection attempts   - *lastError*: a JSON object with details about the last error that happened on     the applier. It contains the following sub-attributes if there was an error:     - *errorNum*: a numerical error code     - *errorMessage*: a textual error description     - *time*: the date and time the error occurred     In case no error has occurred, *lastError* will be empty. - *server*: a JSON object with the following sub-attributes:   - *version*: the applier server's version   - *serverId*: the applier server's id - *endpoint*: the endpoint the applier is connected to (if applier is   active) or will connect to (if applier is currently inactive) - *database*: the name of the database the applier is connected to (if applier is   active) or will connect to (if applier is currently inactive) Please note that all \"tick\" values returned do not have a specific unit. Tick values are only meaningful when compared to each other. Higher tick values mean \"later in time\" than lower tick values. 
*
* global Boolean If set to *true*, returns the state of the global replication applier for all databases. If set to *false*, returns the state of the replication applier in the selected database.  (optional)
* no response value expected for this operation
* */
const _apiReplicationApplierStateGET = ({ global }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        global,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Stops the replication applier. This will return immediately if the replication applier is not running. 
*
* global Boolean If set to *true*, stops the global replication applier for all databases. If set to *false*, stops the replication applier in the selected database.  (optional)
* no response value expected for this operation
* */
const _apiReplicationApplierStopPUT = ({ global }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        global,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Deletes the existing dump batch, allowing compaction and cleanup to resume. **Note**: on a Coordinator, this request must have the query parameter *DBserver* which must be an ID of a DB-Server. The very same request is forwarded synchronously to that DB-Server. It is an error if this attribute is not bound in the Coordinator case. 
*
* id String The id of the batch. 
* no response value expected for this operation
* */
const _apiReplicationBatchIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Extends the ttl of an existing dump batch, using the batch's id and the provided ttl value. If the batch's ttl can be extended successfully, the response is empty. **Note**: on a Coordinator, this request must have the query parameter *DBserver* which must be an ID of a DB-Server. The very same request is forwarded synchronously to that DB-Server. It is an error if this attribute is not bound in the Coordinator case. 
*
* id String The id of the batch. 
* apiReplicationBatchIdDeleteRequest ApiReplicationBatchIdDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiReplicationBatchIdPUT = ({ id, apiReplicationBatchIdDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        apiReplicationBatchIdDeleteRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Creates a new dump batch and returns the batch's id. The response is a JSON object with the following attributes: - *id*: the id of the batch - *lastTick*: snapshot tick value using when creating the batch - *state*: additional leader state information (only present if the   `state` URL parameter was set to `true` in the request) **Note**: on a Coordinator, this request must have the query parameter *DBserver* which must be an ID of a DB-Server. The very same request is forwarded synchronously to that DB-Server. It is an error if this attribute is not bound in the Coordinator case. 
*
* state Boolean setting `state` to true will make the response also contain a `state` attribute with information about the leader state. This is used only internally during the replication process  and should not be used by client applications.   (optional)
* apiReplicationBatchPostRequest ApiReplicationBatchPostRequest  (optional)
* no response value expected for this operation
* */
const _apiReplicationBatchPOST = ({ state, apiReplicationBatchPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        state,
        apiReplicationBatchPostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the array of collections and indexes available on the cluster. The response will be an array of JSON objects, one for each collection. Each collection containscontains exactly two keys \"parameters\" and \"indexes\". This information comes from Plan/Collections/{DB-Name}/_* in the Agency, just that the *indexes* attribute there is relocated to adjust it to the data format of arangodump. 
*
* includeSystem Boolean Include system collections in the result. The default value is *true*.  (optional)
* no response value expected for this operation
* */
const _apiReplicationClusterInventoryGET = ({ includeSystem }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        includeSystem,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the data from the collection for the requested range. The *chunkSize* query parameter can be used to control the size of the result. It must be specified in bytes. The *chunkSize* value will only be honored approximately. Otherwise a too low *chunkSize* value could cause the server to not be able to put just one entry into the result and return it. Therefore, the *chunkSize* value will only be consulted after an entry has been written into the result. If the result size is then bigger than *chunkSize*, the server will respond with as many entries as there are in the response already. If the result size is still smaller than *chunkSize*, the server will try to return more data if there's more data left to return. If *chunkSize* is not specified, some server-side default value will be used. The *Content-Type* of the result is *application/x-arango-dump*. This is an easy-to-process format, with all entries going onto separate lines in the response body. Each line itself is a JSON object, with at least the following attributes: - *tick*: the operation's tick attribute - *key*: the key of the document/edge or the key used in the deletion operation - *rev*: the revision id of the document/edge or the deletion operation - *data*: the actual document/edge data for types 2300 and 2301. The full   document/edge data will be returned even for updates. - *type*: the type of entry. Possible values for *type* are:   - 2300: document insertion/update   - 2301: edge insertion/update   - 2302: document/edge deletion **Note**: there will be no distinction between inserts and updates when calling this method. 
*
* collection String The name or id of the collection to dump. 
* batchId BigDecimal The id of the snapshot to use 
* chunkSize BigDecimal Approximate maximum size of the returned result.  (optional)
* no response value expected for this operation
* */
const _apiReplicationDumpGET = ({ collection, batchId, chunkSize }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        batchId,
        chunkSize,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
*  Returns the array of collections and their indexes, and the array of views available. These arrays can be used by replication clients to initiate an initial synchronization with the server.  The response will contain all collections, their indexes and views in the requested database if *global* is not set, and all collections, indexes and views in all databases if *global* is set. In case *global* is not set, it is possible to restrict the response to a single collection by setting the *collection* parameter. In this case the response will contain only information about the requested collection in the *collections* array, and no information about views (i.e. the *views* response attribute will be an empty array).  The response will contain a JSON object with the *collections*, *views*, *state* and *tick* attributes.  *collections* is an array of collections with the following sub-attributes:  - *parameters*: the collection properties  - *indexes*: an array of the indexes of a the collection. Primary indexes and edge indexes    are not included in this array.  The *state* attribute contains the current state of the replication logger. It contains the following sub-attributes:  - *running*: whether or not the replication logger is currently active. Note:   since ArangoDB 2.2, the value will always be *true*  - *lastLogTick*: the value of the last tick the replication logger has written  - *time*: the current time on the server  *views* is an array of available views.  Replication clients should note the *lastLogTick* value returned. They can then fetch collections' data using the dump method up to the value of lastLogTick, and query the continuous replication log for log events after this tick value.  To create a full copy of the collections on the server, a replication client can execute these steps:  - call the *_/inventory* API method. This returns the *lastLogTick* value and the   array of collections and indexes from the server.  - for each collection returned by *_/inventory*, create the collection locally and   call *_/dump* to stream the collection data to the client, up to the value of   *lastLogTick*.   After that, the client can create the indexes on the collections as they were   reported by *_/inventory*.  If the clients wants to continuously stream replication log events from the logger server, the following additional steps need to be carried out:  - the client should call *_/_api/wal/tail* initially to fetch the first batch of   replication events that were logged after the client's call to *_/inventory*.    The call to *_/_api/wal/tail* should use a *from* parameter with the value of the   *lastLogTick* as reported by *_/inventory*. The call to *_/_api/wal/tail* will   return the *x-arango-replication-lastincluded* header which will contain the   last tick value included in the response.  - the client can then continuously call *_/_api/wal/tail* to incrementally fetch new   replication events that occurred after the last transfer.    Calls should use a *from* parameter with the value of the *x-arango-replication-lastincluded*   header of the previous response. If there are no more replication events, the   response will be empty and clients can go to sleep for a while and try again   later.  **Note**: on a Coordinator, this request must have the query parameter *DBserver* which must be an ID of a DB-Server. The very same request is forwarded synchronously to that DB-Server. It is an error if this attribute is not bound in the Coordinator case.  **Note**: Using the `global` parameter the top-level object contains a key `databases` under which each key represents a database name, and the value conforms to the above description.  
*
* batchId BigDecimal A valid batchId is required for this API call 
* includeSystem Boolean Include system collections in the result. The default value is *true*.  (optional)
* global Boolean Include all databases in the response. Only works on `_system` The default value is *false*.  (optional)
* collection String If this parameter is set, the response will be restricted to a single collection (the one specified), and no views will be returned. This can be used as an optimization to reduce the size of the response.  (optional)
* no response value expected for this operation
* */
const _apiReplicationInventoryGET = ({ batchId, includeSystem, global, collection }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        batchId,
        includeSystem,
        global,
        collection,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the first available tick value that can be served from the server's replication log. This method can be called by replication clients after to determine if certain data (identified by a tick value) is still available for replication. The result is a JSON object containing the attribute *firstTick*. This attribute contains the minimum tick value available in the server's replication log. **Note**: this method is not supported on a Coordinator in a cluster. 
*
* no response value expected for this operation
* */
const _apiReplicationLoggerFirstTickGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns data from the server's replication log. This method can be called by replication clients after an initial synchronization of data. The method will return all \"recent\" log entries from the logger server, and the clients can replay and apply these entries locally so they get to the same data state as the logger server. Clients can call this method repeatedly to incrementally fetch all changes from the logger server. In this case, they should provide the *from* value so they will only get returned the log events since their last fetch. When the *from* query parameter is not used, the logger server will return log entries starting at the beginning of its replication log. When the *from* parameter is used, the logger server will only return log entries which have higher tick values than the specified *from* value (note: the log entry with a tick value equal to *from* will be excluded). Use the *from* value when incrementally fetching log data. The *to* query parameter can be used to optionally restrict the upper bound of the result to a certain tick value. If used, the result will contain only log events with tick values up to (including) *to*. In incremental fetching, there is no need to use the *to* parameter. It only makes sense in special situations, when only parts of the change log are required. The *chunkSize* query parameter can be used to control the size of the result. It must be specified in bytes. The *chunkSize* value will only be honored approximately. Otherwise a too low *chunkSize* value could cause the server to not be able to put just one log entry into the result and return it. Therefore, the *chunkSize* value will only be consulted after a log entry has been written into the result. If the result size is then bigger than *chunkSize*, the server will respond with as many log entries as there are in the response already. If the result size is still smaller than *chunkSize*, the server will try to return more data if there's more data left to return. If *chunkSize* is not specified, some server-side default value will be used. The *Content-Type* of the result is *application/x-arango-dump*. This is an easy-to-process format, with all log events going onto separate lines in the response body. Each log event itself is a JSON object, with at least the following attributes: - *tick*: the log event tick value - *type*: the log event type Individual log events will also have additional attributes, depending on the event type. A few common attributes which are used for multiple events types are: - *cid*: id of the collection the event was for - *tid*: id of the transaction the event was contained in - *key*: document key - *rev*: document revision id - *data*: the original document data The response will also contain the following HTTP headers: - *x-arango-replication-active*: whether or not the logger is active. Clients   can use this flag as an indication for their polling frequency. If the   logger is not active and there are no more replication events available, it   might be sensible for a client to abort, or to go to sleep for a long time   and try again later to check whether the logger has been activated. - *x-arango-replication-lastincluded*: the tick value of the last included   value in the result. In incremental log fetching, this value can be used   as the *from* value for the following request. **Note** that if the result is   empty, the value will be *0*. This value should not be used as *from* value   by clients in the next request (otherwise the server would return the log   events from the start of the log again). - *x-arango-replication-lasttick*: the last tick value the logger server has   logged (not necessarily included in the result). By comparing the the last   tick and last included tick values, clients have an approximate indication of   how many events there are still left to fetch. - *x-arango-replication-checkmore*: whether or not there already exists more   log data which the client could fetch immediately. If there is more log data   available, the client could call *logger-follow* again with an adjusted *from*   value to fetch remaining log entries until there are no more.   If there isn't any more log data to fetch, the client might decide to go   to sleep for a while before calling the logger again. **Note**: this method is not supported on a Coordinator in a cluster. 
*
* from BigDecimal Exclusive lower bound tick value for results.  (optional)
* to BigDecimal Inclusive upper bound tick value for results.  (optional)
* chunkSize BigDecimal Approximate maximum size of the returned result.  (optional)
* includeSystem Boolean Include system collections in the result. The default value is *true*.  (optional)
* no response value expected for this operation
* */
const _apiReplicationLoggerFollowGET = ({ from, to, chunkSize, includeSystem }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        from,
        to,
        chunkSize,
        includeSystem,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the current state of the server's replication logger. The state will include information about whether the logger is running and about the last logged tick value. This tick value is important for incremental fetching of data. The body of the response contains a JSON object with the following attributes: - *state*: the current logger state as a JSON object with the following   sub-attributes:   - *running*: whether or not the logger is running   - *lastLogTick*: the tick value of the latest tick the logger has logged.     This value can be used for incremental fetching of log data.   - *totalEvents*: total number of events logged since the server was started.     The value is not reset between multiple stops and re-starts of the logger.   - *time*: the current date and time on the logger server - *server*: a JSON object with the following sub-attributes:   - *version*: the logger server's version   - *serverId*: the logger server's id - *clients*: returns the last fetch status by replication clients connected to   the logger. Each client is returned as a JSON object with the following attributes:   - *syncerId*: id of the client syncer   - *serverId*: server id of client   - *lastServedTick*: last tick value served to this client via the WAL tailing API   - *time*: date and time when this client last called the WAL tailing API 
*
* no response value expected for this operation
* */
const _apiReplicationLoggerStateGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the currently available ranges of tick values for all currently available WAL logfiles. The tick values can be used to determine if certain data (identified by tick value) are still available for replication. The body of the response contains a JSON array. Each array member is an object that describes a single logfile. Each object has the following attributes: * *datafile*: name of the logfile * *status*: status of the datafile, in textual form (e.g. \"sealed\", \"open\") * *tickMin*: minimum tick value contained in logfile * *tickMax*: maximum tick value contained in logfile 
*
* no response value expected for this operation
* */
const _apiReplicationLoggerTickRangesGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Starts a full data synchronization from a remote endpoint into the local ArangoDB database and afterwards starts the continuous replication. The operation works on a per-database level. All local database data will be removed prior to the synchronization. In case of success, the body of the response is a JSON object with the following attributes: - *state*: a JSON object with the following sub-attributes:   - *running*: whether or not the applier is active and running   - *lastAppliedContinuousTick*: the last tick value from the continuous     replication log the applier has applied.   - *lastProcessedContinuousTick*: the last tick value from the continuous     replication log the applier has processed.     Regularly, the last applied and last processed tick values should be     identical. For transactional operations, the replication applier will first     process incoming log events before applying them, so the processed tick     value might be higher than the applied tick value. This will be the case     until the applier encounters the *transaction commit* log event for the     transaction.   - *lastAvailableContinuousTick*: the last tick value the remote server can     provide.   - *ticksBehind*: this attribute will be present only if the applier is currently     running. It will provide the number of log ticks between what the applier     has applied/seen and the last log tick value provided by the remote server.     If this value is zero, then both servers are in sync. If this is non-zero,     then the remote server has additional data that the applier has not yet     fetched and processed, or the remote server may have more data that is not     applicable to the applier.     Client applications can use it to determine approximately how far the applier     is behind the remote server, and can periodically check if the value is     increasing (applier is falling behind) or decreasing (applier is catching up).     Please note that as the remote server will only keep one last log tick value     for all of its databases, but replication may be restricted to just certain     databases on the applier, this value is more meaningful when the global applier     is used.     Additionally, the last log tick provided by the remote server may increase     due to writes into system collections that are not replicated due to replication     configuration. So the reported value may exaggerate the reality a bit for     some scenarios.   - *time*: the time on the applier server.   - *totalRequests*: the total number of requests the applier has made to the     endpoint.   - *totalFailedConnects*: the total number of failed connection attempts the     applier has made.   - *totalEvents*: the total number of log events the applier has processed.   - *totalOperationsExcluded*: the total number of log events excluded because     of *restrictCollections*.   - *progress*: a JSON object with details about the replication applier progress.     It contains the following sub-attributes if there is progress to report:     - *message*: a textual description of the progress     - *time*: the date and time the progress was logged     - *failedConnects*: the current number of failed connection attempts   - *lastError*: a JSON object with details about the last error that happened on     the applier. It contains the following sub-attributes if there was an error:     - *errorNum*: a numerical error code     - *errorMessage*: a textual error description     - *time*: the date and time the error occurred     In case no error has occurred, *lastError* will be empty. - *server*: a JSON object with the following sub-attributes:   - *version*: the applier server's version   - *serverId*: the applier server's id - *endpoint*: the endpoint the applier is connected to (if applier is   active) or will connect to (if applier is currently inactive) - *database*: the name of the database the applier is connected to (if applier is   active) or will connect to (if applier is currently inactive) Please note that all \"tick\" values returned do not have a specific unit. Tick values are only meaningful when compared to each other. Higher tick values mean \"later in time\" than lower tick values. WARNING: calling this method will synchronize data from the collections found on the remote leader to the local ArangoDB database. All data in the local collections will be purged and replaced with data from the leader. Use with caution! Please also keep in mind that this command may take a long time to complete and return. This is because it will first do a full data synchronization with the leader, which will take time roughly proportional to the amount of data. **Note**: this method is not supported on a Coordinator in a cluster. 
*
* apiReplicationMakeFollowerPutRequest ApiReplicationMakeFollowerPutRequest  (optional)
* no response value expected for this operation
* */
const _apiReplicationMakeFollowerPUT = ({ apiReplicationMakeFollowerPutRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiReplicationMakeFollowerPutRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns documents by revision The body of the request should be JSON/VelocyPack and should consist of an array of string-encoded revision IDs: ``` [   <String, revision>,   <String, revision>,   ...   <String, revision> ] ``` In particular, the revisions should be sorted in ascending order of their decoded values. The result will be a JSON/VelocyPack array of document objects. If there is no document corresponding to a particular requested revision, an empty object will be returned in its place. The response may be truncated if it would be very long. In this case, the response array length will be less than the request array length, and subsequent requests can be made for the omitted documents. Each `<String, revision>` value type is a 64-bit value encoded as a string of 11 characters, using the same encoding as our document `_rev` values. The reason for this is that 64-bit values cannot necessarily be represented in full in JavaScript, as it handles all numbers as floating point, and can only represent up to `2^53-1` faithfully. 
*
* collection String The name or id of the collection to query. 
* batchId BigDecimal The id of the snapshot to use 
* no response value expected for this operation
* */
const _apiReplicationRevisionsDocumentsPUT = ({ collection, batchId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        batchId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the revision IDs of documents within requested ranges The body of the request should be JSON/VelocyPack and should consist of an array of pairs of string-encoded revision IDs: ``` [   [<String, revision>, <String, revision>],   [<String, revision>, <String, revision>],   ...   [<String, revision>, <String, revision>] ] ``` In particular, the pairs should be non-overlapping, and sorted in ascending order of their decoded values. The result will be JSON/VelocyPack in the following format: ``` {   ranges: [     [<String, revision>, <String, revision>, ... <String, revision>],     [<String, revision>, <String, revision>, ... <String, revision>],     ...,     [<String, revision>, <String, revision>, ... <String, revision>]   ]   resume: <String, revision> } ``` The `resume` field is optional. If specified, then the response is to be considered partial, only valid through the revision specified. A subsequent request should be made with the same request body, but specifying the `resume` URL parameter with the value specified. The subsequent response will pick up from the appropriate request pair, and omit any complete ranges or revisions which are less than the requested resume revision. As an example (ignoring the string-encoding for a moment), if ranges `[1, 3], [5, 9], [12, 15]` are requested, then a first response may return `[], [5, 6]` with a resume point of `7` and a subsequent response might be `[8], [12, 13]`. If a requested range contains no revisions, then an empty array is returned. Empty ranges will not be omitted. Each `<String, revision>` value type is a 64-bit value encoded as a string of 11 characters, using the same encoding as our document `_rev` values. The reason for this is that 64-bit values cannot necessarily be represented in full in JavaScript, as it handles all numbers as floating point, and can only represent up to `2^53-1` faithfully. 
*
* collection String The name or id of the collection to query. 
* batchId BigDecimal The id of the snapshot to use 
* resume String The revision at which to resume, if a previous request was truncated  (optional)
* no response value expected for this operation
* */
const _apiReplicationRevisionsRangesPUT = ({ collection, batchId, resume }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        batchId,
        resume,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the Merkle tree from the collection. The result will be JSON/VelocyPack in the following format: ``` {   version: <Number>,   branchingFactor: <Number>   maxDepth: <Number>,   rangeMin: <String, revision>,   rangeMax: <String, revision>,   nodes: [     { count: <Number>, hash: <String, revision> },     { count: <Number>, hash: <String, revision> },     ...     { count: <Number>, hash: <String, revision> }   ] } ``` At the moment, there is only one version, 1, so this can safely be ignored for now. Each `<String, revision>` value type is a 64-bit value encoded as a string of 11 characters, using the same encoding as our document `_rev` values. The reason for this is that 64-bit values cannot necessarily be represented in full in JavaScript, as it handles all numbers as floating point, and can only represent up to `2^53-1` faithfully. The node count should correspond to a full tree with the given `maxDepth` and `branchingFactor`. The nodes are laid out in level-order tree traversal, so the root is at index `0`, its children at indices `[1, branchingFactor]`, and so on. 
*
* collection String The name or id of the collection to query. 
* batchId BigDecimal The id of the snapshot to use 
* no response value expected for this operation
* */
const _apiReplicationRevisionsTreeGET = ({ collection, batchId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        batchId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Rebuilds the Merkle tree for the collection. If successful, there will be no return body. 
*
* collection String The name or id of the collection to query. 
* no response value expected for this operation
* */
const _apiReplicationRevisionsTreePOST = ({ collection }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the servers id. The id is also returned by other replication API methods, and this method is an easy means of determining a server's id. The body of the response is a JSON object with the attribute *serverId*. The server id is returned as a string. 
*
* no response value expected for this operation
* */
const _apiReplicationServerIdGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Starts a full data synchronization from a remote endpoint into the local ArangoDB database. The *sync* method can be used by replication clients to connect an ArangoDB database to a remote endpoint, fetch the remote list of collections and indexes, and collection data. It will thus create a local backup of the state of data at the remote ArangoDB database. *sync* works on a per-database level. *sync* will first fetch the list of collections and indexes from the remote endpoint. It does so by calling the *inventory* API of the remote database. It will then purge data in the local ArangoDB database, and after start will transfer collection data from the remote database to the local ArangoDB database. It will extract data from the remote database by calling the remote database's *dump* API until all data are fetched. In case of success, the body of the response is a JSON object with the following attributes: - *collections*: an array of collections that were transferred from the endpoint - *lastLogTick*: the last log tick on the endpoint at the time the transfer   was started. Use this value as the *from* value when starting the continuous   synchronization later. WARNING: calling this method will synchronize data from the collections found on the remote endpoint to the local ArangoDB database. All data in the local collections will be purged and replaced with data from the endpoint. Use with caution! **Note**: this method is not supported on a Coordinator in a cluster. 
*
* apiReplicationSyncPutRequest ApiReplicationSyncPutRequest  (optional)
* no response value expected for this operation
* */
const _apiReplicationSyncPUT = ({ apiReplicationSyncPutRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiReplicationSyncPutRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the last available tick value that can be served from the server's replication log. This corresponds to the tick of the latest successfull operation. The result is a JSON object containing the attributes *tick*, *time* and *server*. * *tick*: contains the last available tick, *time* * *time*: the server time as string in format \"YYYY-MM-DDTHH:MM:SSZ\" * *server*: An object with fields *version* and *serverId* **Note**: this method is not supported on a Coordinator in a cluster. 
*
* no response value expected for this operation
* */
const _apiWalLastTickGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns the currently available ranges of tick values for all WAL files. The tick values can be used to determine if certain data (identified by tick value) are still available for replication. The body of the response contains a JSON object. * *tickMin*: minimum tick available * *tickMax*: maximum tick available * *time*: the server time as string in format \"YYYY-MM-DDTHH:MM:SSZ\" * *server*: An object with fields *version* and *serverId* 
*
* no response value expected for this operation
* */
const _apiWalRangeGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Returns data from the server's write-ahead log (also named replication log). This method can be called by replication clients after an initial synchronization of data. The method returns all \"recent\" logged operations from the server. Clients can replay and apply these operations locally so they get to the same data state as the server. Clients can call this method repeatedly to incrementally fetch all changes from the server. In this case, they should provide the `from` value so they only get returned the log events since their last fetch. When the `from` query parameter is not used, the server returns log entries starting at the beginning of its replication log. When the `from` parameter is used, the server only returns log entries which have higher tick values than the specified `from` value (note: the log entry with a tick value equal to `from` is excluded). Use the `from` value when incrementally fetching log data. The `to` query parameter can be used to optionally restrict the upper bound of the result to a certain tick value. If used, the result contains only log events with tick values up to (including) `to`. In incremental fetching, there is no need to use the `to` parameter. It only makes sense in special situations, when only parts of the change log are required. The `chunkSize` query parameter can be used to control the size of the result. It must be specified in bytes. The `chunkSize` value is only honored approximately. Otherwise, a too low `chunkSize` value could cause the server to not be able to put just one log entry into the result and return it. Therefore, the `chunkSize` value is only consulted after a log entry has been written into the result. If the result size is then bigger than `chunkSize`, the server responds with as many log entries as there are in the response already. If the result size is still smaller than `chunkSize`, the server tries to return more data if there's more data left to return. If `chunkSize` is not specified, some server-side default value is used. The `Content-Type` of the result is `application/x-arango-dump`. This is an easy-to-process format, with all log events going onto separate lines in the response body. Each log event itself is a JSON object, with at least the following attributes: - `tick`: the log event tick value - `type`: the log event type Individual log events also have additional attributes, depending on the event type. A few common attributes which are used for multiple events types are: - `cuid`: globally unique id of the View or collection the event was for - `db`: the database name the event was for - `tid`: id of the transaction the event was contained in - `data`: the original document data A more detailed description of the individual replication event types and their data structures can be found in [Operation Types](#operation-types). The response also contains the following HTTP headers: - `x-arango-replication-active`: whether or not the logger is active. Clients   can use this flag as an indication for their polling frequency. If the   logger is not active and there are no more replication events available, it   might be sensible for a client to abort, or to go to sleep for a long time   and try again later to check whether the logger has been activated. - `x-arango-replication-lastincluded`: the tick value of the last included   value in the result. In incremental log fetching, this value can be used   as the `from` value for the following request. **Note** that if the result is   empty, the value is `0`. This value should not be used as `from` value   by clients in the next request (otherwise the server would return the log   events from the start of the log again). - `x-arango-replication-lastscanned`: the last tick the server scanned while   computing the operation log. This might include operations the server did not   returned to you due to various reasons (i.e. the value was filtered or skipped).   You may use this value in the `lastScanned` header to allow the RocksDB storage engine   to break up requests over multiple responses. - `x-arango-replication-lasttick`: the last tick value the server has   logged in its write ahead log (not necessarily included in the result). By comparing the the last   tick and last included tick values, clients have an approximate indication of   how many events there are still left to fetch. - `x-arango-replication-frompresent`: is set to _true_ if server returned   all tick values starting from the specified tick in the _from_ parameter.   Should this be set to false the server did not have these operations anymore   and the client might have missed operations. - `x-arango-replication-checkmore`: whether or not there already exists more   log data which the client could fetch immediately. If there is more log data   available, the client could call the tailing API again with an adjusted `from`   value to fetch remaining log entries until there are no more.   If there isn't any more log data to fetch, the client might decide to go   to sleep for a while before calling the logger again. **Note**: this method is not supported on a Coordinator in a cluster. 
*
* global Boolean Whether operations for all databases should be included. If set to `false`, only the operations for the current database are included. The value `true` is only valid on the `_system` database. The default is `false`.  (optional)
* from BigDecimal Exclusive lower bound tick value for results. On successive calls to this API you should set this to the value returned with the `x-arango-replication-lastincluded` header (unless that header contains 0).  (optional)
* to BigDecimal Inclusive upper bound tick value for results.  (optional)
* lastScanned BigDecimal Should be set to the value of the `x-arango-replication-lastscanned` header or alternatively 0 on first try. This allows the RocksDB storage engine to break up large transactions over multiple responses.  (optional)
* chunkSize BigDecimal Approximate maximum size of the returned result.  (optional)
* syncerId BigDecimal The ID of the client used to tail results. The server uses this to keep operations until the client has fetched them. Must be a positive integer. **Note** `syncerId` or `serverId` is required to have a chance at fetching all operations with the RocksDB storage engine.  (optional)
* serverId BigDecimal The ID of the client machine. If `syncerId` is unset, the server uses this to keep operations until the client has fetched them. Must be a positive integer. **Note** `serverId` or `syncerId` is required to have a chance at fetching all operations with the RocksDB storage engine.  (optional)
* clientInfo String Short description of the client, used for informative purposes only.  (optional)
* no response value expected for this operation
* */
const _apiWalTailGET = ({ global, from, to, lastScanned, chunkSize, syncerId, serverId, clientInfo }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        global,
        from,
        to,
        lastScanned,
        chunkSize,
        syncerId,
        serverId,
        clientInfo,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  _apiReplicationApplierConfigGET,
  _apiReplicationApplierConfigPUT,
  _apiReplicationApplierStartPUT,
  _apiReplicationApplierStateGET,
  _apiReplicationApplierStopPUT,
  _apiReplicationBatchIdDELETE,
  _apiReplicationBatchIdPUT,
  _apiReplicationBatchPOST,
  _apiReplicationClusterInventoryGET,
  _apiReplicationDumpGET,
  _apiReplicationInventoryGET,
  _apiReplicationLoggerFirstTickGET,
  _apiReplicationLoggerFollowGET,
  _apiReplicationLoggerStateGET,
  _apiReplicationLoggerTickRangesGET,
  _apiReplicationMakeFollowerPUT,
  _apiReplicationRevisionsDocumentsPUT,
  _apiReplicationRevisionsRangesPUT,
  _apiReplicationRevisionsTreeGET,
  _apiReplicationRevisionsTreePOST,
  _apiReplicationServerIdGET,
  _apiReplicationSyncPUT,
  _apiWalLastTickGET,
  _apiWalRangeGET,
  _apiWalTailGET,
};
