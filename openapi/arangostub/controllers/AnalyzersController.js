/**
 * The AnalyzersController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/AnalyzersService');
const _apiAnalyzerAnalyzerNameDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiAnalyzerAnalyzerNameDELETE);
};

const _apiAnalyzerAnalyzerNameGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiAnalyzerAnalyzerNameGET);
};

const _apiAnalyzerGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiAnalyzerGET);
};

const _apiAnalyzerPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiAnalyzerPOST);
};


module.exports = {
  _apiAnalyzerAnalyzerNameDELETE,
  _apiAnalyzerAnalyzerNameGET,
  _apiAnalyzerGET,
  _apiAnalyzerPOST,
};
