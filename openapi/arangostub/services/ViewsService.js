/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Returns an object containing a listing of all Views in a database, regardless of their type. It is an array of objects with the following attributes: - *id* - *name* - *type* 
*
* no response value expected for this operation
* */
const _apiViewGET = () => new Promise(
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
* Drops the View identified by *view-name*. If the View was successfully dropped, an object is returned with the following attributes: - *error*: *false* - *id*: The identifier of the dropped View 
*
* viewName String The name of the View to drop. 
* no response value expected for this operation
* */
const _apiViewViewNameDELETE = ({ viewName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        viewName,
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
* The result is an object briefly describing the View with the following attributes: - *id*: The identifier of the View - *name*: The name of the View - *type*: The type of the View as string 
*
* viewName String The name of the View. 
* no response value expected for this operation
* */
const _apiViewViewNameGET = ({ viewName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        viewName,
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
* Changes the properties of a View by updating the specified attributes. On success an object with the following attributes is returned: - *id*: The identifier of the View - *name*: The name of the View - *type*: The View type - all additional ArangoSearch View implementation specific properties 
*
* viewName String The name of the View. 
* apiViewViewNamePropertiesArangoSearchPatchRequest ApiViewViewNamePropertiesArangoSearchPatchRequest  (optional)
* no response value expected for this operation
* */
const _apiViewViewNamePropertiesArangoSearchPATCH = ({ viewName, apiViewViewNamePropertiesArangoSearchPatchRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        viewName,
        apiViewViewNamePropertiesArangoSearchPatchRequest,
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
* Changes the properties of a View by replacing them. On success an object with the following attributes is returned: - *id*: The identifier of the View - *name*: The name of the View - *type*: The View type - all additional ArangoSearch View implementation specific properties 
*
* viewName String The name of the View. 
* apiViewViewNamePropertiesArangoSearchPatchRequest ApiViewViewNamePropertiesArangoSearchPatchRequest  (optional)
* no response value expected for this operation
* */
const _apiViewViewNamePropertiesArangoSearchPUT = ({ viewName, apiViewViewNamePropertiesArangoSearchPatchRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        viewName,
        apiViewViewNamePropertiesArangoSearchPatchRequest,
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
* The result is an object with a full description of a specific View, including View type dependent properties. 
*
* viewName String The name of the View. 
* no response value expected for this operation
* */
const _apiViewViewNamePropertiesGET = ({ viewName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        viewName,
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
* Updates the list of indexes of a `search-alias` View. 
*
* viewName String The name of the View. 
* apiViewViewNamePropertiesSearchaliasPatchRequest1 ApiViewViewNamePropertiesSearchaliasPatchRequest1  (optional)
* no response value expected for this operation
* */
const _apiViewViewNamePropertiessearchaliasPATCH = ({ viewName, apiViewViewNamePropertiesSearchaliasPatchRequest1 }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        viewName,
        apiViewViewNamePropertiesSearchaliasPatchRequest1,
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
* Replaces the list of indexes of a `search-alias` View. 
*
* viewName String The name of the View. 
* apiViewViewNamePropertiesSearchaliasPatchRequest ApiViewViewNamePropertiesSearchaliasPatchRequest  (optional)
* no response value expected for this operation
* */
const _apiViewViewNamePropertiessearchaliasPUT = ({ viewName, apiViewViewNamePropertiesSearchaliasPatchRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        viewName,
        apiViewViewNamePropertiesSearchaliasPatchRequest,
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
* Renames a View. Expects an object with the attribute(s) - *name*: The new name It returns an object with the attributes - *id*: The identifier of the View. - *name*: The new name of the View. - *type*: The View type. **Note**: This method is not available in a cluster. 
*
* viewName String The name of the View to rename. 
* no response value expected for this operation
* */
const _apiViewViewNameRenamePUT = ({ viewName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        viewName,
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
* Creates a new View with a given name and properties if it does not already exist. 
*
* apiViewArangosearchPostRequest ApiViewArangosearchPostRequest  (optional)
* no response value expected for this operation
* */
const _apiViewarangosearchPOST = ({ apiViewArangosearchPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiViewArangosearchPostRequest,
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
* Creates a new View with a given name and properties if it does not already exist. 
*
* apiViewSearchaliasPostRequest ApiViewSearchaliasPostRequest  (optional)
* no response value expected for this operation
* */
const _apiViewsearchaliasPOST = ({ apiViewSearchaliasPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiViewSearchaliasPostRequest,
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
