/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Removes an Analyzer configuration identified by *analyzer-name*. If the Analyzer definition was successfully dropped, an object is returned with the following attributes: - *error*: *false* - *name*: The name of the removed Analyzer 
*
* analyzerName String The name of the Analyzer to remove. 
* force Boolean The Analyzer configuration should be removed even if it is in-use. The default value is *false*.  (optional)
* no response value expected for this operation
* */
const _apiAnalyzerAnalyzerNameDELETE = ({ analyzerName, force }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        analyzerName,
        force,
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
* Retrieves the full definition for the specified Analyzer name. The resulting object contains the following attributes: - *name*: the Analyzer name - *type*: the Analyzer type - *properties*: the properties used to configure the specified type - *features*: the set of features to set on the Analyzer generated fields 
*
* analyzerName String The name of the Analyzer to retrieve. 
* no response value expected for this operation
* */
const _apiAnalyzerAnalyzerNameGET = ({ analyzerName }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        analyzerName,
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
* Retrieves a an array of all Analyzer definitions. The resulting array contains objects with the following attributes: - *name*: the Analyzer name - *type*: the Analyzer type - *properties*: the properties used to configure the specified type - *features*: the set of features to set on the Analyzer generated fields 
*
* no response value expected for this operation
* */
const _apiAnalyzerGET = () => new Promise(
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
* Creates a new Analyzer based on the provided configuration. 
*
* apiAnalyzerGetRequest ApiAnalyzerGetRequest  (optional)
* no response value expected for this operation
* */
const _apiAnalyzerPOST = ({ apiAnalyzerGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        apiAnalyzerGetRequest,
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
  _apiAnalyzerAnalyzerNameDELETE,
  _apiAnalyzerAnalyzerNameGET,
  _apiAnalyzerGET,
  _apiAnalyzerPOST,
};
