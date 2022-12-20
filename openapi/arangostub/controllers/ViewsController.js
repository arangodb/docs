/**
 * The ViewsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ViewsService');
const _apiViewGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewGET);
};

const _apiViewViewNameDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewViewNameDELETE);
};

const _apiViewViewNameGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewViewNameGET);
};

const _apiViewViewNamePropertiesArangoSearchPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewViewNamePropertiesArangoSearchPATCH);
};

const _apiViewViewNamePropertiesArangoSearchPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewViewNamePropertiesArangoSearchPUT);
};

const _apiViewViewNamePropertiesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewViewNamePropertiesGET);
};

const _apiViewViewNamePropertiessearchaliasPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewViewNamePropertiessearchaliasPATCH);
};

const _apiViewViewNamePropertiessearchaliasPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewViewNamePropertiessearchaliasPUT);
};

const _apiViewViewNameRenamePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewViewNameRenamePUT);
};

const _apiViewarangosearchPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewarangosearchPOST);
};

const _apiViewsearchaliasPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiViewsearchaliasPOST);
};


module.exports = {
  _apiViewGET,
  _apiViewViewNameDELETE,
  _apiViewViewNameGET,
  _apiViewViewNamePropertiesArangoSearchPATCH,
  _apiViewViewNamePropertiesArangoSearchPUT,
  _apiViewViewNamePropertiesGET,
  _apiViewViewNamePropertiessearchaliasPATCH,
  _apiViewViewNamePropertiessearchaliasPUT,
  _apiViewViewNameRenamePUT,
  _apiViewarangosearchPOST,
  _apiViewsearchaliasPOST,
};
