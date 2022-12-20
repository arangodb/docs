/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Creates a consistent backup \"as soon as possible\", very much like a snapshot in time, with a given label. The ambiguity in the phrase \"as soon as possible\" refers to the next window during which a global write lock across all databases can be obtained in order to guarantee consistency. Note that the backup at first resides on the same machine and hard drive as the original data. Make sure to upload it to a remote site for an actual backup. 
*
* adminBackupCreatePostRequest AdminBackupCreatePostRequest  (optional)
* no response value expected for this operation
* */
const _adminBackupCreatePOST = ({ adminBackupCreatePostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminBackupCreatePostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete a specific local backup identified by the given `id`. 
*
* adminBackupDeletePostRequest AdminBackupDeletePostRequest  (optional)
* no response value expected for this operation
* */
const _adminBackupDeletePOST = ({ adminBackupDeletePostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminBackupDeletePostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Download a specific local backup from a remote repository, or query progress on a previously scheduled download operation, or abort a running download operation. 
*
* adminBackupDownloadPostRequest AdminBackupDownloadPostRequest  (optional)
* no response value expected for this operation
* */
const _adminBackupDownloadPOST = ({ adminBackupDownloadPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminBackupDownloadPostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Lists all locally found backups. 
*
* adminBackupListPostRequest AdminBackupListPostRequest  (optional)
* no response value expected for this operation
* */
const _adminBackupListPOST = ({ adminBackupListPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminBackupListPostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Restores a consistent backup from a snapshot in time, with a given id. The backup snapshot must reside on the ArangoDB service locally. 
*
* adminBackupRestorePostRequest AdminBackupRestorePostRequest  (optional)
* no response value expected for this operation
* */
const _adminBackupRestorePOST = ({ adminBackupRestorePostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminBackupRestorePostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Upload a specific local backup to a remote repository, or query progress on a previously scheduled upload operation, or abort a running upload operation. 
*
* adminBackupUploadPostRequest AdminBackupUploadPostRequest  (optional)
* no response value expected for this operation
* */
const _adminBackupUploadPOST = ({ adminBackupUploadPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        adminBackupUploadPostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  _adminBackupCreatePOST,
  _adminBackupDeletePOST,
  _adminBackupDownloadPOST,
  _adminBackupListPOST,
  _adminBackupRestorePOST,
  _adminBackupUploadPOST,
};
