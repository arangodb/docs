/**
 * The GraphController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/GraphService');
const _apiGharialGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGET);
};

const _apiGharialGraphDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphDELETE);
};

const _apiGharialGraphEdgeCollectionEdgeDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgeCollectionEdgeDELETE);
};

const _apiGharialGraphEdgeCollectionEdgeGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgeCollectionEdgeGET);
};

const _apiGharialGraphEdgeCollectionEdgePATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgeCollectionEdgePATCH);
};

const _apiGharialGraphEdgeCollectionEdgePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgeCollectionEdgePUT);
};

const _apiGharialGraphEdgeCollectionPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgeCollectionPOST);
};

const _apiGharialGraphEdgeDefinitiondefinitionDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgeDefinitiondefinitionDELETE);
};

const _apiGharialGraphEdgeDefinitiondefinitionPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgeDefinitiondefinitionPUT);
};

const _apiGharialGraphEdgeGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgeGET);
};

const _apiGharialGraphEdgePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphEdgePOST);
};

const _apiGharialGraphGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphGET);
};

const _apiGharialGraphVertexCollectionDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphVertexCollectionDELETE);
};

const _apiGharialGraphVertexCollectionPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphVertexCollectionPOST);
};

const _apiGharialGraphVertexCollectionVertexDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphVertexCollectionVertexDELETE);
};

const _apiGharialGraphVertexCollectionVertexGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphVertexCollectionVertexGET);
};

const _apiGharialGraphVertexCollectionVertexPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphVertexCollectionVertexPATCH);
};

const _apiGharialGraphVertexCollectionVertexPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphVertexCollectionVertexPUT);
};

const _apiGharialGraphVertexGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphVertexGET);
};

const _apiGharialGraphVertexPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialGraphVertexPOST);
};

const _apiGharialPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiGharialPOST);
};


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
