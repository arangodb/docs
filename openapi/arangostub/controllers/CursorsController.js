/**
 * The CursorsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/CursorsService');
const _apiCursorCursorIdentifierDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCursorCursorIdentifierDELETE);
};

const _apiCursorCursorIdentifierPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCursorCursorIdentifierPOST);
};

const _apiCursorCursorIdentifierPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCursorCursorIdentifierPUT);
};

const _apiCursorPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiCursorPOST);
};


module.exports = {
  _apiCursorCursorIdentifierDELETE,
  _apiCursorCursorIdentifierPOST,
  _apiCursorCursorIdentifierPUT,
  _apiCursorPOST,
};
