/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Will calculate a checksum of the meta-data (keys and optionally revision ids) and optionally the document data in the collection. The checksum can be used to compare if two collections on different ArangoDB instances contain the same contents. The current revision of the collection is returned too so one can make sure the checksums are calculated for the same state of data. By default, the checksum will only be calculated on the *_key* system attribute of the documents contained in the collection. For edge collections, the system attributes *_from* and *_to* will also be included in the calculation. By setting the optional query parameter *withRevisions* to *true*, then revision ids (*_rev* system attributes) are included in the checksumming. By providing the optional query parameter *withData* with a value of *true*, the user-defined document attributes will be included in the calculation too. **Note**: Including user-defined attributes will make the checksumming slower. The response is a JSON object with the following attributes: - *checksum*: The calculated checksum as a number. - *revision*: The collection revision id as a string. 
*
* collectionName String The name of the collection. 
* withRevisions Boolean Whether or not to include document revision ids in the checksum calculation.  (optional)
* withData Boolean Whether or not to include document body data in the checksum calculation.  (optional)
* no response value expected for this operation
* */
const _apiCollectionCollectionNameChecksumGET = ({ collectionName, withRevisions, withData }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
        withRevisions,
        withData,
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
* Compacts the data of a collection in order to reclaim disk space. The operation will compact the document and index data by rewriting the underlying .sst files and only keeping the relevant entries. Under normal circumstances, running a compact operation is not necessary, as the collection data will eventually get compacted anyway. However, in some situations, e.g. after running lots of update/replace or remove operations, the disk data for a collection may contain a lot of outdated data for which the space shall be reclaimed. In this case the compaction operation can be used. 
*
* collectionName String Name of the collection to compact 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameCompactPUT = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
* In addition to the above, the result also contains the number of documents. **Note** that this will always load the collection into memory. - *count*: The number of documents inside the collection. 
*
* collectionName String The name of the collection. 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameCountGET = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
* Drops the collection identified by *collection-name*. If the collection was successfully dropped, an object is returned with the following attributes: - *error*: *false* - *id*: The identifier of the dropped collection. 
*
* collectionName String The name of the collection to drop. 
* isSystem Boolean Whether or not the collection to drop is a system collection. This parameter must be set to *true* in order to drop a system collection.  (optional)
* no response value expected for this operation
* */
const _apiCollectionCollectionNameDELETE = ({ collectionName, isSystem }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
        isSystem,
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
* In addition to the above, the result also contains the number of documents and additional statistical information about the collection. 
*
* collectionName String The name of the collection. 
* details Boolean Setting `details` to `true` will return extended storage engine-specific details to the figures. The details are intended for debugging ArangoDB itself and their format is subject to change. By default, `details` is set to `false`, so no details are returned and the behavior is identical to previous versions of ArangoDB. Please note that requesting `details` may cause additional load and thus have an impact on performace.  (optional)
* no response value expected for this operation
* */
const _apiCollectionCollectionNameFiguresGET = ({ collectionName, details }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
/**
* The result is an object describing the collection with the following attributes: - *id*: The identifier of the collection. - *name*: The name of the collection. - *status*: The status of the collection as number.   - 3: loaded   - 5: deleted Every other status indicates a corrupted collection. - *type*: The type of the collection as number.   - 2: document collection (normal case)   - 3: edge collection - *isSystem*: If *true* then the collection is a system collection. 
*
* collectionName String The name of the collection. 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameGET = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
* You can call this endpoint to try to cache this collection's index entries in the main memory. Index lookups served from the memory cache can be much faster than lookups not stored in the cache, resulting in a performance boost. The endpoint iterates over suitable indexes of the collection and stores the indexed values (not the entire document data) in memory. This is implemented for edge indexes only. The endpoint returns as soon as the index warmup has been scheduled. The index warmup may still be ongoing in the background, even after the return value has already been sent. As all suitable indexes are scanned, it may cause significant I/O activity and background load. This feature honors memory limits. If the indexes you want to load are smaller than your memory limit, this feature guarantees that most index values are cached. If the index is larger than your memory limit, this feature fills up values up to this limit. You cannot control which indexes of the collection should have priority over others. It is guaranteed that the in-memory cache data is consistent with the stored index data at all times. On success, this endpoint returns an object with attribute `result` set to `true`. 
*
* collectionName String 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameLoadIndexesIntoMemoryPUT = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
*  Since ArangoDB version 3.9.0 this API does nothing. Previously it used to load a collection into memory.   The request body object might optionally contain the following attribute:  - *count*: If set, this controls whether the return value should include   the number of documents in the collection. Setting *count* to   *false* may speed up loading a collection. The default value for   *count* is *true*.  A call to this API returns an object with the following attributes for compatibility reasons:  - *id*: The identifier of the collection.  - *name*: The name of the collection.  - *count*: The number of documents inside the collection. This is only   returned if the *count* input parameters is set to *true* or has   not been specified.  - *status*: The status of the collection as number.  - *type*: The collection type. Valid types are:   - 2: document collection   - 3: edge collection  - *isSystem*: If *true* then the collection is a system collection.  
*
* collectionName String The name of the collection. 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameLoadPUT = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
*  Read properties of a collection
*
* collectionName String The name of the collection. 
* returns __api_collection__collection_name__properties_get_200_response
* */
const _apiCollectionCollectionNamePropertiesGET = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
* Changes the properties of a collection. Only the provided attributes are updated. Collection properties **cannot be changed** once a collection is created except for the listed properties, as well as the collection name via the rename endpoint (but not in clusters). 
*
* collectionName String The name of the collection. 
* apiCollectionCollectionNamePropertiesGetRequest ApiCollectionCollectionNamePropertiesGetRequest  (optional)
* no response value expected for this operation
* */
const _apiCollectionCollectionNamePropertiesPUT = ({ collectionName, apiCollectionCollectionNamePropertiesGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
        apiCollectionCollectionNamePropertiesGetRequest,
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
* Recalculates the document count of a collection, if it ever becomes inconsistent. It returns an object with the attributes - *result*: will be *true* if recalculating the document count succeeded. 
*
* collectionName String The name of the collection. 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameRecalculateCountPUT = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
* Renames a collection. Expects an object with the attribute(s) - *name*: The new name. It returns an object with the attributes - *id*: The identifier of the collection. - *name*: The new name of the collection. - *status*: The status of the collection as number. - *type*: The collection type. Valid types are:   - 2: document collection   - 3: edges collection - *isSystem*: If *true* then the collection is a system collection. If renaming the collection succeeds, then the collection is also renamed in all graph definitions inside the `_graphs` collection in the current database. **Note**: this method is not available in a cluster. 
*
* collectionName String The name of the collection to rename. 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameRenamePUT = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
* Returns the ID of the shard that is responsible for the given document (if the document exists) or that would be responsible if such document existed. The request must body must contain a JSON document with at least the collection's shard key attributes set to some values. The response is a JSON object with a *shardId* attribute, which will contain the ID of the responsible shard. **Note** : This method is only available in a cluster Coordinator. 
*
* collectionName String The name of the collection. 
* apiCollectionCollectionNameResponsibleShardPutRequest ApiCollectionCollectionNameResponsibleShardPutRequest  (optional)
* no response value expected for this operation
* */
const _apiCollectionCollectionNameResponsibleShardPUT = ({ collectionName, apiCollectionCollectionNameResponsibleShardPutRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
        apiCollectionCollectionNameResponsibleShardPutRequest,
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
*  The response will contain the collection's latest used revision id.  The revision id is a server-generated string that clients can use to  check whether data in a collection has changed since the last revision check.  - *revision*: The collection revision id as a string.  
*
* collectionName String The name of the collection. 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameRevisionGET = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
* By default returns a JSON array with the shard IDs of the collection. If the `details` parameter is set to `true`, it will return a JSON object with the shard IDs as object attribute keys, and the responsible servers for each shard mapped to them. In the detailed response, the leader shards will be first in the arrays. **Note** : This method is only available in a cluster Coordinator. 
*
* collectionName String The name of the collection. 
* details Boolean If set to true, the return value will also contain the responsible servers for the collections' shards.  (optional)
* no response value expected for this operation
* */
const _apiCollectionCollectionNameShardsGET = ({ collectionName, details }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
/**
* Removes all documents from the collection, but leaves the indexes intact. 
*
* collectionName String The name of the collection. 
* waitForSync Boolean If *true* then the data is synchronized to disk before returning from the truncate operation (default *false*)  (optional)
* compact Boolean If *true* (default) then the storage engine is told to start a compaction in order to free up disk space. This can be resource intensive. If the only  intention is to start over with an empty collection, specify *false*.   (optional)
* no response value expected for this operation
* */
const _apiCollectionCollectionNameTruncatePUT = ({ collectionName, waitForSync, compact }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
        waitForSync,
        compact,
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
* Since ArangoDB version 3.9.0 this API does nothing. Previously it used to unload a collection from memory, while preserving all documents. When calling the API an object with the following attributes is returned for compatibility reasons: - *id*: The identifier of the collection. - *name*: The name of the collection. - *status*: The status of the collection as number. - *type*: The collection type. Valid types are:   - 2: document collection   - 3: edges collection - *isSystem*: If *true* then the collection is a system collection. 
*
* collectionName String 
* no response value expected for this operation
* */
const _apiCollectionCollectionNameUnloadPUT = ({ collectionName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionName,
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
* Returns an object with an attribute *result* containing an array of all collection descriptions. By providing the optional query parameter *excludeSystem* with a value of *true*, all system collections will be excluded from the response. 
*
* excludeSystem Boolean Whether or not system collections should be excluded from the result.  (optional)
* no response value expected for this operation
* */
const _apiCollectionGET = ({ excludeSystem }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        excludeSystem,
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
* Creates a new collection with a given name. The request must contain an object with the following attributes. 
*
* waitForSyncReplication Boolean The default is `true`, which means the server only reports success back to the client when all replicas have created the collection. Set it to `false` if you want faster server responses and don't care about full replication.  (optional)
* enforceReplicationFactor Boolean The default is `true`, which means the server checks if there are enough replicas available at creation time and bail out otherwise. Set it to `false` to disable this extra check.  (optional)
* apiCollectionGetRequest ApiCollectionGetRequest  (optional)
* no response value expected for this operation
* */
const _apiCollectionPOST = ({ waitForSyncReplication, enforceReplicationFactor, apiCollectionGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        waitForSyncReplication,
        enforceReplicationFactor,
        apiCollectionGetRequest,
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
  _apiCollectionCollectionNameChecksumGET,
  _apiCollectionCollectionNameCompactPUT,
  _apiCollectionCollectionNameCountGET,
  _apiCollectionCollectionNameDELETE,
  _apiCollectionCollectionNameFiguresGET,
  _apiCollectionCollectionNameGET,
  _apiCollectionCollectionNameLoadIndexesIntoMemoryPUT,
  _apiCollectionCollectionNameLoadPUT,
  _apiCollectionCollectionNamePropertiesGET,
  _apiCollectionCollectionNamePropertiesPUT,
  _apiCollectionCollectionNameRecalculateCountPUT,
  _apiCollectionCollectionNameRenamePUT,
  _apiCollectionCollectionNameResponsibleShardPUT,
  _apiCollectionCollectionNameRevisionGET,
  _apiCollectionCollectionNameShardsGET,
  _apiCollectionCollectionNameTruncatePUT,
  _apiCollectionCollectionNameUnloadPUT,
  _apiCollectionGET,
  _apiCollectionPOST,
};
