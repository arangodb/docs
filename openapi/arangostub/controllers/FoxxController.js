/**
 * The FoxxController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/FoxxService');
const _apiFoxxCommitPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxCommitPOST);
};

const _apiFoxxConfigurationGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxConfigurationGET);
};

const _apiFoxxConfigurationPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxConfigurationPATCH);
};

const _apiFoxxConfigurationPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxConfigurationPUT);
};

const _apiFoxxDependenciesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxDependenciesGET);
};

const _apiFoxxDependenciesPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxDependenciesPATCH);
};

const _apiFoxxDependenciesPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxDependenciesPUT);
};

const _apiFoxxDevelopmentDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxDevelopmentDELETE);
};

const _apiFoxxDevelopmentPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxDevelopmentPOST);
};

const _apiFoxxDownloadPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxDownloadPOST);
};

const _apiFoxxGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxGET);
};

const _apiFoxxPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxPOST);
};

const _apiFoxxReadmeGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxReadmeGET);
};

const _apiFoxxScriptsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxScriptsGET);
};

const _apiFoxxScriptsNamePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxScriptsNamePOST);
};

const _apiFoxxServiceDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxServiceDELETE);
};

const _apiFoxxServiceGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxServiceGET);
};

const _apiFoxxServicePATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxServicePATCH);
};

const _apiFoxxServicePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxServicePUT);
};

const _apiFoxxSwaggerGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxSwaggerGET);
};

const _apiFoxxTestsPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiFoxxTestsPOST);
};


module.exports = {
  _apiFoxxCommitPOST,
  _apiFoxxConfigurationGET,
  _apiFoxxConfigurationPATCH,
  _apiFoxxConfigurationPUT,
  _apiFoxxDependenciesGET,
  _apiFoxxDependenciesPATCH,
  _apiFoxxDependenciesPUT,
  _apiFoxxDevelopmentDELETE,
  _apiFoxxDevelopmentPOST,
  _apiFoxxDownloadPOST,
  _apiFoxxGET,
  _apiFoxxPOST,
  _apiFoxxReadmeGET,
  _apiFoxxScriptsGET,
  _apiFoxxScriptsNamePOST,
  _apiFoxxServiceDELETE,
  _apiFoxxServiceGET,
  _apiFoxxServicePATCH,
  _apiFoxxServicePUT,
  _apiFoxxSwaggerGET,
  _apiFoxxTestsPOST,
};
