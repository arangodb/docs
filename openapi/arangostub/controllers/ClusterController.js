/**
 * The ClusterController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ClusterService');
const _adminClusterHealthGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterHealthGET);
};

const _adminClusterMaintenanceDBServerIDGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterMaintenanceDBServerIDGET);
};

const _adminClusterMaintenanceDBServerIDPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterMaintenanceDBServerIDPUT);
};

const _adminClusterMaintenancePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterMaintenancePUT);
};

const _adminClusterStatisticsGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminClusterStatisticsGET);
};


module.exports = {
  _adminClusterHealthGET,
  _adminClusterMaintenanceDBServerIDGET,
  _adminClusterMaintenanceDBServerIDPUT,
  _adminClusterMaintenancePUT,
  _adminClusterStatisticsGET,
};
