/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Lists all graphs stored in this database. 
*
* returns __api_gharial_get_200_response
* */
const _apiGharialGET = () => new Promise(
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
* Drops an existing graph object by name. Optionally all collections not used by other graphs can be dropped as well. 
*
* graph String The name of the graph. 
* dropCollections Boolean Drop collections of this graph as well.  Collections will only be dropped if they are not used in other graphs.  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphDELETE = ({ graph, dropCollections }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        dropCollections,
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
* Removes an edge from the collection. 
*
* graph String The name of the graph. 
* collection String The name of the edge collection the edge belongs to. 
* edge String The *_key* attribute of the edge. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* returnOld Boolean Define if a presentation of the deleted document should be returned within the response object.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is updated, if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative you can supply the Etag in an attribute rev in the URL.  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphEdgeCollectionEdgeDELETE = ({ graph, collection, edge, waitForSync, returnOld, ifMatch }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        edge,
        waitForSync,
        returnOld,
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
* Gets an edge from the given collection. 
*
* graph String The name of the graph. 
* collection String The name of the edge collection the edge belongs to. 
* edge String The *_key* attribute of the edge. 
* rev String Must contain a revision. If this is set a document is only returned if it has exactly this revision. Also see if-match header as an alternative to this.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is returned, if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative you can supply the Etag in an attribute rev in the URL.  (optional)
* ifNoneMatch String If the \"If-None-Match\" header is given, then it must contain exactly one Etag. The document is returned, only if it has a different revision as the given Etag. Otherwise a HTTP 304 is returned.  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphEdgeCollectionEdgeGET = ({ graph, collection, edge, rev, ifMatch, ifNoneMatch }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        edge,
        rev,
        ifMatch,
        ifNoneMatch,
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
* Updates the data of the specific edge in the collection. 
*
* graph String The name of the graph. 
* collection String The name of the edge collection the edge belongs to. 
* edge String The *_key* attribute of the vertex. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* keepNull Boolean Define if values set to null should be stored. By default (true) the given documents attribute(s) will be set to null. If this parameter is false the attribute(s) will instead be deleted from the document.  (optional)
* returnOld Boolean Define if a presentation of the deleted document should be returned within the response object.  (optional)
* returnNew Boolean Define if a presentation of the new document should be returned within the response object.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is updated, if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative you can supply the Etag in an attribute rev in the URL.  (optional)
* apiGharialGraphEdgeCollectionEdgeDeleteRequest ApiGharialGraphEdgeCollectionEdgeDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphEdgeCollectionEdgePATCH = ({ graph, collection, edge, waitForSync, keepNull, returnOld, returnNew, ifMatch, apiGharialGraphEdgeCollectionEdgeDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        edge,
        waitForSync,
        keepNull,
        returnOld,
        returnNew,
        ifMatch,
        apiGharialGraphEdgeCollectionEdgeDeleteRequest,
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
* Replaces the data of an edge in the collection. 
*
* graph String The name of the graph. 
* collection String The name of the edge collection the edge belongs to. 
* edge String The *_key* attribute of the vertex. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* keepNull Boolean Define if values set to null should be stored. By default the key is not removed from the document.  (optional)
* returnOld Boolean Define if a presentation of the deleted document should be returned within the response object.  (optional)
* returnNew Boolean Define if a presentation of the new document should be returned within the response object.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is updated, if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative you can supply the Etag in an attribute rev in the URL.  (optional)
* apiGharialGraphEdgeCollectionPostRequest ApiGharialGraphEdgeCollectionPostRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphEdgeCollectionEdgePUT = ({ graph, collection, edge, waitForSync, keepNull, returnOld, returnNew, ifMatch, apiGharialGraphEdgeCollectionPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        edge,
        waitForSync,
        keepNull,
        returnOld,
        returnNew,
        ifMatch,
        apiGharialGraphEdgeCollectionPostRequest,
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
* Creates a new edge in the collection. Within the body the edge has to contain a *_from* and *_to* value referencing to valid vertices in the graph. Furthermore the edge has to be valid in the definition of the used edge collection. 
*
* graph String The name of the graph. 
* collection String The name of the edge collection the edge belongs to. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* returnNew Boolean Define if the response should contain the complete new version of the document.  (optional)
* apiGharialGraphEdgeCollectionPostRequest ApiGharialGraphEdgeCollectionPostRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphEdgeCollectionPOST = ({ graph, collection, waitForSync, returnNew, apiGharialGraphEdgeCollectionPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        waitForSync,
        returnNew,
        apiGharialGraphEdgeCollectionPostRequest,
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
* Remove one edge definition from the graph.  This will only remove the edge collection, the vertex collections remain untouched and can still be used in your queries. 
*
* graph String The name of the graph. 
* definition String The name of the edge collection used in the definition. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* dropCollections Boolean Drop the collection as well. Collection will only be dropped if it is not used in other graphs.  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphEdgeDefinitiondefinitionDELETE = ({ graph, definition, waitForSync, dropCollections }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        definition,
        waitForSync,
        dropCollections,
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
* Change one specific edge definition. This will modify all occurrences of this definition in all graphs known to your database. 
*
* graph String The name of the graph. 
* definition String The name of the edge collection used in the definition. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* dropCollections Boolean Drop the collection as well. Collection will only be dropped if it is not used in other graphs.  (optional)
* apiGharialGraphEdgeDefinitionDefinitionDeleteRequest ApiGharialGraphEdgeDefinitionDefinitionDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphEdgeDefinitiondefinitionPUT = ({ graph, definition, waitForSync, dropCollections, apiGharialGraphEdgeDefinitionDefinitionDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        definition,
        waitForSync,
        dropCollections,
        apiGharialGraphEdgeDefinitionDefinitionDeleteRequest,
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
* Lists all edge collections within this graph. 
*
* graph String The name of the graph. 
* no response value expected for this operation
* */
const _apiGharialGraphEdgeGET = ({ graph }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
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
* Adds an additional edge definition to the graph. This edge definition has to contain a *collection* and an array of each *from* and *to* vertex collections.  An edge definition can only be added if this definition is either not used in any other graph, or it is used with exactly the same definition. It is not possible to store a definition \"e\" from \"v1\" to \"v2\" in the one graph, and \"e\" from \"v2\" to \"v1\" in the other graph. Additionally, collection creation options can be set. 
*
* graph String The name of the graph. 
* apiGharialGraphEdgeGetRequest ApiGharialGraphEdgeGetRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphEdgePOST = ({ graph, apiGharialGraphEdgeGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        apiGharialGraphEdgeGetRequest,
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
* Selects information for a given graph. Will return the edge definitions as well as the orphan collections. Or returns a 404 if the graph does not exist. 
*
* graph String The name of the graph. 
* no response value expected for this operation
* */
const _apiGharialGraphGET = ({ graph }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
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
* Removes a vertex collection from the graph and optionally deletes the collection, if it is not used in any other graph. It can only remove vertex collections that are no longer part of edge definitions, if they are used in edge definitions you are required to modify those first. 
*
* graph String The name of the graph. 
* collection String The name of the vertex collection. 
* dropCollection Boolean Drop the collection as well. Collection will only be dropped if it is not used in other graphs.  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphVertexCollectionDELETE = ({ graph, collection, dropCollection }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        dropCollection,
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
* Adds a vertex to the given collection. 
*
* graph String The name of the graph. 
* collection String The name of the vertex collection the vertex should be inserted into. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* returnNew Boolean Define if the response should contain the complete new version of the document.  (optional)
* apiGharialGraphVertexCollectionDeleteRequest ApiGharialGraphVertexCollectionDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphVertexCollectionPOST = ({ graph, collection, waitForSync, returnNew, apiGharialGraphVertexCollectionDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        waitForSync,
        returnNew,
        apiGharialGraphVertexCollectionDeleteRequest,
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
* Removes a vertex from the collection. 
*
* graph String The name of the graph. 
* collection String The name of the vertex collection the vertex belongs to. 
* vertex String The *_key* attribute of the vertex. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* returnOld Boolean Define if a presentation of the deleted document should be returned within the response object.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is updated, if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative you can supply the Etag in an attribute rev in the URL.  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphVertexCollectionVertexDELETE = ({ graph, collection, vertex, waitForSync, returnOld, ifMatch }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        vertex,
        waitForSync,
        returnOld,
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
* Gets a vertex from the given collection. 
*
* graph String The name of the graph. 
* collection String The name of the vertex collection the vertex belongs to. 
* vertex String The *_key* attribute of the vertex. 
* rev String Must contain a revision. If this is set a document is only returned if it has exactly this revision. Also see if-match header as an alternative to this.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is returned, if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative you can supply the Etag in an query parameter *rev*.  (optional)
* ifNoneMatch String If the \"If-None-Match\" header is given, then it must contain exactly one Etag. The document is returned, only if it has a different revision as the given Etag. Otherwise a HTTP 304 is returned.  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphVertexCollectionVertexGET = ({ graph, collection, vertex, rev, ifMatch, ifNoneMatch }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        vertex,
        rev,
        ifMatch,
        ifNoneMatch,
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
* Updates the data of the specific vertex in the collection. 
*
* graph String The name of the graph. 
* collection String The name of the vertex collection the vertex belongs to. 
* vertex String The *_key* attribute of the vertex. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* keepNull Boolean Define if values set to null should be stored. By default (true) the given documents attribute(s) will be set to null. If this parameter is false the attribute(s) will instead be delete from the document.  (optional)
* returnOld Boolean Define if a presentation of the deleted document should be returned within the response object.  (optional)
* returnNew Boolean Define if a presentation of the new document should be returned within the response object.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is updated, if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative you can supply the Etag in an attribute rev in the URL.  (optional)
* apiGharialGraphVertexCollectionVertexDeleteRequest ApiGharialGraphVertexCollectionVertexDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphVertexCollectionVertexPATCH = ({ graph, collection, vertex, waitForSync, keepNull, returnOld, returnNew, ifMatch, apiGharialGraphVertexCollectionVertexDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        vertex,
        waitForSync,
        keepNull,
        returnOld,
        returnNew,
        ifMatch,
        apiGharialGraphVertexCollectionVertexDeleteRequest,
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
* Replaces the data of a vertex in the collection. 
*
* graph String The name of the graph. 
* collection String The name of the vertex collection the vertex belongs to. 
* vertex String The *_key* attribute of the vertex. 
* waitForSync Boolean Define if the request should wait until synced to disk.  (optional)
* keepNull Boolean Define if values set to null should be stored. By default the key is not removed from the document.  (optional)
* returnOld Boolean Define if a presentation of the deleted document should be returned within the response object.  (optional)
* returnNew Boolean Define if a presentation of the new document should be returned within the response object.  (optional)
* ifMatch String If the \"If-Match\" header is given, then it must contain exactly one Etag. The document is updated, if it has the same revision as the given Etag. Otherwise a HTTP 412 is returned. As an alternative you can supply the Etag in an attribute rev in the URL.  (optional)
* apiGharialGraphVertexCollectionDeleteRequest ApiGharialGraphVertexCollectionDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphVertexCollectionVertexPUT = ({ graph, collection, vertex, waitForSync, keepNull, returnOld, returnNew, ifMatch, apiGharialGraphVertexCollectionDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        collection,
        vertex,
        waitForSync,
        keepNull,
        returnOld,
        returnNew,
        ifMatch,
        apiGharialGraphVertexCollectionDeleteRequest,
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
* Lists all vertex collections within this graph. 
*
* graph String The name of the graph. 
* no response value expected for this operation
* */
const _apiGharialGraphVertexGET = ({ graph }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
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
* Adds a vertex collection to the set of orphan collections of the graph. If the collection does not exist, it will be created. 
*
* graph String The name of the graph. 
* apiGharialGraphVertexGetRequest ApiGharialGraphVertexGetRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialGraphVertexPOST = ({ graph, apiGharialGraphVertexGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        graph,
        apiGharialGraphVertexGetRequest,
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
* The creation of a graph requires the name of the graph and a definition of its edges. 
*
* waitForSync Boolean define if the request should wait until everything is synced to disc. Will change the success response code.  (optional)
* apiGharialGetRequest ApiGharialGetRequest  (optional)
* no response value expected for this operation
* */
const _apiGharialPOST = ({ waitForSync, apiGharialGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        waitForSync,
        apiGharialGetRequest,
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
  _apiGharialGET,
  _apiGharialGraphDELETE,
  _apiGharialGraphEdgeCollectionEdgeDELETE,
  _apiGharialGraphEdgeCollectionEdgeGET,
  _apiGharialGraphEdgeCollectionEdgePATCH,
  _apiGharialGraphEdgeCollectionEdgePUT,
  _apiGharialGraphEdgeCollectionPOST,
  _apiGharialGraphEdgeDefinitiondefinitionDELETE,
  _apiGharialGraphEdgeDefinitiondefinitionPUT,
  _apiGharialGraphEdgeGET,
  _apiGharialGraphEdgePOST,
  _apiGharialGraphGET,
  _apiGharialGraphVertexCollectionDELETE,
  _apiGharialGraphVertexCollectionPOST,
  _apiGharialGraphVertexCollectionVertexDELETE,
  _apiGharialGraphVertexCollectionVertexGET,
  _apiGharialGraphVertexCollectionVertexPATCH,
  _apiGharialGraphVertexCollectionVertexPUT,
  _apiGharialGraphVertexGET,
  _apiGharialGraphVertexPOST,
  _apiGharialPOST,
};
