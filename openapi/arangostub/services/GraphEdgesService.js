/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Returns an array of edges starting or ending in the vertex identified by *vertex*. 
*
* collectionId String The id of the collection. 
* vertex String The id of the start vertex. 
* direction String Selects *in* or *out* direction for edges. If not set, any edges are returned.  (optional)
* xArangoAllowDirtyRead Boolean Set this header to `true` to allow the Coordinator to ask any shard replica for the data, not only the shard leader. This may result in \"dirty reads\".  (optional)
* no response value expected for this operation
* */
const _apiEdgesCollectionIdGET = ({ collectionId, vertex, direction, xArangoAllowDirtyRead }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        collectionId,
        vertex,
        direction,
        xArangoAllowDirtyRead,
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
  _apiEdgesCollectionIdGET,
};
