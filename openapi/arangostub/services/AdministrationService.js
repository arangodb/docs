/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Execute the given set of move shard operations. You can use the `POST /_admin/cluster/rebalance` endpoint to calculate these operations to improve the balance of shards, leader shards, and follower shards. 
*
* adminClusterRebalanceExecutePostRequest AdminClusterRebalanceExecutePostRequest  (optional)
* no response value expected for this operation
* */
const _adminClusterRebalanceExecutePOST = ({ adminClusterRebalanceExecutePostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminClusterRebalanceExecutePostRequest,
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
*  Computes the current cluster imbalance and returns the result.  It additionally shows the amount of ongoing and pending move shard operations.  
*
* returns __admin_cluster_rebalance_get_200_response
* */
const _adminClusterRebalanceGET = () => new Promise(
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
* Compute a set of move shard operations to improve balance. 
*
* adminClusterRebalanceGetRequest AdminClusterRebalanceGetRequest  (optional)
* no response value expected for this operation
* */
const _adminClusterRebalancePOST = ({ adminClusterRebalanceGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminClusterRebalanceGetRequest,
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
* Compute a set of move shard operations to improve balance. These moves are then immediately executed. 
*
* adminClusterRebalanceGetRequest AdminClusterRebalanceGetRequest  (optional)
* no response value expected for this operation
* */
const _adminClusterRebalancePUT = ({ adminClusterRebalanceGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminClusterRebalanceGetRequest,
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
* This endpoint can be used to reclaim disk space after substantial data deletions have taken place. It requires superuser access. 
*
* adminCompactPutRequest AdminCompactPutRequest  (optional)
* no response value expected for this operation
* */
const _adminCompactPUT = ({ adminCompactPutRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminCompactPutRequest,
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
* Returns the database version that this server requires. The version is returned in the *version* attribute of the result. 
*
* no response value expected for this operation
* */
const _adminDatabaseTargetVersionGET = () => new Promise(
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
* The call returns an object with the servers request information 
*
* adminEchoPostRequest AdminEchoPostRequest  (optional)
* returns __admin_echo_post_200_response
* */
const _adminEchoPOST = ({ adminEchoPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminEchoPostRequest,
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
* Executes the javascript code in the body on the server as the body of a function with no arguments. If you have a *return* statement then the return value you produce will be returned as content type *application/json*. If the parameter *returnAsJSON* is set to *true*, the result will be a JSON object describing the return value directly, otherwise a string produced by JSON.stringify will be returned. Note that this API endpoint will only be present if the server was started with the option `--javascript.allow-admin-execute true`. The default value of this option is `false`, which disables the execution of user-defined code and disables this API endpoint entirely. This is also the recommended setting for production. 
*
* adminExecutePostRequest AdminExecutePostRequest  (optional)
* no response value expected for this operation
* */
const _adminExecutePOST = ({ adminExecutePostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminExecutePostRequest,
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
* View the license information and status of an Enterprise Edition instance. Can be called on single servers, Coordinators, and DB-Servers. 
*
* returns __admin_license_get_200_response
* */
const _adminLicenseGET = () => new Promise(
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
* Set a new license for an Enterprise Edition instance. Can be called on single servers, Coordinators, and DB-Servers. 
*
* force Boolean Set to `true` to change the license even if it expires sooner than the current one.  (optional)
* adminLicenseGetRequest AdminLicenseGetRequest  (optional)
* no response value expected for this operation
* */
const _adminLicensePUT = ({ force, adminLicenseGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        force,
        adminLicenseGetRequest,
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
*  Returns the instance's current metrics in Prometheus format. The returned document collects all instance metrics, which are measured at any given time and exposes them for collection by Prometheus.  The document contains different metrics and metrics groups dependent on the role of the queried instance. All exported metrics are published with the `arangodb_` or `rocksdb_` string to distinguish them from other collected data.   The API then needs to be added to the Prometheus configuration file for collection.  
*
* serverId String Returns metrics of the specified server. If no serverId is given, the asked  server will reply. This parameter is only meaningful on Coordinators.   (optional)
* no response value expected for this operation
* */
const _adminMetricsGET = ({ serverId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        serverId,
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
* Returns the instance's current metrics in Prometheus format. The returned document collects all instance metrics, which are measured at any given time and exposes them for collection by Prometheus. The document contains different metrics and metrics groups dependent on the role of the queried instance. All exported metrics are published with the prefix `arangodb_` or `rocksdb_` to distinguish them from other collected data. The API then needs to be added to the Prometheus configuration file for collection. 
*
* serverId String Returns metrics of the specified server. If no serverId is given, the asked server will reply. This parameter is only meaningful on Coordinators.  (optional)
* no response value expected for this operation
* */
const _adminMetricsV2GET = ({ serverId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        serverId,
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
* Reloads the routing information from the collection *routing*. 
*
* no response value expected for this operation
* */
const _adminRoutingReloadPOST = () => new Promise(
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
* Return availability information about a server. This is a public API so it does *not* require authentication. It is meant to be used only in the context of server monitoring. 
*
* no response value expected for this operation
* */
const _adminServerAvailabilityGET = () => new Promise(
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
* Change the user supplied encryption at rest key by sending a request without payload to this endpoint. The file supplied via `--rocksdb.encryption-keyfolder` will be reloaded and the internal encryption key will be re-encrypted with the new user key. This is a protected API and can only be executed with superuser rights. This API is not available on coordinator nodes. The API returns HTTP 404 in case encryption key rotation is disabled. 
*
* no response value expected for this operation
* */
const _adminServerEncryptionPOST = () => new Promise(
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
* Returns the id of a server in a cluster. The request will fail if the server is not running in cluster mode. 
*
* no response value expected for this operation
* */
const _adminServerIdGET = () => new Promise(
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
* Get information about the currently loaded secrets. To utilize the API a superuser JWT token is necessary, otherwise the response will be _HTTP 403 Forbidden_. 
*
* no response value expected for this operation
* */
const _adminServerJwtGET = () => new Promise(
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
* Sending a request without payload to this endpoint reloads the JWT secret(s) from disk. Only the files specified via the arangod startup option `--server.jwt-secret-keyfile` or `--server.jwt-secret-folder` are used. It is not possible to change the locations where files are loaded from without restarting the process. To utilize the API a superuser JWT token is necessary, otherwise the response will be _HTTP 403 Forbidden_. 
*
* no response value expected for this operation
* */
const _adminServerJwtPOST = () => new Promise(
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
* Return mode information about a server. The json response will contain a field `mode` with the value `readonly` or `default`. In a read-only server all write operations will fail with an error code of `1004` (_ERROR_READ_ONLY_). Creating or dropping of databases and collections will also fail with error code `11` (_ERROR_FORBIDDEN_). This API requires authentication. 
*
* no response value expected for this operation
* */
const _adminServerModeGET = () => new Promise(
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
* Update mode information about a server. The json response will contain a field `mode` with the value `readonly` or `default`. In a read-only server all write operations will fail with an error code of `1004` (_ERROR_READ_ONLY_). Creating or dropping of databases and collections will also fail with error code `11` (_ERROR_FORBIDDEN_). This is a protected API. It requires authentication and administrative server rights. 
*
* adminServerModeGetRequest AdminServerModeGetRequest  (optional)
* no response value expected for this operation
* */
const _adminServerModePUT = ({ adminServerModeGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminServerModeGetRequest,
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
* Returns the role of a server in a cluster. The role is returned in the *role* attribute of the result. Possible return values for *role* are: - *SINGLE*: the server is a standalone server without clustering - *COORDINATOR*: the server is a Coordinator in a cluster - *PRIMARY*: the server is a DB-Server in a cluster - *SECONDARY*: this role is not used anymore - *AGENT*: the server is an Agency node in a cluster - *UNDEFINED*: in a cluster, *UNDEFINED* is returned if the server role cannot be    determined. 
*
* returns __admin_server_role_get_200_response
* */
const _adminServerRoleGET = () => new Promise(
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
* Return a summary of the TLS data. The JSON response will contain a field `result` with the following components:   - `keyfile`: Information about the key file.   - `clientCA`: Information about the CA for client certificate     verification. If server name indication (SNI) is used and multiple key files are configured for different server names, then there is an additional attribute `SNI`, which contains for each configured server name the corresponding information about the key file for that server name. In all cases the value of the attribute will be a JSON object, which has a subset of the following attributes (whatever is appropriate):   - `sha256`: The value is a string with the SHA256 of the whole input     file.   - `certificates`: The value is a JSON array with the public     certificates in the chain in the file.   - `privateKeySha256`: In cases where there is a private key (`keyfile`     but not `clientCA`), this field is present and contains a     JSON string with the SHA256 of the private key. This API requires authentication. 
*
* no response value expected for this operation
* */
const _adminServerTlsGET = () => new Promise(
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
* This API call triggers a reload of all the TLS data and then returns a summary. The JSON response is exactly as in the corresponding GET request (see there). This is a protected API and can only be executed with superuser rights. 
*
* no response value expected for this operation
* */
const _adminServerTlsPOST = () => new Promise(
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
* This call initiates a clean shutdown sequence. Requires administrative privileges. 
*
* soft Boolean <small>Introduced in v3.7.12, v3.8.1, v3.9.0</small> If set to `true`, this initiates a soft shutdown. This is only available on Coordinators. When issued, the Coordinator tracks a number of ongoing operations, waits until all have finished, and then shuts itself down normally. It will still accept new operations. This feature can be used to make restart operations of Coordinators less intrusive for clients. It is designed for setups with a load balancer in front of Coordinators. Remove the designated Coordinator from the load balancer before issuing the soft-shutdown. The remaining Coordinators will internally forward requests that need to be handled by the designated Coordinator. All other requests will be handled by the remaining Coordinators, reducing the designated Coordinator's load. The following types of operations are tracked  - AQL cursors (in particular streaming cursors)  - Transactions (in particular stream transactions)  - Pregel runs (conducted by this Coordinator)  - Ongoing asynchronous requests (using the `x-arango-async store` HTTP header  - Finished asynchronous requests, whose result has not yet been    collected  - Queued low priority requests (most normal requests)  - Ongoing low priority requests  (optional)
* no response value expected for this operation
* */
const _adminShutdownDELETE = ({ soft }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        soft,
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
* <small>Introduced in: v3.7.12, v3.8.1, v3.9.0</small> This call reports progress about a soft Coordinator shutdown (see documentation of `DELETE /_admin/shutdown?soft=true`). In this case, the following types of operations are tracked:  - AQL cursors (in particular streaming cursors)  - Transactions (in particular stream transactions)  - Pregel runs (conducted by this Coordinator)  - Ongoing asynchronous requests (using the `x-arango-async: store` HTTP header  - Finished asynchronous requests, whose result has not yet been    collected  - Queued low priority requests (most normal requests)  - Ongoing low priority requests This API is only available on Coordinators. 
*
* returns __admin_shutdown_delete_200_response
* */
const _adminShutdownGET = () => new Promise(
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
* Returns status information about the server. 
*
* returns __admin_status_get_200_response
* */
const _adminStatusGET = () => new Promise(
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
* The call returns an object with the attribute *time*. This contains the current system time as a Unix timestamp with microsecond precision. 
*
* returns __admin_time_get_200_response
* */
const _adminTimeGET = () => new Promise(
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
* Returns an object with an attribute `endpoints`, which contains an array of objects, which each have the attribute `endpoint`, whose value is a string with the endpoint description. There is an entry for each Coordinator in the cluster. This method only works on Coordinators in cluster mode. In case of an error the `error` attribute is set to `true`. 
*
* no response value expected for this operation
* */
const _apiClusterEndpointsGET = () => new Promise(
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
* Returns an array of all configured endpoints the server is listening on. The result is a JSON array of JSON objects, each with `\"entrypoint\"` as the only attribute, and with the value being a string describing the endpoint. **Note**: retrieving the array of all endpoints is allowed in the system database only. Calling this action in any other database will make the server return an error. 
*
* no response value expected for this operation
* */
const _apiEndpointGET = () => new Promise(
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
* Returns the storage engine the server is configured to use. The response is a JSON object with the following attributes: 
*
* no response value expected for this operation
* */
const _apiEngineGET = () => new Promise(
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
* fetches all existing tasks on the server 
*
* no response value expected for this operation
* */
const _apiTasksGET = () => new Promise(
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
* Deletes the task identified by *id* on the server. 
*
* id String The id of the task to delete. 
* no response value expected for this operation
* */
const _apiTasksIdDELETE = ({ id }) => new Promise(
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
* fetches one existing task on the server specified by *id* 
*
* id String The id of the task to fetch. 
* no response value expected for this operation
* */
const _apiTasksIdGET = ({ id }) => new Promise(
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
* registers a new task with the specified id 
*
* id String The id of the task to create 
* apiTasksIdDeleteRequest ApiTasksIdDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiTasksIdPUT = ({ id, apiTasksIdDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        apiTasksIdDeleteRequest,
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
* creates a new task with a generated id 
*
* apiTasksIdDeleteRequest ApiTasksIdDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiTasksPOST = ({ apiTasksIdDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiTasksIdDeleteRequest,
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
* Returns the server name and version number. The response is a JSON object with the following attributes: 
*
* details Boolean If set to *true*, the response will contain a *details* attribute with additional information about included components and their versions. The attribute names and internals of the *details* object may vary depending on platform and ArangoDB version.  (optional)
* returns __api_version_get_200_response
* */
const _apiVersionGET = ({ details }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        details,
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
  _adminClusterRebalanceExecutePOST,
  _adminClusterRebalanceGET,
  _adminClusterRebalancePOST,
  _adminClusterRebalancePUT,
  _adminCompactPUT,
  _adminDatabaseTargetVersionGET,
  _adminEchoPOST,
  _adminExecutePOST,
  _adminLicenseGET,
  _adminLicensePUT,
  _adminMetricsGET,
  _adminMetricsV2GET,
  _adminRoutingReloadPOST,
  _adminServerAvailabilityGET,
  _adminServerEncryptionPOST,
  _adminServerIdGET,
  _adminServerJwtGET,
  _adminServerJwtPOST,
  _adminServerModeGET,
  _adminServerModePUT,
  _adminServerRoleGET,
  _adminServerTlsGET,
  _adminServerTlsPOST,
  _adminShutdownDELETE,
  _adminShutdownGET,
  _adminStatusGET,
  _adminTimeGET,
  _apiClusterEndpointsGET,
  _apiEndpointGET,
  _apiEngineGET,
  _apiTasksGET,
  _apiTasksIdDELETE,
  _apiTasksIdGET,
  _apiTasksIdPUT,
  _apiTasksPOST,
  _apiVersionGET,
};
