/**
 * The IndexesController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/IndexesService');
const _apiIndexGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexGET);
};

const _apiIndexIndexIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexIndexIdDELETE);
};

const _apiIndexIndexIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexIndexIdGET);
};

const _apiIndexfulltextPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexfulltextPOST);
};

const _apiIndexgeneralPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexgeneralPOST);
};

const _apiIndexgeoPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexgeoPOST);
};

const _apiIndexinvertedPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexinvertedPOST);
};

const _apiIndexmultiDimPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexmultiDimPOST);
};

const _apiIndexpersistentPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexpersistentPOST);
};

const _apiIndexttlPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiIndexttlPOST);
};


module.exports = {
  _apiIndexGET,
  _apiIndexIndexIdDELETE,
  _apiIndexIndexIdGET,
  _apiIndexfulltextPOST,
  _apiIndexgeneralPOST,
  _apiIndexgeoPOST,
  _apiIndexinvertedPOST,
  _apiIndexmultiDimPOST,
  _apiIndexpersistentPOST,
  _apiIndexttlPOST,
};
