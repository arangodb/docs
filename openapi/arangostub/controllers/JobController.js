/**
 * The JobController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/JobService');
const _apiJobJobIdCancelPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiJobJobIdCancelPUT);
};

const _apiJobJobIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiJobJobIdGET);
};

const _apiJobJobIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiJobJobIdPUT);
};

const _apiJobTypebyTypeDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiJobTypebyTypeDELETE);
};

const _apiJobTypebyTypeGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiJobTypebyTypeGET);
};


module.exports = {
  _apiJobJobIdCancelPUT,
  _apiJobJobIdGET,
  _apiJobJobIdPUT,
  _apiJobTypebyTypeDELETE,
  _apiJobTypebyTypeGET,
};
