/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Returns all registered AQL user functions. The call will return a JSON array with status codes and all user functions found under *result*. 
*
* namespace String Returns all registered AQL user functions from namespace *namespace* under *result*.  (optional)
* no response value expected for this operation
* */
const _apiAqlfunctionGET = ({ namespace }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        namespace,
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
* Removes an existing AQL user function or function group, identified by *name*. 
*
* name String the name of the AQL user function. 
* group String - *true* The function name provided in *name* is treated as   a namespace prefix, and all functions in the specified namespace will be deleted.   The returned number of deleted functions may become 0 if none matches the string. - *false* The function name provided in *name* must be fully   qualified, including any namespaces. If none matches the *name*, HTTP 404 is returned.  (optional)
* no response value expected for this operation
* */
const _apiAqlfunctionNameDELETE = ({ name, group }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        name,
        group,
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
* In case of success, HTTP 200 is returned. If the function isn't valid etc. HTTP 400 including a detailed error message will be returned. 
*
* apiAqlfunctionGetRequest ApiAqlfunctionGetRequest  (optional)
* no response value expected for this operation
* */
const _apiAqlfunctionPOST = ({ apiAqlfunctionGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiAqlfunctionGetRequest,
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
* To explain how an AQL query would be executed on the server, the query string can be sent to the server via an HTTP POST request. The server will then validate the query and create an execution plan for it. The execution plan will be returned, but the query will not be executed. The execution plan that is returned by the server can be used to estimate the probable performance of the query. Though the actual performance will depend on many different factors, the execution plan normally can provide some rough estimates on the amount of work the server needs to do in order to actually run the query. By default, the explain operation will return the optimal plan as chosen by the query optimizer The optimal plan is the plan with the lowest total estimated cost. The plan will be returned in the attribute *plan* of the response object. If the option *allPlans* is specified in the request, the result will contain all plans created by the optimizer. The plans will then be returned in the attribute *plans*. The result will also contain an attribute *warnings*, which is an array of warnings that occurred during optimization or execution plan creation. Additionally, a *stats* attribute is contained in the result with some optimizer statistics. If *allPlans* is set to *false*, the result will contain an attribute *cacheable* that states whether the query results can be cached on the server if the query result cache were used. The *cacheable* attribute is not present when *allPlans* is set to *true*. Each plan in the result is a JSON object with the following attributes: - *nodes*: the array of execution nodes of the plan. - *estimatedCost*: the total estimated cost for the plan. If there are multiple   plans, the optimizer will choose the plan with the lowest total cost. - *collections*: an array of collections used in the query - *rules*: an array of rules the optimizer applied. - *variables*: array of variables used in the query (note: this may contain   internal variables created by the optimizer) 
*
* apiExplainPostRequest ApiExplainPostRequest  (optional)
* no response value expected for this operation
* */
const _apiExplainPOST = ({ apiExplainPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiExplainPostRequest,
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
* clears the query results cache for the current database 
*
* no response value expected for this operation
* */
const _apiQueryCacheDELETE = () => new Promise(
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
* Returns an array containing the AQL query results currently stored in the query results cache of the selected database. Each result is a JSON object with the following attributes: - *hash*: the query result's hash - *query*: the query string - *bindVars*: the query's bind parameters. this attribute is only shown if tracking for   bind variables was enabled at server start - *size*: the size of the query result and bind parameters, in bytes - *results*: number of documents/rows in the query result - *started*: the date and time when the query was stored in the cache - *hits*: number of times the result was served from the cache (can be   *0* for queries that were only stored in the cache but were never accessed   again afterwards) - *runTime*: the query's run time - *dataSources*: an array of collections/Views the query was using 
*
* no response value expected for this operation
* */
const _apiQueryCacheEntriesGET = () => new Promise(
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
* Returns the global AQL query results cache configuration. The configuration is a JSON object with the following properties: - *mode*: the mode the AQL query results cache operates in. The mode is one of the following   values: *off*, *on* or *demand*. - *maxResults*: the maximum number of query results that will be stored per database-specific   cache. - *maxResultsSize*: the maximum cumulated size of query results that will be stored per   database-specific cache. - *maxEntrySize*: the maximum individual result size of queries that will be stored per   database-specific cache. - *includeSystem*: whether or not results of queries that involve system collections will be   stored in the query results cache. 
*
* no response value expected for this operation
* */
const _apiQueryCachePropertiesGET = () => new Promise(
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
* After the properties have been changed, the current set of properties will be returned in the HTTP response. Note: changing the properties may invalidate all results in the cache. The global properties for AQL query cache. The properties need to be passed in the attribute *properties* in the body of the HTTP request. *properties* needs to be a JSON object with the following properties: 
*
* apiQueryCachePropertiesGetRequest ApiQueryCachePropertiesGetRequest  (optional)
* no response value expected for this operation
* */
const _apiQueryCachePropertiesPUT = ({ apiQueryCachePropertiesGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiQueryCachePropertiesGetRequest,
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
* Returns an array containing the AQL queries currently running in the selected database. Each query is a JSON object with the following attributes: - *id*: the query's id - *database*: the name of the database the query runs in - *user*: the name of the user that started the query - *query*: the query string (potentially truncated) - *bindVars*: the bind parameter values used by the query - *started*: the date and time when the query was started - *runTime*: the query's run time up to the point the list of queries was   queried - *state*: the query's current execution state (as a string). One of:   - `\"initializing\"`   - `\"parsing\"`   - `\"optimizing ast\"`   - `\"loading collections\"`   - `\"instantiating plan\"`   - `\"optimizing plan\"`   - `\"executing\"`   - `\"finalizing\"`   - `\"finished\"`   - `\"killed\"`   - `\"invalid\"` - *stream*: whether or not the query uses a streaming cursor 
*
* all Boolean If set to *true*, will return the currently running queries in all databases, not just the selected one. Using the parameter is only allowed in the system database and with superuser privileges.  (optional)
* no response value expected for this operation
* */
const _apiQueryCurrentGET = ({ all }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        all,
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
* This endpoint is for query validation only. To actually query the database, see `/api/cursor`. 
*
* apiQueryPostRequest ApiQueryPostRequest  (optional)
* no response value expected for this operation
* */
const _apiQueryPOST = ({ apiQueryPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiQueryPostRequest,
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
* Returns the current query tracking configuration. The configuration is a JSON object with the following properties: - *enabled*: if set to *true*, then queries will be tracked. If set to   *false*, neither queries nor slow queries will be tracked. - *trackSlowQueries*: if set to *true*, then slow queries will be tracked   in the list of slow queries if their runtime exceeds the value set in   *slowQueryThreshold*. In order for slow queries to be tracked, the *enabled*   property must also be set to *true*. - *trackBindVars*: if set to *true*, then bind variables used in queries will   be tracked. - *maxSlowQueries*: the maximum number of slow queries to keep in the list   of slow queries. If the list of slow queries is full, the oldest entry in   it will be discarded when additional slow queries occur. - *slowQueryThreshold*: the threshold value for treating a query as slow. A   query with a runtime greater or equal to this threshold value will be   put into the list of slow queries when slow query tracking is enabled.   The value for *slowQueryThreshold* is specified in seconds. - *maxQueryStringLength*: the maximum query string length to keep in the   list of queries. Query strings can have arbitrary lengths, and this property   can be used to save memory in case very long query strings are used. The   value is specified in bytes. 
*
* no response value expected for this operation
* */
const _apiQueryPropertiesGET = () => new Promise(
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
* The properties need to be passed in the attribute *properties* in the body of the HTTP request. *properties* needs to be a JSON object. After the properties have been changed, the current set of properties will be returned in the HTTP response. 
*
* apiQueryPropertiesGetRequest ApiQueryPropertiesGetRequest  (optional)
* no response value expected for this operation
* */
const _apiQueryPropertiesPUT = ({ apiQueryPropertiesGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiQueryPropertiesGetRequest,
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
*  Kills a running query in the currently selected database. The query will be  terminated at the next cancelation point.  
*
* queryId String The id of the query. 
* all Boolean If set to *true*, will attempt to kill the specified query in all databases,  not just the selected one. Using the parameter is only allowed in the system database and with superuser privileges.   (optional)
* no response value expected for this operation
* */
const _apiQueryQueryIdDELETE = ({ queryId, all }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        queryId,
        all,
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
* A list of all optimizer rules and their properties. 
*
* returns __api_query_rules_get_200_response
* */
const _apiQueryRulesGET = () => new Promise(
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
* Clears the list of slow AQL queries in the currently selected database 
*
* all Boolean If set to *true*, will clear the slow query history in all databases, not just the selected one. Using the parameter is only allowed in the system database and with superuser privileges.  (optional)
* no response value expected for this operation
* */
const _apiQuerySlowDELETE = ({ all }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        all,
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
* Returns an array containing the last AQL queries that are finished and have exceeded the slow query threshold in the selected database. The maximum amount of queries in the list can be controlled by setting the query tracking property `maxSlowQueries`. The threshold for treating a query as *slow* can be adjusted by setting the query tracking property `slowQueryThreshold`. Each query is a JSON object with the following attributes: - *id*: the query's id - *database*: the name of the database the query runs in - *user*: the name of the user that started the query - *query*: the query string (potentially truncated) - *bindVars*: the bind parameter values used by the query - *started*: the date and time when the query was started - *runTime*: the query's total run time - *state*: the query's current execution state (will always be \"finished\"   for the list of slow queries) - *stream*: whether or not the query uses a streaming cursor 
*
* all Boolean If set to *true*, will return the slow queries from all databases, not just the selected one. Using the parameter is only allowed in the system database and with superuser privileges.  (optional)
* no response value expected for this operation
* */
const _apiQuerySlowGET = ({ all }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        all,
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
  _apiAqlfunctionGET,
  _apiAqlfunctionNameDELETE,
  _apiAqlfunctionPOST,
  _apiExplainPOST,
  _apiQueryCacheDELETE,
  _apiQueryCacheEntriesGET,
  _apiQueryCachePropertiesGET,
  _apiQueryCachePropertiesPUT,
  _apiQueryCurrentGET,
  _apiQueryPOST,
  _apiQueryPropertiesGET,
  _apiQueryPropertiesPUT,
  _apiQueryQueryIdDELETE,
  _apiQueryRulesGET,
  _apiQuerySlowDELETE,
  _apiQuerySlowGET,
};
