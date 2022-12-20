/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Queries the health of the cluster for monitoring purposes. The response is a JSON object, containing the standard `code`, `error`, `errorNum`, and `errorMessage` fields as appropriate. The endpoint-specific fields are as follows: - `ClusterId`: A UUID string identifying the cluster - `Health`: An object containing a descriptive sub-object for each node in the cluster.   - `<nodeID>`: Each entry in `Health` will be keyed by the node ID and contain the following attributes:     - `Endpoint`: A string representing the network endpoint of the server.     - `Role`: The role the server plays. Possible values are `\"AGENT\"`, `\"COORDINATOR\"`, and `\"DBSERVER\"`.     - `CanBeDeleted`: Boolean representing whether the node can safely be removed from the cluster.     - `Version`: Version String of ArangoDB used by that node.     - `Engine`: Storage Engine used by that node.     - `Status`: A string indicating the health of the node as assessed by the supervision (Agency). This should be considered primary source of truth for Coordinator and DB-Servers node health. If the node is responding normally to requests, it is `\"GOOD\"`. If it has missed one heartbeat, it is `\"BAD\"`. If it has been declared failed by the supervision, which occurs after missing heartbeats for about 15 seconds, it will be marked `\"FAILED\"`.     Additionally it will also have the following attributes for:     **Coordinators** and **DB-Servers**     - `SyncStatus`: The last sync status reported by the node. This value is primarily used to determine the value of `Status`. Possible values include `\"UNKNOWN\"`, `\"UNDEFINED\"`, `\"STARTUP\"`, `\"STOPPING\"`, `\"STOPPED\"`, `\"SERVING\"`, `\"SHUTDOWN\"`.     - `LastAckedTime`: ISO 8601 timestamp specifying the last heartbeat received.     - `ShortName`: A string representing the shortname of the server, e.g. `\"Coordinator0001\"`.     - `Timestamp`: ISO 8601 timestamp specifying the last heartbeat received. (deprecated)     - `Host`: An optional string, specifying the host machine if known.     **Coordinators** only     - `AdvertisedEndpoint`: A string representing the advertised endpoint, if set. (e.g. external IP address or load balancer, optional)     **Agents**     - `Leader`: ID of the Agent this node regards as leader.     - `Leading`: Whether this Agent is the leader (true) or not (false).     - `LastAckedTime`: Time since last `acked` in seconds. 
*
* no response value expected for this operation
* */
const _adminClusterHealthGET = () => new Promise(
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
* Check whether the specified DB-Server is in maintenance mode and until when. 
*
* dBServerID String The ID of a DB-Server. 
* no response value expected for this operation
* */
const _adminClusterMaintenanceDBServerIDGET = ({ dBServerID }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        dBServerID,
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
* For rolling upgrades or rolling restarts, DB-Servers can be put into maintenance mode, so that no attempts are made to re-distribute the data in a cluster for such planned events. DB-Servers in maintenance mode are not considered viable failover targets because they are likely restarted soon. 
*
* dBServerID String The ID of a DB-Server. 
* adminClusterMaintenanceDBServerIDGetRequest AdminClusterMaintenanceDBServerIDGetRequest  (optional)
* no response value expected for this operation
* */
const _adminClusterMaintenanceDBServerIDPUT = ({ dBServerID, adminClusterMaintenanceDBServerIDGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        dBServerID,
        adminClusterMaintenanceDBServerIDGetRequest,
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
*  This API allows to temporarily enable the supervision maintenance mode. Please be aware that no automatic failovers of any kind will take place while the maintenance mode is enabled. The cluster supervision reactivates itself automatically at some point after disabling it.  To enable the maintenance mode the request body must contain the string `\"on\"` (Please note it _must_ be lowercase as well as include the quotes). This will enable the maintenance mode for 60 minutes, i.e. the supervision maintenance will reactivate itself after 60 minutes.  Since ArangoDB 3.8.3 it is possible to enable the maintenance mode for a different  duration than 60 minutes, it is possible to send the desired duration value (in seconds)  as a string in the request body. For example, sending `\"7200\"` (including the quotes) will enable the maintenance mode for 7200 seconds, i.e. 2 hours.  To disable the maintenance mode the request body must contain the string `\"off\"`  (Please note it _must_ be lowercase as well as include the quotes).  
*
* no response value expected for this operation
* */
const _adminClusterMaintenancePUT = () => new Promise(
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
* Queries the statistics of the given DB-Server 
*
* dBserver String 
* no response value expected for this operation
* */
const _adminClusterStatisticsGET = ({ dBserver }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        dBserver,
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
  _adminClusterHealthGET,
  _adminClusterMaintenanceDBServerIDGET,
  _adminClusterMaintenanceDBServerIDPUT,
  _adminClusterMaintenancePUT,
  _adminClusterStatisticsGET,
};
