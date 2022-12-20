/**
 * The ReplicationController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ReplicationService');
const _apiReplicationApplierConfigGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationApplierConfigGET);
};

const _apiReplicationApplierConfigPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationApplierConfigPUT);
};

const _apiReplicationApplierStartPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationApplierStartPUT);
};

const _apiReplicationApplierStateGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationApplierStateGET);
};

const _apiReplicationApplierStopPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationApplierStopPUT);
};

const _apiReplicationBatchIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationBatchIdDELETE);
};

const _apiReplicationBatchIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationBatchIdPUT);
};

const _apiReplicationBatchPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationBatchPOST);
};

const _apiReplicationClusterInventoryGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationClusterInventoryGET);
};

const _apiReplicationDumpGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationDumpGET);
};

const _apiReplicationInventoryGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationInventoryGET);
};

const _apiReplicationLoggerFirstTickGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationLoggerFirstTickGET);
};

const _apiReplicationLoggerFollowGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationLoggerFollowGET);
};

const _apiReplicationLoggerStateGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationLoggerStateGET);
};

const _apiReplicationLoggerTickRangesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationLoggerTickRangesGET);
};

const _apiReplicationMakeFollowerPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationMakeFollowerPUT);
};

const _apiReplicationRevisionsDocumentsPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationRevisionsDocumentsPUT);
};

const _apiReplicationRevisionsRangesPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationRevisionsRangesPUT);
};

const _apiReplicationRevisionsTreeGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationRevisionsTreeGET);
};

const _apiReplicationRevisionsTreePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationRevisionsTreePOST);
};

const _apiReplicationServerIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationServerIdGET);
};

const _apiReplicationSyncPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiReplicationSyncPUT);
};

const _apiWalLastTickGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiWalLastTickGET);
};

const _apiWalRangeGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiWalRangeGET);
};

const _apiWalTailGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiWalTailGET);
};


module.exports = {
  _apiReplicationApplierConfigGET,
  _apiReplicationApplierConfigPUT,
  _apiReplicationApplierStartPUT,
  _apiReplicationApplierStateGET,
  _apiReplicationApplierStopPUT,
  _apiReplicationBatchIdDELETE,
  _apiReplicationBatchIdPUT,
  _apiReplicationBatchPOST,
  _apiReplicationClusterInventoryGET,
  _apiReplicationDumpGET,
  _apiReplicationInventoryGET,
  _apiReplicationLoggerFirstTickGET,
  _apiReplicationLoggerFollowGET,
  _apiReplicationLoggerStateGET,
  _apiReplicationLoggerTickRangesGET,
  _apiReplicationMakeFollowerPUT,
  _apiReplicationRevisionsDocumentsPUT,
  _apiReplicationRevisionsRangesPUT,
  _apiReplicationRevisionsTreeGET,
  _apiReplicationRevisionsTreePOST,
  _apiReplicationServerIdGET,
  _apiReplicationSyncPUT,
  _apiWalLastTickGET,
  _apiWalRangeGET,
  _apiWalTailGET,
};
