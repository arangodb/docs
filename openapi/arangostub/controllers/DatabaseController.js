/**
 * The DatabaseController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/DatabaseService');
const _apiDatabaseCurrentGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDatabaseCurrentGET);
};

const _apiDatabaseDatabaseNameDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDatabaseDatabaseNameDELETE);
};

const _apiDatabaseGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDatabaseGET);
};

const _apiDatabasePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDatabasePOST);
};

const _apiDatabaseUserGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDatabaseUserGET);
};


module.exports = {
  _apiDatabaseCurrentGET,
  _apiDatabaseDatabaseNameDELETE,
  _apiDatabaseGET,
  _apiDatabasePOST,
  _apiDatabaseUserGET,
};
