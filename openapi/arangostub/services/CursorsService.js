/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Deletes the cursor and frees the resources associated with it. The cursor will automatically be destroyed on the server when the client has retrieved all documents from it. The client can also explicitly destroy the cursor at any earlier time using an HTTP DELETE request. The cursor id must be included as part of the URL. Note: the server will also destroy abandoned cursors automatically after a certain server-controlled timeout to avoid resource leakage. 
*
* cursorIdentifier String The id of the cursor 
* no response value expected for this operation
* */
const _apiCursorCursorIdentifierDELETE = ({ cursorIdentifier }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        cursorIdentifier,
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
* If the cursor is still alive, returns an object with the following attributes: - *id*: a *cursor-identifier* - *result*: a list of documents for the current batch - *hasMore*: *false* if this was the last batch - *count*: if present the total number of elements - *code*: an HTTP status code - *error*: a boolean flag to indicate whether an error occurred - *errorNum*: a server error number (if *error* is *true*) - *errorMessage*: a descriptive error message (if *error* is *true*) - *extra*: an object with additional information about the query result, with   the nested objects *stats* and *warnings*. Only delivered as part of the last   batch in case of a cursor with the *stream* option enabled. Note that even if *hasMore* returns *true*, the next call might still return no documents. If, however, *hasMore* is *false*, then the cursor is exhausted.  Once the *hasMore* attribute has a value of *false*, the client can stop. 
*
* cursorIdentifier String The name of the cursor 
* no response value expected for this operation
* */
const _apiCursorCursorIdentifierPOST = ({ cursorIdentifier }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        cursorIdentifier,
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
* If the cursor is still alive, returns an object with the following attributes: - *id*: a *cursor-identifier* - *result*: a list of documents for the current batch - *hasMore*: *false* if this was the last batch - *count*: if present the total number of elements - *code*: an HTTP status code - *error*: a boolean flag to indicate whether an error occurred - *errorNum*: a server error number (if *error* is *true*) - *errorMessage*: a descriptive error message (if *error* is *true*) - *extra*: an object with additional information about the query result, with   the nested objects *stats* and *warnings*. Only delivered as part of the last   batch in case of a cursor with the *stream* option enabled. Note that even if *hasMore* returns *true*, the next call might still return no documents. If, however, *hasMore* is *false*, then the cursor is exhausted.  Once the *hasMore* attribute has a value of *false*, the client can stop. 
*
* cursorIdentifier String The name of the cursor 
* no response value expected for this operation
* */
const _apiCursorCursorIdentifierPUT = ({ cursorIdentifier }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        cursorIdentifier,
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
* The query details include the query string plus optional query options and bind parameters. These values need to be passed in a JSON representation in the body of the POST request. 
*
* xArangoAllowDirtyRead Boolean Set this header to `true` to allow the Coordinator to ask any shard replica for the data, not only the shard leader. This may result in \"dirty reads\". The header is ignored if this operation is part of a Stream Transaction (`x-arango-trx-id` header). The header set when creating the transaction decides about dirty reads for the entire transaction, not the individual read operations.  (optional)
* xArangoTrxId String To make this operation a part of a Stream Transaction, set this header to the transaction ID returned by the `POST /_api/transaction/begin` call.  (optional)
* apiCursorPostRequest ApiCursorPostRequest  (optional)
* no response value expected for this operation
* */
const _apiCursorPOST = ({ xArangoAllowDirtyRead, xArangoTrxId, apiCursorPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        xArangoAllowDirtyRead,
        xArangoTrxId,
        apiCursorPostRequest,
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
  _apiCursorCursorIdentifierDELETE,
  _apiCursorCursorIdentifierPOST,
  _apiCursorCursorIdentifierPUT,
  _apiCursorPOST,
};
