/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Retrieves the properties of the current database The response is a JSON object with the following attributes: - *name*: the name of the current database - *id*: the id of the current database - *path*: the filesystem path of the current database - *isSystem*: whether or not the current database is the *_system* database - *sharding*: the default sharding method for collections created in this database - *replicationFactor*: the default replication factor for collections in this database - *writeConcern*: the default write concern for collections in this database 
*
* no response value expected for this operation
* */
const _apiDatabaseCurrentGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
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
* Drops the database along with all data stored in it. **Note**: dropping a database is only possible from within the *_system* database. The *_system* database itself cannot be dropped. 
*
* databaseName String The name of the database 
* no response value expected for this operation
* */
const _apiDatabaseDatabaseNameDELETE = ({ databaseName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        databaseName,
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
* Retrieves the list of all existing databases **Note**: retrieving the list of databases is only possible from within the *_system* database. **Note**: You should use the *GET user API* to fetch the list of the available databases now. 
*
* no response value expected for this operation
* */
const _apiDatabaseGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
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
* Creates a new database The response is a JSON object with the attribute *result* set to *true*. **Note**: creating a new database is only possible from within the *_system* database. 
*
* apiDatabaseGetRequest ApiDatabaseGetRequest  (optional)
* no response value expected for this operation
* */
const _apiDatabasePOST = ({ apiDatabaseGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiDatabaseGetRequest,
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
* Retrieves the list of all databases the current user can access without specifying a different username or password. 
*
* no response value expected for this operation
* */
const _apiDatabaseUserGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
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
  _apiDatabaseCurrentGET,
  _apiDatabaseDatabaseNameDELETE,
  _apiDatabaseGET,
  _apiDatabasePOST,
  _apiDatabaseUserGET,
};
