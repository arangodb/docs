/**
 * The UserManagementController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/UserManagementService');
const _apiUserGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserGET);
};

const _apiUserPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserPOST);
};

const _apiUserUserDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserDELETE);
};

const _apiUserUserDatabaseDbnameCollectionDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserDatabaseDbnameCollectionDELETE);
};

const _apiUserUserDatabaseDbnameCollectionGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserDatabaseDbnameCollectionGET);
};

const _apiUserUserDatabaseDbnameCollectionPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserDatabaseDbnameCollectionPUT);
};

const _apiUserUserDatabaseDbnameDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserDatabaseDbnameDELETE);
};

const _apiUserUserDatabaseDbnameGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserDatabaseDbnameGET);
};

const _apiUserUserDatabaseDbnamePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserDatabaseDbnamePUT);
};

const _apiUserUserDatabaseGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserDatabaseGET);
};

const _apiUserUserPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserPATCH);
};

const _apiUserUserPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiUserUserPUT);
};


module.exports = {
  _apiUserGET,
  _apiUserPOST,
  _apiUserUserDELETE,
  _apiUserUserDatabaseDbnameCollectionDELETE,
  _apiUserUserDatabaseDbnameCollectionGET,
  _apiUserUserDatabaseDbnameCollectionPUT,
  _apiUserUserDatabaseDbnameDELETE,
  _apiUserUserDatabaseDbnameGET,
  _apiUserUserDatabaseDbnamePUT,
  _apiUserUserDatabaseGET,
  _apiUserUserPATCH,
  _apiUserUserPUT,
};
