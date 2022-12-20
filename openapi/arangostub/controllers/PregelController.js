/**
 * The PregelController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/PregelService');
const _apiControlPregelGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiControlPregelGET);
};

const _apiControlPregelIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiControlPregelIdDELETE);
};

const _apiControlPregelIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiControlPregelIdGET);
};

const _apiControlPregelPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiControlPregelPOST);
};


module.exports = {
  _apiControlPregelGET,
  _apiControlPregelIdDELETE,
  _apiControlPregelIdGET,
  _apiControlPregelPOST,
};
