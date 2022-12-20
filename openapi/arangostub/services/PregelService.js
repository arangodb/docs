/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Returns a list of currently running and recently finished Pregel jobs without retrieving their results. 
*
* no response value expected for this operation
* */
const _apiControlPregelGET = () => new Promise(
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
* Cancel an execution which is still running, and discard any intermediate results. This immediately frees all memory taken up by the execution, and makes you lose all intermediary data. You might get inconsistent results if you requested to store the results and then cancel an execution when it is already in its `\"storing\"` state (or `\"done\"` state in versions prior to 3.7.1). The data is written multi-threaded into all collection shards at once. This means there are multiple transactions simultaneously. A transaction might already be committed when you cancel the execution job. Therefore, you might see some updated documents, while other documents have no or stale results from a previous execution. 
*
* id BigDecimal Pregel execution identifier. 
* no response value expected for this operation
* */
const _apiControlPregelIdDELETE = ({ id }) => new Promise(
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
* Returns the current state of the execution, the current global superstep, the runtime, the global aggregator values as well as the number of sent and received messages. 
*
* id BigDecimal Pregel execution identifier. 
* no response value expected for this operation
* */
const _apiControlPregelIdGET = ({ id }) => new Promise(
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
* To start an execution you need to specify the algorithm name and a named graph (SmartGraph in cluster). Alternatively you can specify the vertex and edge collections. Additionally you can specify custom parameters which vary for each algorithm, see [Pregel - Available Algorithms](https://www.arangodb.com/docs/stable/graphs-pregel.html#available-algorithms). 
*
* apiControlPregelGetRequest ApiControlPregelGetRequest  (optional)
* no response value expected for this operation
* */
const _apiControlPregelPOST = ({ apiControlPregelGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiControlPregelGetRequest,
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
  _apiControlPregelGET,
  _apiControlPregelIdDELETE,
  _apiControlPregelIdGET,
  _apiControlPregelPOST,
};
