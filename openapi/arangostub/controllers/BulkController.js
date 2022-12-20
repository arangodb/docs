/**
 * The BulkController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/BulkService');
const _apiBatchPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiBatchPOST);
};

const _apiImportdocumentPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiImportdocumentPOST);
};

const _apiImportjsonPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiImportjsonPOST);
};


module.exports = {
  _apiBatchPOST,
  _apiImportdocumentPOST,
  _apiImportjsonPOST,
};
