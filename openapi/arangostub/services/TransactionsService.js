/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* The transaction description must be passed in the body of the POST request. If the transaction can be started on the server, *HTTP 201* will be returned. For successfully started transactions, the returned JSON object has the following properties: - *error*: boolean flag to indicate if an error occurred (*false*   in this case) - *code*: the HTTP status code - *result*: result containing     - *id*: the identifier of the transaction     - *status*: containing the string 'running' If the transaction specification is either missing or malformed, the server will respond with *HTTP 400* or *HTTP 404*. The body of the response will then contain a JSON object with additional error details. The object has the following attributes: - *error*: boolean flag to indicate that an error occurred (*true* in this case) - *code*: the HTTP status code - *errorNum*: the server error number - *errorMessage*: a descriptive error message 
*
* xArangoAllowDirtyRead Boolean Set this header to `true` to allow the Coordinator to ask any shard replica for the data, not only the shard leader. This may result in \"dirty reads\". This header decides about dirty reads for the entire transaction. Individual read operations, that are performed as part of the transaction, cannot override it.  (optional)
* apiTransactionBeginPostRequest ApiTransactionBeginPostRequest  (optional)
* no response value expected for this operation
* */
const _apiTransactionBeginPOST = ({ xArangoAllowDirtyRead, apiTransactionBeginPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        xArangoAllowDirtyRead,
        apiTransactionBeginPostRequest,
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
* The result is an object with the attribute *transactions*, which contains an array of transactions. In a cluster the array will contain the transactions from all Coordinators. Each array entry contains an object with the following attributes: - *id*: the transaction's id - *state*: the transaction's status 
*
* no response value expected for this operation
* */
const _apiTransactionGET = () => new Promise(
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
* The transaction description must be passed in the body of the POST request. If the transaction is fully executed and committed on the server, *HTTP 200* will be returned. Additionally, the return value of the code defined in *action* will be returned in the *result* attribute. For successfully committed transactions, the returned JSON object has the following properties: - *error*: boolean flag to indicate if an error occurred (*false*   in this case) - *code*: the HTTP status code - *result*: the return value of the transaction If the transaction specification is either missing or malformed, the server will respond with *HTTP 400*. The body of the response will then contain a JSON object with additional error details. The object has the following attributes: - *error*: boolean flag to indicate that an error occurred (*true* in this case) - *code*: the HTTP status code - *errorNum*: the server error number - *errorMessage*: a descriptive error message If a transaction fails to commit, either by an exception thrown in the *action* code, or by an internal error, the server will respond with an error. Any other errors will be returned with any of the return codes *HTTP 400*, *HTTP 409*, or *HTTP 500*. 
*
* apiTransactionGetRequest ApiTransactionGetRequest  (optional)
* no response value expected for this operation
* */
const _apiTransactionPOST = ({ apiTransactionGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiTransactionGetRequest,
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
* Abort a running server-side transaction. Aborting is an idempotent operation. It is not an error to abort a transaction more than once. If the transaction can be aborted, *HTTP 200* will be returned. The returned JSON object has the following properties: - *error*: boolean flag to indicate if an error occurred (*false*   in this case) - *code*: the HTTP status code - *result*: result containing     - *id*: the identifier of the transaction     - *status*: containing the string 'aborted' If the transaction cannot be found, aborting is not allowed or the transaction was already committed, the server will respond with *HTTP 400*, *HTTP 404* or *HTTP 409*. The body of the response will then contain a JSON object with additional error details. The object has the following attributes: - *error*: boolean flag to indicate that an error occurred (*true* in this case) - *code*: the HTTP status code - *errorNum*: the server error number - *errorMessage*: a descriptive error message 
*
* transactionId String The transaction identifier, 
* no response value expected for this operation
* */
const _apiTransactionTransactionIdDELETE = ({ transactionId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        transactionId,
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
* The result is an object describing the status of the transaction. It has at least the following attributes: - *id*: the identifier of the transaction - *status*: the status of the transaction. One of \"running\", \"committed\" or \"aborted\". 
*
* transactionId String The transaction identifier. 
* no response value expected for this operation
* */
const _apiTransactionTransactionIdGET = ({ transactionId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        transactionId,
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
* Commit a running server-side transaction. Committing is an idempotent operation. It is not an error to commit a transaction more than once. If the transaction can be committed, *HTTP 200* will be returned. The returned JSON object has the following properties: - *error*: boolean flag to indicate if an error occurred (*false*   in this case) - *code*: the HTTP status code - *result*: result containing     - *id*: the identifier of the transaction     - *status*: containing the string 'committed' If the transaction cannot be found, committing is not allowed or the transaction was aborted, the server will respond with *HTTP 400*, *HTTP 404* or *HTTP 409*. The body of the response will then contain a JSON object with additional error details. The object has the following attributes: - *error*: boolean flag to indicate that an error occurred (*true* in this case) - *code*: the HTTP status code - *errorNum*: the server error number - *errorMessage*: a descriptive error message 
*
* transactionId String The transaction identifier, 
* no response value expected for this operation
* */
const _apiTransactionTransactionIdPUT = ({ transactionId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        transactionId,
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
  _apiTransactionBeginPOST,
  _apiTransactionGET,
  _apiTransactionPOST,
  _apiTransactionTransactionIdDELETE,
  _apiTransactionTransactionIdGET,
  _apiTransactionTransactionIdPUT,
};
