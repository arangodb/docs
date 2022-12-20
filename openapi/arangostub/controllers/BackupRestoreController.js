/**
 * The BackupRestoreController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/BackupRestoreService');
const _adminBackupCreatePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminBackupCreatePOST);
};

const _adminBackupDeletePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminBackupDeletePOST);
};

const _adminBackupDownloadPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminBackupDownloadPOST);
};

const _adminBackupListPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminBackupListPOST);
};

const _adminBackupRestorePOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminBackupRestorePOST);
};

const _adminBackupUploadPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service._adminBackupUploadPOST);
};


module.exports = {
  _adminBackupCreatePOST,
  _adminBackupDeletePOST,
  _adminBackupDownloadPOST,
  _adminBackupListPOST,
  _adminBackupRestorePOST,
  _adminBackupUploadPOST,
};
