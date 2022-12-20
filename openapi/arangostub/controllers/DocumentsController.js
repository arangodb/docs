/**
 * The DocumentsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/DocumentsService');
const _apiDocumentCollectionDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionDELETE);
};

const _apiDocumentCollectionKeyDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionKeyDELETE);
};

const _apiDocumentCollectionKeyGET = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionKeyGET);
};

const _apiDocumentCollectionKeyHEAD = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionKeyHEAD);
};

const _apiDocumentCollectionKeyPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionKeyPATCH);
};

const _apiDocumentCollectionKeyPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionKeyPUT);
};

const _apiDocumentCollectionPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionPATCH);
};

const _apiDocumentCollectionPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionPOST);
};

const _apiDocumentCollectionPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionPUT);
};

const _apiDocumentCollectiongetPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectiongetPUT);
};

const _apiDocumentCollectionmultiplePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._apiDocumentCollectionmultiplePOST);
};


module.exports = {
  _apiDocumentCollectionDELETE,
  _apiDocumentCollectionKeyDELETE,
  _apiDocumentCollectionKeyGET,
  _apiDocumentCollectionKeyHEAD,
  _apiDocumentCollectionKeyPATCH,
  _apiDocumentCollectionKeyPUT,
  _apiDocumentCollectionPATCH,
  _apiDocumentCollectionPOST,
  _apiDocumentCollectionPUT,
  _apiDocumentCollectiongetPUT,
  _apiDocumentCollectionmultiplePOST,
};
