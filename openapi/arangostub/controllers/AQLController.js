/**
 * The AQLController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/AQLService');
const _apiAqlfunctionGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiAqlfunctionGET);
};

const _apiAqlfunctionNameDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiAqlfunctionNameDELETE);
};

const _apiAqlfunctionPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiAqlfunctionPOST);
};

const _apiExplainPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiExplainPOST);
};

const _apiQueryCacheDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryCacheDELETE);
};

const _apiQueryCacheEntriesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryCacheEntriesGET);
};

const _apiQueryCachePropertiesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryCachePropertiesGET);
};

const _apiQueryCachePropertiesPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryCachePropertiesPUT);
};

const _apiQueryCurrentGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryCurrentGET);
};

const _apiQueryPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryPOST);
};

const _apiQueryPropertiesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryPropertiesGET);
};

const _apiQueryPropertiesPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryPropertiesPUT);
};

const _apiQueryQueryIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryQueryIdDELETE);
};

const _apiQueryRulesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQueryRulesGET);
};

const _apiQuerySlowDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQuerySlowDELETE);
};

const _apiQuerySlowGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiQuerySlowGET);
};


module.exports = {
  _apiAqlfunctionGET,
  _apiAqlfunctionNameDELETE,
  _apiAqlfunctionPOST,
  _apiExplainPOST,
  _apiQueryCacheDELETE,
  _apiQueryCacheEntriesGET,
  _apiQueryCachePropertiesGET,
  _apiQueryCachePropertiesPUT,
  _apiQueryCurrentGET,
  _apiQueryPOST,
  _apiQueryPropertiesGET,
  _apiQueryPropertiesPUT,
  _apiQueryQueryIdDELETE,
  _apiQueryRulesGET,
  _apiQuerySlowDELETE,
  _apiQuerySlowGET,
};
