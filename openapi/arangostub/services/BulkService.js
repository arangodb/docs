/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Executes a batch request. A batch request can contain any number of other requests that can be sent to ArangoDB in isolation. The benefit of using batch requests is that batching requests requires less client/server roundtrips than when sending isolated requests. All parts of a batch request are executed serially on the server. The server will return the results of all parts in a single response when all parts are finished. Technically, a batch request is a multipart HTTP request, with content-type `multipart/form-data`. A batch request consists of an envelope and the individual batch part actions. Batch part actions are \"regular\" HTTP requests, including full header and an optional body. Multiple batch parts are separated by a boundary identifier. The boundary identifier is declared in the batch envelope. The MIME content-type for each individual batch part must be `application/x-arango-batchpart`. Please note that when constructing the individual batch parts, you must use CRLF (`\\r\\n`) as the line terminator as in regular HTTP messages. The response sent by the server will be an `HTTP 200` response, with an optional error summary header `x-arango-errors`. This header contains the number of batch part operations that failed with an HTTP error code of at least 400. This header is only present in the response if the number of errors is greater than zero. The response sent by the server is a multipart response, too. It contains the individual HTTP responses for all batch parts, including the full HTTP result header (with status code and other potential headers) and an optional result body. The individual batch parts in the result are seperated using the same boundary value as specified in the request. The order of batch parts in the response will be the same as in the original client request. Client can additionally use the `Content-Id` MIME header in a batch part to define an individual id for each batch part. The server will return this id is the batch part responses, too. 
*
* apiBatchPostRequest ApiBatchPostRequest  (optional)
* no response value expected for this operation
* */
const _apiBatchPOST = ({ apiBatchPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiBatchPostRequest,
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
* Creates documents in the collection identified by `collection-name`. The first line of the request body must contain a JSON-encoded array of attribute names. All following lines in the request body must contain JSON-encoded arrays of attribute values. Each line is interpreted as a separate document, and the values specified will be mapped to the array of attribute names specified in the first header line. The response is a JSON object with the following attributes: - `created`: number of documents imported. - `errors`: number of documents that were not imported due to an error. - `empty`: number of empty lines found in the input (will only contain a   value greater zero for types `documents` or `auto`). - `updated`: number of updated/replaced documents (in case `onDuplicate`   was set to either `update` or `replace`). - `ignored`: number of failed but ignored insert operations (in case   `onDuplicate` was set to `ignore`). - `details`: if query parameter `details` is set to true, the result will   contain a `details` attribute which is an array with more detailed   information about which documents could not be inserted. 
*
* collection String The collection name. 
* fromPrefix String An optional prefix for the values in `_from` attributes. If specified, the value is automatically prepended to each `_from` input value. This allows specifying just the keys for `_from`.  (optional)
* toPrefix String An optional prefix for the values in `_to` attributes. If specified, the value is automatically prepended to each `_to` input value. This allows specifying just the keys for `_to`.  (optional)
* overwrite Boolean If this parameter has a value of `true` or `yes`, then all data in the collection will be removed prior to the import. Note that any existing index definitions will be preserved.  (optional)
* waitForSync Boolean Wait until documents have been synced to disk before returning.  (optional)
* onDuplicate String Controls what action is carried out in case of a unique key constraint violation. Possible values are - `error` this will not import the current document because of the unique   key constraint violation. This is the default setting. - `update` this will update an existing document in the database with the   data specified in the request. Attributes of the existing document that   are not present in the request will be preserved. - `replace` this will replace an existing document in the database with the   data specified in the request. - `ignore` this will not update an existing document and simply ignore the   error caused by the unique key constraint violation. Note that `update`, `replace` and `ignore` will only work when the import document in the request contains the `_key` attribute. `update` and `replace` may also fail because of secondary unique key constraint violations.  (optional)
* complete Boolean If set to `true` or `yes`, it will make the whole import fail if any error occurs. Otherwise the import will continue even if some documents cannot be imported.  (optional)
* details Boolean If set to `true` or `yes`, the result will include an attribute `details` with details about documents that could not be imported.  (optional)
* apiImportDocumentPostRequest ApiImportDocumentPostRequest  (optional)
* no response value expected for this operation
* */
const _apiImportdocumentPOST = ({ collection, fromPrefix, toPrefix, overwrite, waitForSync, onDuplicate, complete, details, apiImportDocumentPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        fromPrefix,
        toPrefix,
        overwrite,
        waitForSync,
        onDuplicate,
        complete,
        details,
        apiImportDocumentPostRequest,
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
* Creates documents in the collection identified by `collection-name`. The JSON representations of the documents must be passed as the body of the POST request. The request body can either consist of multiple lines, with each line being a single stand-alone JSON object, or a singe JSON array with sub-objects. The response is a JSON object with the following attributes: - `created`: number of documents imported. - `errors`: number of documents that were not imported due to an error. - `empty`: number of empty lines found in the input (will only contain a   value greater zero for types `documents` or `auto`). - `updated`: number of updated/replaced documents (in case `onDuplicate`   was set to either `update` or `replace`). - `ignored`: number of failed but ignored insert operations (in case   `onDuplicate` was set to `ignore`). - `details`: if query parameter `details` is set to true, the result will   contain a `details` attribute which is an array with more detailed   information about which documents could not be inserted. 
*
* type String Determines how the body of the request will be interpreted. `type` can have the following values - `documents` when this type is used, each line in the request body is   expected to be an individual JSON-encoded document. Multiple JSON objects   in the request body need to be separated by newlines. - `list` when this type is used, the request body must contain a single   JSON-encoded array of individual objects to import. - `auto` if set, this will automatically determine the body type (either   `documents` or `list`). 
* collection String The collection name. 
* fromPrefix String An optional prefix for the values in `_from` attributes. If specified, the value is automatically prepended to each `_from` input value. This allows specifying just the keys for `_from`.  (optional)
* toPrefix String An optional prefix for the values in `_to` attributes. If specified, the value is automatically prepended to each `_to` input value. This allows specifying just the keys for `_to`.  (optional)
* overwrite Boolean If this parameter has a value of `true` or `yes`, then all data in the collection will be removed prior to the import. Note that any existing index definitions will be preserved.  (optional)
* waitForSync Boolean Wait until documents have been synced to disk before returning.  (optional)
* onDuplicate String Controls what action is carried out in case of a unique key constraint violation. Possible values are - `error` this will not import the current document because of the unique   key constraint violation. This is the default setting. - `update` this will update an existing document in the database with the   data specified in the request. Attributes of the existing document that   are not present in the request will be preserved. - `replace` this will replace an existing document in the database with the   data specified in the request. - `ignore` this will not update an existing document and simply ignore the   error caused by a unique key constraint violation. Note that that `update`, `replace` and `ignore` will only work when the import document in the request contains the `_key` attribute. `update` and `replace` may also fail because of secondary unique key constraint violations.  (optional)
* complete Boolean If set to `true` or `yes`, it will make the whole import fail if any error occurs. Otherwise the import will continue even if some documents cannot be imported.  (optional)
* details Boolean If set to `true` or `yes`, the result will include an attribute `details` with details about documents that could not be imported.  (optional)
* apiImportJsonPostRequest ApiImportJsonPostRequest  (optional)
* no response value expected for this operation
* */
const _apiImportjsonPOST = ({ type, collection, fromPrefix, toPrefix, overwrite, waitForSync, onDuplicate, complete, details, apiImportJsonPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        type,
        collection,
        fromPrefix,
        toPrefix,
        overwrite,
        waitForSync,
        onDuplicate,
        complete,
        details,
        apiImportJsonPostRequest,
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
  _apiBatchPOST,
  _apiImportdocumentPOST,
  _apiImportjsonPOST,
};
