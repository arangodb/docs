/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Fetches data about all users.  You need the *Administrate* server access level in order to execute this REST call.  Otherwise, you will only get information about yourself. The call will return a JSON object with at least the following attributes on success: - *user*: The name of the user as a string. - *active*: An optional flag that specifies whether the user is active. - *extra*: A JSON object with extra user information. It is used by the web   interface to store graph viewer settings and saved queries. 
*
* no response value expected for this operation
* */
const _apiUserGET = () => new Promise(
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
* Create a new user. You need server access level *Administrate* in order to execute this REST call. 
*
* apiUserPostRequest ApiUserPostRequest  (optional)
* no response value expected for this operation
* */
const _apiUserPOST = ({ apiUserPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiUserPostRequest,
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
* Removes an existing user, identified by *user*.  You need *Administrate* for the server access level in order to execute this REST call. 
*
* user String The name of the user 
* no response value expected for this operation
* */
const _apiUserUserDELETE = ({ user }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
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
* Clears the collection access level for the collection *collection* in the database *dbname* of user *user*.  As consequence the default collection access level is used. If there is no defined default collection access level, it defaults to *No access*.  You need permissions to the *_system* database in order to execute this REST call. 
*
* user String The name of the user. 
* dbname String The name of the database. 
* collection String The name of the collection. 
* no response value expected for this operation
* */
const _apiUserUserDatabaseDbnameCollectionDELETE = ({ user, dbname, collection }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        dbname,
        collection,
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
* Returns the collection access level for a specific collection 
*
* user String The name of the user for which you want to query the databases. 
* dbname String The name of the database to query 
* collection String The name of the collection 
* no response value expected for this operation
* */
const _apiUserUserDatabaseDbnameCollectionGET = ({ user, dbname, collection }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        dbname,
        collection,
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
* Sets the collection access level for the *collection* in the database *dbname* for user *user*. You need the *Administrate* server access level in order to execute this REST call. 
*
* user String The name of the user. 
* dbname String The name of the database. 
* collection String The name of the collection. 
* apiUserUserDatabaseDbnameCollectionDeleteRequest ApiUserUserDatabaseDbnameCollectionDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiUserUserDatabaseDbnameCollectionPUT = ({ user, dbname, collection, apiUserUserDatabaseDbnameCollectionDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        dbname,
        collection,
        apiUserUserDatabaseDbnameCollectionDeleteRequest,
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
* Clears the database access level for the database *dbname* of user *user*. As consequence the default database access level is used. If there is no defined default database access level, it defaults to *No access*. You need permission to the *_system* database in order to execute this REST call. 
*
* user String The name of the user. 
* dbname String The name of the database. 
* no response value expected for this operation
* */
const _apiUserUserDatabaseDbnameDELETE = ({ user, dbname }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        dbname,
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
* Fetch the database access level for a specific database 
*
* user String The name of the user for which you want to query the databases. 
* dbname String The name of the database to query 
* no response value expected for this operation
* */
const _apiUserUserDatabaseDbnameGET = ({ user, dbname }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        dbname,
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
* Sets the database access levels for the database *dbname* of user *user*. You need the *Administrate* server access level in order to execute this REST call. 
*
* user String The name of the user. 
* dbname String The name of the database. 
* apiUserUserDatabaseDbnameDeleteRequest ApiUserUserDatabaseDbnameDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiUserUserDatabaseDbnamePUT = ({ user, dbname, apiUserUserDatabaseDbnameDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        dbname,
        apiUserUserDatabaseDbnameDeleteRequest,
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
* Fetch the list of databases available to the specified *user*. You need *Administrate* for the server access level in order to execute this REST call. The call will return a JSON object with the per-database access privileges for the specified user. The *result* object will contain the databases names as object keys, and the associated privileges for the database as values. In case you specified *full*, the result will contain the permissions for the databases as well as the permissions for the collections. 
*
* user String The name of the user for which you want to query the databases. 
* full Boolean Return the full set of access levels for all databases and all collections.  (optional)
* no response value expected for this operation
* */
const _apiUserUserDatabaseGET = ({ user, full }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        full,
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
* Partially updates the data of an existing user. You need server access level *Administrate* in order to execute this REST call. Additionally, a user can change his/her own data. 
*
* user String The name of the user. 
* apiUserUserDeleteRequest1 ApiUserUserDeleteRequest1  (optional)
* no response value expected for this operation
* */
const _apiUserUserPATCH = ({ user, apiUserUserDeleteRequest1 }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        apiUserUserDeleteRequest1,
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
* Replaces the data of an existing user. You need server access level *Administrate* in order to execute this REST call. Additionally, a user can change his/her own data. 
*
* user String The name of the user. 
* apiUserUserDeleteRequest ApiUserUserDeleteRequest  (optional)
* no response value expected for this operation
* */
const _apiUserUserPUT = ({ user, apiUserUserDeleteRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
        apiUserUserDeleteRequest,
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
