/**
 * The AdministrationController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/AdministrationService');
const _adminClusterRebalanceExecutePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterRebalanceExecutePOST);
};

const _adminClusterRebalanceGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterRebalanceGET);
};

const _adminClusterRebalancePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterRebalancePOST);
};

const _adminClusterRebalancePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterRebalancePUT);
};

const _adminCompactPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminCompactPUT);
};

const _adminDatabaseTargetVersionGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminDatabaseTargetVersionGET);
};

const _adminEchoPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminEchoPOST);
};

const _adminExecutePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminExecutePOST);
};

const _adminLicenseGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminLicenseGET);
};

const _adminLicensePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminLicensePUT);
};

const _adminMetricsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminMetricsGET);
};

const _adminMetricsV2GET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminMetricsV2GET);
};

const _adminRoutingReloadPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminRoutingReloadPOST);
};

const _adminServerAvailabilityGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerAvailabilityGET);
};

const _adminServerEncryptionPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerEncryptionPOST);
};

const _adminServerIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerIdGET);
};

const _adminServerJwtGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerJwtGET);
};

const _adminServerJwtPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerJwtPOST);
};

const _adminServerModeGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerModeGET);
};

const _adminServerModePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerModePUT);
};

const _adminServerRoleGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerRoleGET);
};

const _adminServerTlsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerTlsGET);
};

const _adminServerTlsPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminServerTlsPOST);
};

const _adminShutdownDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminShutdownDELETE);
};

const _adminShutdownGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminShutdownGET);
};

const _adminStatusGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminStatusGET);
};

const _adminTimeGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminTimeGET);
};

const _apiClusterEndpointsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiClusterEndpointsGET);
};

const _apiEndpointGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiEndpointGET);
};

const _apiEngineGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiEngineGET);
};

const _apiTasksGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiTasksGET);
};

const _apiTasksIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiTasksIdDELETE);
};

const _apiTasksIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiTasksIdGET);
};

const _apiTasksIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiTasksIdPUT);
};

const _apiTasksPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiTasksPOST);
};

const _apiVersionGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiVersionGET);
};


module.exports = {
  _adminClusterRebalanceExecutePOST,
  _adminClusterRebalanceGET,
  _adminClusterRebalancePOST,
  _adminClusterRebalancePUT,
  _adminCompactPUT,
  _adminDatabaseTargetVersionGET,
  _adminEchoPOST,
  _adminExecutePOST,
  _adminLicenseGET,
  _adminLicensePUT,
  _adminMetricsGET,
  _adminMetricsV2GET,
  _adminRoutingReloadPOST,
  _adminServerAvailabilityGET,
  _adminServerEncryptionPOST,
  _adminServerIdGET,
  _adminServerJwtGET,
  _adminServerJwtPOST,
  _adminServerModeGET,
  _adminServerModePUT,
  _adminServerRoleGET,
  _adminServerTlsGET,
  _adminServerTlsPOST,
  _adminShutdownDELETE,
  _adminShutdownGET,
  _adminStatusGET,
  _adminTimeGET,
  _apiClusterEndpointsGET,
  _apiEndpointGET,
  _apiEngineGET,
  _apiTasksGET,
  _apiTasksIdDELETE,
  _apiTasksIdGET,
  _apiTasksIdPUT,
  _apiTasksPOST,
  _apiVersionGET,
};
