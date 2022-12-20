/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* The body of the request is an array consisting of selectors for documents. A selector can either be a string with a key or a string with a document identifier or an object with a `_key` attribute. This API call removes all specified documents from `collection`. If the `ignoreRevs` query parameter is `false` and the selector is an object and has a `_rev` attribute, it is a precondition that the actual revision of the removed document in the collection is the specified one. The body of the response is an array of the same length as the input array. For each input selector, the output contains a JSON object with the information about the outcome of the operation. If no error occurred, an object is built in which the attribute `_id` contains the known *document ID* of the removed document, `_key` contains the key which uniquely identifies a document in a given collection, and the attribute `_rev` contains the document revision. In case of an error, an object with the attribute `error` set to `true` and `errorCode` set to the error code is built. If the `waitForSync` parameter is not specified or set to `false`, then the collection's default `waitForSync` behavior is applied. The `waitForSync` query parameter cannot be used to disable synchronization for collections that have a default `waitForSync` value of `true`. If the query parameter `returnOld` is `true`, then the complete previous revision of the document is returned under the `old` attribute in the result. Note that if any precondition is violated or an error occurred with some of the documents, the return code is still 200 or 202, but the additional HTTP header `X-Arango-Error-Codes` is set, which contains a map of the error codes that occurred together with their multiplicities, as in: `1200:17,1205:10` which means that in 17 cases the error 1200 \"revision conflict\" and in 10 cases the error 1205 \"illegal document handle\" has happened. 
*
* collection String Collection from which documents are removed. 
* waitForSync Boolean Wait until deletion operation has been synced to disk.  (optional)
* returnOld Boolean Return additionally the complete previous revision of the changed document under the attribute `old` in the result.  (optional)
* silent Boolean If set to `true`, an empty object is returned as response if all document operations succeed. No meta-data is returned for the deleted documents. If at least one of the operations raises an error, an array with the error object(s) is returned. You can use this option to save network traffic but you cannot map any errors to the inputs of your request.  (optional)
* ignoreRevs Boolean If set to `true`, ignore any `_rev` attribute in the selectors. No revision check is performed. If set to `false` then revisions are checked. The default is `true`.  (optional)
* apiDocumentCollectionDeleteRequest2 ApiDocumentCollectionDeleteRequest2  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionDELETE = ({ collection, waitForSync, returnOld, silent, ignoreRevs, apiDocumentCollectionDeleteRequest2 }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        waitForSync,
        returnOld,
        silent,
        ignoreRevs,
        apiDocumentCollectionDeleteRequest2,
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
* If `silent` is not set to `true`, the body of the response contains a JSON object with the information about the identifier and the revision. The attribute `_id` contains the known *document ID* of the removed document, `_key` contains the key which uniquely identifies a document in a given collection, and the attribute `_rev` contains the document revision. If the `waitForSync` parameter is not specified or set to `false`, then the collection's default `waitForSync` behavior is applied. The `waitForSync` query parameter cannot be used to disable synchronization for collections that have a default `waitForSync` value of `true`. If the query parameter `returnOld` is `true`, then the complete previous revision of the document is returned under the `old` attribute in the result. 
*
* collection String Name of the `collection` in which the document is to be deleted. 
* key String The document key. 
* waitForSync Boolean Wait until deletion operation has been synced to disk.  (optional)
* returnOld Boolean Return additionally the complete previous revision of the changed document under the attribute `old` in the result.  (optional)
* silent Boolean If set to `true`, an empty object is returned as response if the document operation succeeds. No meta-data is returned for the deleted document. If the operation raises an error, an error object is returned. You can use this option to save network traffic.  (optional)
* ifMatch String You can conditionally remove a document based on a target revision id by using the `if-match` HTTP header.  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionKeyDELETE = ({ collection, key, waitForSync, returnOld, silent, ifMatch }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        key,
        waitForSync,
        returnOld,
        silent,
        ifMatch,
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
* Returns the document identified by *document-id*. The returned document contains three special attributes: *_id* containing the document identifier, *_key* containing key which uniquely identifies a document in a given collection and *_rev* containing the revision. 
*
* collection String Name of the *collection* from which the document is to be read. 
* key String The document key. 
* ifNoneMatch String If the \"If-None-Match\" header is given, then it must contain exactly one Etag. The document is returned, if it has a different revision than the given Etag. Otherwise an *HTTP 304* is returned.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is returned, if it has the same revision as the given Etag. Otherwise a *HTTP 412* is returned.  (optional)
* xArangoAllowDirtyRead Boolean Set this header to `true` to allow the Coordinator to ask any shard replica for the data, not only the shard leader. This may result in \"dirty reads\". The header is ignored if this operation is part of a Stream Transaction (`x-arango-trx-id` header). The header set when creating the transaction decides about dirty reads for the entire transaction, not the individual read operations.  (optional)
* xArangoTrxId String To make this operation a part of a Stream Transaction, set this header to the transaction ID returned by the `POST /_api/transaction/begin` call.  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionKeyGET = ({ collection, key, ifNoneMatch, ifMatch, xArangoAllowDirtyRead, xArangoTrxId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        key,
        ifNoneMatch,
        ifMatch,
        xArangoAllowDirtyRead,
        xArangoTrxId,
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
* Like *GET*, but only returns the header fields and not the body. You can use this call to get the current revision of a document or check if the document was deleted. 
*
* collection String Name of the *collection* from which the document is to be read. 
* key String The document key. 
* ifNoneMatch String If the \"If-None-Match\" header is given, then it must contain exactly one Etag. If the current document revision is not equal to the specified Etag, an *HTTP 200* response is returned. If the current document revision is identical to the specified Etag, then an *HTTP 304* is returned.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is returned, if it has the same revision as the given Etag. Otherwise a *HTTP 412* is returned.  (optional)
* xArangoAllowDirtyRead Boolean Set this header to `true` to allow the Coordinator to ask any shard replica for the data, not only the shard leader. This may result in \"dirty reads\". The header is ignored if this operation is part of a Stream Transaction (`x-arango-trx-id` header). The header set when creating the transaction decides about dirty reads for the entire transaction, not the individual read operations.  (optional)
* xArangoTrxId String To make this operation a part of a Stream Transaction, set this header to the transaction ID returned by the `POST /_api/transaction/begin` call.  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionKeyHEAD = ({ collection, key, ifNoneMatch, ifMatch, xArangoAllowDirtyRead, xArangoTrxId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        key,
        ifNoneMatch,
        ifMatch,
        xArangoAllowDirtyRead,
        xArangoTrxId,
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
* Partially updates the document identified by the *document ID*. The body of the request must contain a JSON document with the attributes to patch (the patch document). All attributes from the patch document are added to the existing document if they do not yet exist, and overwritten in the existing document if they do exist there. The value of the `_key` attribute as well as attributes used as sharding keys may not be changed. Setting an attribute value to `null` in the patch document causes a value of `null` to be saved for the attribute by default. If the `If-Match` header is specified and the revision of the document in the database is unequal to the given revision, the precondition is violated. If `If-Match` is not given and `ignoreRevs` is `false` and there is a `_rev` attribute in the body and its value does not match the revision of the document in the database, the precondition is violated. If a precondition is violated, an *HTTP 412* is returned. If the document exists and can be updated, then an *HTTP 201* or an *HTTP 202* is returned (depending on `waitForSync`, see below), the `Etag` header field contains the new revision of the document (in double quotes) and the `Location` header contains a complete URL under which the document can be queried. Cluster only: The patch document _may_ contain values for the collection's pre-defined shard keys. Values for the shard keys are treated as hints to improve performance. Should the shard keys values be incorrect ArangoDB may answer with a `not found` error Optionally, the query parameter `waitForSync` can be used to force synchronization of the updated document operation to disk even in case that the `waitForSync` flag had been disabled for the entire collection. Thus, the `waitForSync` query parameter can be used to force synchronization of just specific operations. To use this, set the `waitForSync` parameter to `true`. If the `waitForSync` parameter is not specified or set to `false`, then the collection's default `waitForSync` behavior is applied. The `waitForSync` query parameter cannot be used to disable synchronization for collections that have a default `waitForSync` value of `true`. If `silent` is not set to `true`, the body of the response contains a JSON object with the information about the identifier and the revision. The attribute `_id` contains the known *document ID* of the updated document, `_key` contains the key which uniquely identifies a document in a given collection, and the attribute `_rev` contains the new document revision. If the query parameter `returnOld` is `true`, then the complete previous revision of the document is returned under the `old` attribute in the result. If the query parameter `returnNew` is `true`, then the complete new document is returned under the `new` attribute in the result. If the document does not exist, then a *HTTP 404* is returned and the body of the response contains an error document. 
*
* collection String Name of the `collection` in which the document is to be updated. 
* key String The document key. 
* keepNull Boolean If the intention is to delete existing attributes with the patch command, the URL query parameter `keepNull` can be used with a value of `false`. This modifies the behavior of the patch command to remove any attributes from the existing document that are contained in the patch document with an attribute value of `null`.  (optional)
* mergeObjects Boolean Controls whether objects (not arrays) are merged if present in both the existing and the patch document. If set to `false`, the value in the patch document overwrites the existing document's value. If set to `true`, objects are merged. The default is `true`.  (optional)
* waitForSync Boolean Wait until document has been synced to disk.  (optional)
* ignoreRevs Boolean By default, or if this is set to `true`, the `_rev` attributes in the given document is ignored. If this is set to `false`, then the `_rev` attribute given in the body document is taken as a precondition. The document is only updated if the current revision is the one specified.  (optional)
* returnOld Boolean Return additionally the complete previous revision of the changed document under the attribute `old` in the result.  (optional)
* returnNew Boolean Return additionally the complete new document under the attribute `new` in the result.  (optional)
* silent Boolean If set to `true`, an empty object is returned as response if the document operation succeeds. No meta-data is returned for the updated document. If the operation raises an error, an error object is returned. You can use this option to save network traffic.  (optional)
* ifMatch String You can conditionally update a document based on a target revision id by using the `if-match` HTTP header.  (optional)
* apiDocumentCollectionKeyDeleteRequest1 ApiDocumentCollectionKeyDeleteRequest1  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionKeyPATCH = ({ collection, key, keepNull, mergeObjects, waitForSync, ignoreRevs, returnOld, returnNew, silent, ifMatch, apiDocumentCollectionKeyDeleteRequest1 }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        key,
        keepNull,
        mergeObjects,
        waitForSync,
        ignoreRevs,
        returnOld,
        returnNew,
        silent,
        ifMatch,
        apiDocumentCollectionKeyDeleteRequest1,
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
* Replaces the specified document with the one in the body, provided there is such a document and no precondition is violated. The value of the `_key` attribute as well as attributes used as sharding keys may not be changed. If the `If-Match` header is specified and the revision of the document in the database is unequal to the given revision, the precondition is violated. If `If-Match` is not given and `ignoreRevs` is `false` and there is a `_rev` attribute in the body and its value does not match the revision of the document in the database, the precondition is violated. If a precondition is violated, an *HTTP 412* is returned. If the document exists and can be updated, then an *HTTP 201* or an *HTTP 202* is returned (depending on `waitForSync`, see below), the `Etag` header field contains the new revision of the document and the `Location` header contains a complete URL under which the document can be queried. Cluster only: The replace documents _may_ contain values for the collection's pre-defined shard keys. Values for the shard keys are treated as hints to improve performance. Should the shard keys values be incorrect ArangoDB may answer with a *not found* error. Optionally, the query parameter `waitForSync` can be used to force synchronization of the document replacement operation to disk even in case that the `waitForSync` flag had been disabled for the entire collection. Thus, the `waitForSync` query parameter can be used to force synchronization of just specific operations. To use this, set the `waitForSync` parameter to `true`. If the `waitForSync` parameter is not specified or set to `false`, then the collection's default `waitForSync` behavior is applied. The `waitForSync` query parameter cannot be used to disable synchronization for collections that have a default `waitForSync` value of `true`. If `silent` is not set to `true`, the body of the response contains a JSON object with the information about the identifier and the revision. The attribute `_id` contains the known *document ID* of the updated document, `_key` contains the key which uniquely identifies a document in a given collection, and the attribute `_rev` contains the new document revision. If the query parameter `returnOld` is `true`, then the complete previous revision of the document is returned under the `old` attribute in the result. If the query parameter `returnNew` is `true`, then the complete new document is returned under the `new` attribute in the result. If the document does not exist, then a *HTTP 404* is returned and the body of the response contains an error document. 
*
* collection String Name of the `collection` in which the document is to be replaced. 
* key String The document key. 
* waitForSync Boolean Wait until document has been synced to disk.  (optional)
* ignoreRevs Boolean By default, or if this is set to `true`, the `_rev` attributes in the given document is ignored. If this is set to `false`, then the `_rev` attribute given in the body document is taken as a precondition. The document is only replaced if the current revision is the one specified.  (optional)
* returnOld Boolean Return additionally the complete previous revision of the changed document under the attribute `old` in the result.  (optional)
* returnNew Boolean Return additionally the complete new document under the attribute `new` in the result.  (optional)
* silent Boolean If set to `true`, an empty object is returned as response if the document operation succeeds. No meta-data is returned for the replaced document. If the operation raises an error, an error object is returned. You can use this option to save network traffic.  (optional)
* ifMatch String You can conditionally replace a document based on a target revision id by using the `if-match` HTTP header.  (optional)
* apiDocumentCollectionKeyDeleteRequest ApiDocumentCollectionKeyDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionKeyPUT = ({ collection, key, waitForSync, ignoreRevs, returnOld, returnNew, silent, ifMatch, apiDocumentCollectionKeyDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        key,
        waitForSync,
        ignoreRevs,
        returnOld,
        returnNew,
        silent,
        ifMatch,
        apiDocumentCollectionKeyDeleteRequest,
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
* Partially updates documents, the documents to update are specified by the `_key` attributes in the body objects. The body of the request must contain a JSON array of document updates with the attributes to patch (the patch documents). All attributes from the patch documents are added to the existing documents if they do not yet exist, and overwritten in the existing documents if they do exist there. The value of the `_key` attribute as well as attributes used as sharding keys may not be changed. Setting an attribute value to `null` in the patch documents causes a value of `null` to be saved for the attribute by default. If `ignoreRevs` is `false` and there is a `_rev` attribute in a document in the body and its value does not match the revision of the corresponding document in the database, the precondition is violated. Cluster only: The patch document _may_ contain values for the collection's pre-defined shard keys. Values for the shard keys are treated as hints to improve performance. Should the shard keys values be incorrect ArangoDB may answer with a *not found* error Optionally, the query parameter `waitForSync` can be used to force synchronization of the document replacement operation to disk even in case that the `waitForSync` flag had been disabled for the entire collection. Thus, the `waitForSync` query parameter can be used to force synchronization of just specific operations. To use this, set the `waitForSync` parameter to `true`. If the `waitForSync` parameter is not specified or set to `false`, then the collection's default `waitForSync` behavior is applied. The `waitForSync` query parameter cannot be used to disable synchronization for collections that have a default `waitForSync` value of `true`. The body of the response contains a JSON array of the same length as the input array with the information about the identifier and the revision of the updated documents. In each entry, the attribute `_id` contains the known *document ID* of each updated document, `_key` contains the key which uniquely identifies a document in a given collection, and the attribute `_rev` contains the new document revision. In case of an error or violated precondition, an error object with the attribute `error` set to `true` and the attribute `errorCode` set to the error code is built. If the query parameter `returnOld` is `true`, then, for each generated document, the complete previous revision of the document is returned under the `old` attribute in the result. If the query parameter `returnNew` is `true`, then, for each generated document, the complete new document is returned under the `new` attribute in the result. Note that if any precondition is violated or an error occurred with some of the documents, the return code is still 201 or 202, but the additional HTTP header `X-Arango-Error-Codes` is set, which contains a map of the error codes that occurred together with their multiplicities, as in: `1200:17,1205:10` which means that in 17 cases the error 1200 \"revision conflict\" and in 10 cases the error 1205 \"illegal document handle\" has happened. 
*
* collection String Name of the `collection` in which the documents are to be updated. 
* keepNull Boolean If the intention is to delete existing attributes with the patch command, the URL query parameter `keepNull` can be used with a value of `false`. This modifies the behavior of the patch command to remove any attributes from the existing document that are contained in the patch document with an attribute value of `null`.  (optional)
* mergeObjects Boolean Controls whether objects (not arrays) are merged if present in both the existing and the patch document. If set to `false`, the value in the patch document overwrites the existing document's value. If set to `true`, objects are merged. The default is `true`.  (optional)
* waitForSync Boolean Wait until the new documents have been synced to disk.  (optional)
* ignoreRevs Boolean By default, or if this is set to `true`, the `_rev` attributes in the given documents are ignored. If this is set to `false`, then any `_rev` attribute given in a body document is taken as a precondition. The document is only updated if the current revision is the one specified.  (optional)
* returnOld Boolean Return additionally the complete previous revision of the changed documents under the attribute `old` in the result.  (optional)
* returnNew Boolean Return additionally the complete new documents under the attribute `new` in the result.  (optional)
* silent Boolean If set to `true`, an empty object is returned as response if all document operations succeed. No meta-data is returned for the updated documents. If at least one operation raises an error, an array with the error object(s) is returned. You can use this option to save network traffic but you cannot map any errors to the inputs of your request.  (optional)
* apiDocumentCollectionDeleteRequest3 ApiDocumentCollectionDeleteRequest3  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionPATCH = ({ collection, keepNull, mergeObjects, waitForSync, ignoreRevs, returnOld, returnNew, silent, apiDocumentCollectionDeleteRequest3 }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        keepNull,
        mergeObjects,
        waitForSync,
        ignoreRevs,
        returnOld,
        returnNew,
        silent,
        apiDocumentCollectionDeleteRequest3,
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
* Creates a new document from the document given in the body, unless there is already a document with the `_key` given. If no `_key` is given, a new unique `_key` is generated automatically. Possibly given `_id` and `_rev` attributes in the body are always ignored, the URL part or the query parameter collection respectively counts. If the document was created successfully, then the `Location` header contains the path to the newly created document. The `Etag` header field contains the revision of the document. Both are only set in the single document case. If `silent` is not set to `true`, the body of the response contains a JSON object with the following attributes:   - `_id` contains the document identifier of the newly created document   - `_key` contains the document key   - `_rev` contains the document revision If the collection parameter `waitForSync` is `false`, then the call returns as soon as the document has been accepted. It does not wait until the documents have been synced to disk. Optionally, the query parameter `waitForSync` can be used to force synchronization of the document creation operation to disk even in case that the `waitForSync` flag had been disabled for the entire collection. Thus, the `waitForSync` query parameter can be used to force synchronization of just this specific operations. To use this, set the `waitForSync` parameter to `true`. If the `waitForSync` parameter is not specified or set to `false`, then the collection's default `waitForSync` behavior is applied. The `waitForSync` query parameter cannot be used to disable synchronization for collections that have a default `waitForSync` value of `true`. If the query parameter `returnNew` is `true`, then, for each generated document, the complete new document is returned under the `new` attribute in the result. 
*
* collection String Name of the `collection` in which the document is to be created. 
* collection2 String The name of the collection. This query parameter is only for backward compatibility. In ArangoDB versions < 3.0, the URL path was `/_api/document` and this query parameter was required. This combination still works, but the recommended way is to specify the collection in the URL path.  (optional)
* waitForSync Boolean Wait until document has been synced to disk.  (optional)
* returnNew Boolean Additionally return the complete new document under the attribute `new` in the result.  (optional)
* returnOld Boolean Additionally return the complete old document under the attribute `old` in the result. Only available if the overwrite option is used.  (optional)
* silent Boolean If set to `true`, an empty object is returned as response if the document operation succeeds. No meta-data is returned for the created document. If the operation raises an error, an error object is returned. You can use this option to save network traffic.  (optional)
* overwrite Boolean If set to `true`, the insert becomes a replace-insert. If a document with the same `_key` already exists, the new document is not rejected with unique constraint violation error but replaces the old document. Note that operations with `overwrite` parameter require a `_key` attribute in the request payload, therefore they can only be performed on collections sharded by `_key`.  (optional)
* overwriteMode String This option supersedes `overwrite` and offers the following modes - `\"ignore\"` if a document with the specified `_key` value exists already,   nothing is done and no write operation is carried out. The   insert operation returns success in this case. This mode does not   support returning the old document version using `RETURN OLD`. When using   `RETURN NEW`, `null` is returned in case the document already existed. - `\"replace\"` if a document with the specified `_key` value exists already,   it is overwritten with the specified document value. This mode is   also used when no overwrite mode is specified but the `overwrite`   flag is set to `true`. - `\"update\"` if a document with the specified `_key` value exists already,   it is patched (partially updated) with the specified document value.   The overwrite mode can be further controlled via the `keepNull` and   `mergeObjects` parameters. - `\"conflict\"` if a document with the specified `_key` value exists already,   return a unique constraint violation error so that the insert operation   fails. This is also the default behavior in case the overwrite mode is   not set, and the `overwrite` flag is `false` or not set either.  (optional)
* keepNull Boolean If the intention is to delete existing attributes with the update-insert command, the URL query parameter `keepNull` can be used with a value of `false`. This modifies the behavior of the patch command to remove any attributes from the existing document that are contained in the patch document with an attribute value of `null`. This option controls the update-insert behavior only.  (optional)
* mergeObjects Boolean Controls whether objects (not arrays) are merged if present in both, the existing and the update-insert document. If set to `false`, the value in the patch document overwrites the existing document's value. If set to `true`, objects are merged. The default is `true`. This option controls the update-insert behavior only.  (optional)
* apiDocumentCollectionDeleteRequest1 ApiDocumentCollectionDeleteRequest1  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionPOST = ({ collection, collection2, waitForSync, returnNew, returnOld, silent, overwrite, overwriteMode, keepNull, mergeObjects, apiDocumentCollectionDeleteRequest1 }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        collection2,
        waitForSync,
        returnNew,
        returnOld,
        silent,
        overwrite,
        overwriteMode,
        keepNull,
        mergeObjects,
        apiDocumentCollectionDeleteRequest1,
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
* Replaces multiple documents in the specified collection with the ones in the body, the replaced documents are specified by the `_key` attributes in the body documents. The value of the `_key` attribute as well as attributes used as sharding keys may not be changed. If `ignoreRevs` is `false` and there is a `_rev` attribute in a document in the body and its value does not match the revision of the corresponding document in the database, the precondition is violated. Cluster only: The replace documents _may_ contain values for the collection's pre-defined shard keys. Values for the shard keys are treated as hints to improve performance. Should the shard keys values be incorrect ArangoDB may answer with a `not found` error. Optionally, the query parameter `waitForSync` can be used to force synchronization of the document replacement operation to disk even in case that the `waitForSync` flag had been disabled for the entire collection. Thus, the `waitForSync` query parameter can be used to force synchronization of just specific operations. To use this, set the `waitForSync` parameter to `true`. If the `waitForSync` parameter is not specified or set to `false`, then the collection's default `waitForSync` behavior is applied. The `waitForSync` query parameter cannot be used to disable synchronization for collections that have a default `waitForSync` value of `true`. The body of the response contains a JSON array of the same length as the input array with the information about the identifier and the revision of the replaced documents. In each entry, the attribute `_id` contains the known `document-id` of each updated document, `_key` contains the key which uniquely identifies a document in a given collection, and the attribute `_rev` contains the new document revision. In case of an error or violated precondition, an error object with the attribute `error` set to `true` and the attribute `errorCode` set to the error code is built. If the query parameter `returnOld` is `true`, then, for each generated document, the complete previous revision of the document is returned under the `old` attribute in the result. If the query parameter `returnNew` is `true`, then, for each generated document, the complete new document is returned under the `new` attribute in the result. Note that if any precondition is violated or an error occurred with some of the documents, the return code is still 201 or 202, but the additional HTTP header `X-Arango-Error-Codes` is set, which contains a map of the error codes that occurred together with their multiplicities, as in: `1200:17,1205:10` which means that in 17 cases the error 1200 \"revision conflict\" and in 10 cases the error 1205 \"illegal document handle\" has happened. 
*
* collection String This URL parameter is the name of the collection in which the documents are replaced. 
* waitForSync Boolean Wait until the new documents have been synced to disk.  (optional)
* ignoreRevs Boolean By default, or if this is set to `true`, the `_rev` attributes in the given documents are ignored. If this is set to `false`, then any `_rev` attribute given in a body document is taken as a precondition. The document is only replaced if the current revision is the one specified.  (optional)
* returnOld Boolean Return additionally the complete previous revision of the changed documents under the attribute `old` in the result.  (optional)
* returnNew Boolean Return additionally the complete new documents under the attribute `new` in the result.  (optional)
* silent Boolean If set to `true`, an empty object is returned as response if all document operations succeed. No meta-data is returned for the replaced documents. If at least one operation raises an error, an array with the error object(s) is returned. You can use this option to save network traffic but you cannot map any errors to the inputs of your request.  (optional)
* apiDocumentCollectionDeleteRequest ApiDocumentCollectionDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionPUT = ({ collection, waitForSync, ignoreRevs, returnOld, returnNew, silent, apiDocumentCollectionDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        waitForSync,
        ignoreRevs,
        returnOld,
        returnNew,
        silent,
        apiDocumentCollectionDeleteRequest,
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
* Returns the documents identified by their *_key* in the body objects. The body of the request _must_ contain a JSON array of either strings (the *_key* values to lookup) or search documents. A search document _must_ contain at least a value for the *_key* field. A value for `_rev` _may_ be specified to verify whether the document has the same revision value, unless _ignoreRevs_ is set to false. Cluster only: The search document _may_ contain values for the collection's pre-defined shard keys. Values for the shard keys are treated as hints to improve performance. Should the shard keys values be incorrect ArangoDB may answer with a *not found* error. The returned array of documents contain three special attributes: *_id* containing the document identifier, *_key* containing key which uniquely identifies a document in a given collection and *_rev* containing the revision. 
*
* collection String Name of the *collection* from which the documents are to be read. 
* onlyget Boolean This parameter is required to be **true**, otherwise a replace operation is executed! 
* ignoreRevs String Should the value be *true* (the default) If a search document contains a value for the *_rev* field, then the document is only returned if it has the same revision value. Otherwise a precondition failed error is returned.  (optional)
* xArangoAllowDirtyRead Boolean Set this header to `true` to allow the Coordinator to ask any shard replica for the data, not only the shard leader. This may result in \"dirty reads\". The header is ignored if this operation is part of a Stream Transaction (`x-arango-trx-id` header). The header set when creating the transaction decides about dirty reads for the entire transaction, not the individual read operations.  (optional)
* xArangoTrxId String To make this operation a part of a Stream Transaction, set this header to the transaction ID returned by the `POST /_api/transaction/begin` call.  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectiongetPUT = ({ collection, onlyget, ignoreRevs, xArangoAllowDirtyRead, xArangoTrxId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        onlyget,
        ignoreRevs,
        xArangoAllowDirtyRead,
        xArangoTrxId,
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
* Creates new documents from the documents given in the body, unless there is already a document with the `_key` given. If no `_key` is given, a new unique `_key` is generated automatically. The result body contains a JSON array of the same length as the input array, and each entry contains the result of the operation for the corresponding input. In case of an error the entry is a document with attributes `error` set to `true` and errorCode set to the error code that has happened. Possibly given `_id` and `_rev` attributes in the body are always ignored, the URL part or the query parameter collection respectively counts. If `silent` is not set to `true`, the body of the response contains an array of JSON objects with the following attributes:   - `_id` contains the document identifier of the newly created document   - `_key` contains the document key   - `_rev` contains the document revision If the collection parameter `waitForSync` is `false`, then the call returns as soon as the documents have been accepted. It does not wait until the documents have been synced to disk. Optionally, the query parameter `waitForSync` can be used to force synchronization of the document creation operation to disk even in case that the `waitForSync` flag had been disabled for the entire collection. Thus, the `waitForSync` query parameter can be used to force synchronization of just this specific operations. To use this, set the `waitForSync` parameter to `true`. If the `waitForSync` parameter is not specified or set to `false`, then the collection's default `waitForSync` behavior is applied. The `waitForSync` query parameter cannot be used to disable synchronization for collections that have a default `waitForSync` value of `true`. If the query parameter `returnNew` is `true`, then, for each generated document, the complete new document is returned under the `new` attribute in the result. Should an error have occurred with some of the documents the additional HTTP header `X-Arango-Error-Codes` is set, which contains a map of the error codes that occurred together with their multiplicities, as in: `1205:10,1210:17` which means that in 10 cases the error 1205 \"illegal document handle\" and in 17 cases the error 1210 \"unique constraint violated\" has happened. 
*
* collection String Name of the `collection` in which the documents are to be created. 
* collection2 String The name of the collection. This is only for backward compatibility. In ArangoDB versions < 3.0, the URL path was `/_api/document` and this query parameter was required. This combination still works, but the recommended way is to specify the collection in the URL path.  (optional)
* waitForSync Boolean Wait until document has been synced to disk.  (optional)
* returnNew Boolean Additionally return the complete new document under the attribute `new` in the result.  (optional)
* returnOld Boolean Additionally return the complete old document under the attribute `old` in the result. Only available if the overwrite option is used.  (optional)
* silent Boolean If set to `true`, an empty object is returned as response if all document operations succeed. No meta-data is returned for the created documents. If any of the operations raises an error, an array with the error object(s) is returned. You can use this option to save network traffic but you cannot map any errors to the inputs of your request.  (optional)
* overwrite Boolean If set to `true`, the insert becomes a replace-insert. If a document with the same `_key` already exists, the new document is not rejected with a unique constraint violation error but replaces the old document. Note that operations with `overwrite` parameter require a `_key` attribute in the request payload, therefore they can only be performed on collections sharded by `_key`.  (optional)
* overwriteMode String This option supersedes `overwrite` and offers the following modes - `\"ignore\"` if a document with the specified `_key` value exists already,   nothing is done and no write operation is carried out. The   insert operation returns success in this case. This mode does not   support returning the old document version using `RETURN OLD`. When using   `RETURN NEW`, `null` is returned in case the document already existed. - `\"replace\"` if a document with the specified `_key` value exists already,   it is overwritten with the specified document value. This mode is   also used when no overwrite mode is specified but the `overwrite`   flag is set to `true`. - `\"update\"` if a document with the specified `_key` value exists already,   it is patched (partially updated) with the specified document value.   The overwrite mode can be further controlled via the `keepNull` and   `mergeObjects` parameters. - `\"conflict\"` if a document with the specified `_key` value exists already,   return a unique constraint violation error so that the insert operation   fails. This is also the default behavior in case the overwrite mode is   not set, and the `overwrite` flag is `false` or not set either.  (optional)
* keepNull Boolean If the intention is to delete existing attributes with the update-insert command, the URL query parameter `keepNull` can be used with a value of `false`. This modifies the behavior of the patch command to remove any attributes from the existing document that are contained in the patch document with an attribute value of `null`. This option controls the update-insert behavior only.  (optional)
* mergeObjects Boolean Controls whether objects (not arrays) are merged if present in both, the existing and the update-insert document. If set to `false`, the value in the patch document overwrites the existing document's value. If set to `true`, objects are merged. The default is `true`. This option controls the update-insert behavior only.  (optional)
* apiDocumentCollectionMultiplePostRequest ApiDocumentCollectionMultiplePostRequest  (optional)
* no response value expected for this operation
* */
const _apiDocumentCollectionmultiplePOST = ({ collection, collection2, waitForSync, returnNew, returnOld, silent, overwrite, overwriteMode, keepNull, mergeObjects, apiDocumentCollectionMultiplePostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        collection2,
        waitForSync,
        returnNew,
        returnOld,
        silent,
        overwrite,
        overwriteMode,
        keepNull,
        mergeObjects,
        apiDocumentCollectionMultiplePostRequest,
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
  _apiDocumentCollectionDELETE,
  _apiDocumentCollectionKeyDELETE,
  _apiDocumentCollectionKeyGET,
  _apiDocumentCollectionKeyHEAD,
  _apiDocumentCollectionKeyPATCH,
  _apiDocumentCollectionKeyPUT,
  _apiDocumentCollectionPATCH,
  _apiDocumentCollectionPOST,
  _apiDocumentCollectionPUT,
  _apiDocumentCollectiongetPUT,
  _apiDocumentCollectionmultiplePOST,
};
