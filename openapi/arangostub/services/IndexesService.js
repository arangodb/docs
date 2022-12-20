/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Returns an object with an attribute *indexes* containing an array of all index descriptions for the given collection. The same information is also available in the *identifiers* as an object with the index handles as keys. 
*
* collection String The collection name. 
* withStats Boolean Whether to include figures and estimates in the result.  (optional)
* withHidden Boolean Whether to include hidden indexes in the result.  (optional)
* no response value expected for this operation
* */
const _apiIndexGET = ({ collection, withStats, withHidden }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        withStats,
        withHidden,
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
* Deletes an index with *index-id*. 
*
* indexId String The index id. 
* no response value expected for this operation
* */
const _apiIndexIndexIdDELETE = ({ indexId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        indexId,
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
* The result is an object describing the index. It has at least the following attributes: - *id*: the identifier of the index - *type*: the index type All other attributes are type-dependent. For example, some indexes provide *unique* or *sparse* flags, whereas others don't. Some indexes also provide a selectivity estimate in the *selectivityEstimate* attribute of the result. 
*
* indexId String The index identifier. 
* no response value expected for this operation
* */
const _apiIndexIndexIdGET = ({ indexId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        indexId,
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
* Creates a fulltext index for the collection *collection-name*, if it does not already exist. The call expects an object containing the index details. 
*
* collection String The collection name. 
* apiIndexFulltextPostRequest ApiIndexFulltextPostRequest  (optional)
* no response value expected for this operation
* */
const _apiIndexfulltextPOST = ({ collection, apiIndexFulltextPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        apiIndexFulltextPostRequest,
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
* Creates a new index in the collection `collection`. Expects an object containing the index details. The type of the index to be created must specified in the **type** attribute of the index details. Depending on the index type, additional other attributes may need to specified in the request in order to create the index. Indexes require the to be indexed attribute(s) in the **fields** attribute of the index details. Depending on the index type, a single attribute or multiple attributes can be indexed. In the latter case, an array of strings is expected. The `.` character denotes sub-attributes in attribute paths. Attributes with literal `.` in their name cannot be indexed. Attributes with the name `_id` cannot be indexed either, neither as a top-level attribute nor as a sub-attribute. Optionally, an index name may be specified as a string in the **name** attribute. Index names have the same restrictions as collection names. If no value is specified, one will be auto-generated. Persistent indexes (including vertex-centric indexes) can be created as unique or non-unique variants. Uniqueness can be controlled by specifying the **unique** option for the index definition. Setting it to `true` creates a unique index. Setting it to `false` or omitting the `unique` attribute creates a non-unique index. **Note**: Unique indexes on non-shard keys are not supported in a cluster. Persistent indexes can optionally be created in a sparse variant. A sparse index will be created if the **sparse** attribute in the index details is set to `true`. Sparse indexes do not index documents for which any of the index attributes is either not set or is `null`. The optional **deduplicate** attribute is supported by persistent array indexes. It controls whether inserting duplicate index values from the same document into a unique array index will lead to a unique constraint error or not. The default value is `true`, so only a single instance of each non-unique index value will be inserted into the index per document. Trying to insert a value into the index that already exists in the index always fails, regardless of the value of this attribute. The optional **estimates** attribute is supported by persistent indexes. This attribute controls whether index selectivity estimates are maintained for the index. Not maintaining index selectivity estimates can have a slightly positive impact on write performance. The downside of turning off index selectivity estimates will be that the query optimizer will not be able to determine the usefulness of different competing indexes in AQL queries when there are multiple candidate indexes to choose from. The `estimates` attribute is optional and defaults to `true` if not set. It will have no effect on indexes other than persistent indexes. The optional attribute **cacheEnabled** is supported by indexes of type *persistent*. This attribute controls whether an extra in-memory hash cache is created for the index. The hash cache can be used to speed up index lookups. The cache can only be used for queries that look up all index attributes via an equality lookup (`==`). The hash cache cannot be used for range scans, partial lookups or sorting. The cache will be populated lazily upon reading data from the index. Writing data into the collection or updating existing data will invalidate entries in the cache. The cache may have a negative effect on performance in case index values are updated more often than they are read. The maximum size of cache entries that can be stored is currently 4 MB, i.e. the cumulated size of all index entries for any index lookup value must be less than 4 MB. This limitation is there to avoid storing the index entries of \"super nodes\" in the cache. `cacheEnabled` defaults to `false` and should only be used for indexes that are known to benefit from an extra layer of caching. The optional attribute **inBackground** can be set to `true` to create the index in the background, which will not write-lock the underlying collection for as long as if the index is built in the foreground. 
*
* collection String The collection name. 
* apiIndexGeneralPostRequest ApiIndexGeneralPostRequest  (optional)
* no response value expected for this operation
* */
const _apiIndexgeneralPOST = ({ collection, apiIndexGeneralPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        apiIndexGeneralPostRequest,
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
* Creates a geo-spatial index in the collection `collection`, if it does not already exist. Expects an object containing the index details. Geo indexes are always sparse, meaning that documents that do not contain the index attributes or have non-numeric values in the index attributes will not be indexed. 
*
* collection String The collection name. 
* apiIndexGeoPostRequest ApiIndexGeoPostRequest  (optional)
* no response value expected for this operation
* */
const _apiIndexgeoPOST = ({ collection, apiIndexGeoPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        apiIndexGeoPostRequest,
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
* Creates an inverted index for the collection `collection-name`, if it does not already exist. The call expects an object containing the index details. 
*
* collection String The collection name. 
* apiIndexInvertedPostRequest ApiIndexInvertedPostRequest  (optional)
* no response value expected for this operation
* */
const _apiIndexinvertedPOST = ({ collection, apiIndexInvertedPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        apiIndexInvertedPostRequest,
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
* Creates a multi-dimensional index for the collection *collection-name*, if it does not already exist. The call expects an object containing the index details. 
*
* collection String The collection name. 
* apiIndexMultiDimPostRequest ApiIndexMultiDimPostRequest  (optional)
* no response value expected for this operation
* */
const _apiIndexmultiDimPOST = ({ collection, apiIndexMultiDimPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        apiIndexMultiDimPostRequest,
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
* Creates a persistent index for the collection `collection-name`, if it does not already exist. The call expects an object containing the index details. In a sparse index all documents will be excluded from the index that do not contain at least one of the specified index attributes (i.e. `fields`) or that have a value of `null` in any of the specified index attributes. Such documents will not be indexed, and not be taken into account for uniqueness checks if the `unique` flag is set. In a non-sparse index, these documents will be indexed (for non-present indexed attributes, a value of `null` will be used) and will be taken into account for uniqueness checks if the `unique` flag is set. **Note**: Unique indexes on non-shard keys are not supported in a cluster. 
*
* collection String The collection name. 
* apiIndexPersistentPostRequest ApiIndexPersistentPostRequest  (optional)
* no response value expected for this operation
* */
const _apiIndexpersistentPOST = ({ collection, apiIndexPersistentPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        apiIndexPersistentPostRequest,
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
* Creates a TTL index for the collection *collection-name* if it does not already exist. The call expects an object containing the index details. 
*
* collection String The collection name. 
* apiIndexTtlPostRequest ApiIndexTtlPostRequest  (optional)
* no response value expected for this operation
* */
const _apiIndexttlPOST = ({ collection, apiIndexTtlPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collection,
        apiIndexTtlPostRequest,
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
  _apiIndexGET,
  _apiIndexIndexIdDELETE,
  _apiIndexIndexIdGET,
  _apiIndexfulltextPOST,
  _apiIndexgeneralPOST,
  _apiIndexgeoPOST,
  _apiIndexinvertedPOST,
  _apiIndexmultiDimPOST,
  _apiIndexpersistentPOST,
  _apiIndexttlPOST,
};
