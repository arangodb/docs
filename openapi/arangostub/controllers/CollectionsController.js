/**
 * The CollectionsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/CollectionsService');
const _apiCollectionCollectionNameChecksumGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameChecksumGET);
};

const _apiCollectionCollectionNameCompactPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameCompactPUT);
};

const _apiCollectionCollectionNameCountGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameCountGET);
};

const _apiCollectionCollectionNameDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameDELETE);
};

const _apiCollectionCollectionNameFiguresGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameFiguresGET);
};

const _apiCollectionCollectionNameGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameGET);
};

const _apiCollectionCollectionNameLoadIndexesIntoMemoryPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameLoadIndexesIntoMemoryPUT);
};

const _apiCollectionCollectionNameLoadPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameLoadPUT);
};

const _apiCollectionCollectionNamePropertiesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNamePropertiesGET);
};

const _apiCollectionCollectionNamePropertiesPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNamePropertiesPUT);
};

const _apiCollectionCollectionNameRecalculateCountPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameRecalculateCountPUT);
};

const _apiCollectionCollectionNameRenamePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameRenamePUT);
};

const _apiCollectionCollectionNameResponsibleShardPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameResponsibleShardPUT);
};

const _apiCollectionCollectionNameRevisionGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameRevisionGET);
};

const _apiCollectionCollectionNameShardsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameShardsGET);
};

const _apiCollectionCollectionNameTruncatePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameTruncatePUT);
};

const _apiCollectionCollectionNameUnloadPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionCollectionNameUnloadPUT);
};

const _apiCollectionGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionGET);
};

const _apiCollectionPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCollectionPOST);
};


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
