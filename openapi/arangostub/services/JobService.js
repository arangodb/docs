/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Cancels the currently running job identified by job-id. Note that it still might take some time to actually cancel the running async job. 
*
* jobId String The async job id. 
* no response value expected for this operation
* */
const _apiJobJobIdCancelPUT = ({ jobId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        jobId,
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
* Returns the processing status of the specified job. The processing status can be determined by peeking into the HTTP response code of the response. 
*
* jobId String The async job id. 
* no response value expected for this operation
* */
const _apiJobJobIdGET = ({ jobId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        jobId,
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
* Returns the result of an async job identified by job-id. If the async job result is present on the server, the result will be removed from the list of result. That means this method can be called for each job-id once. The method will return the original job result's headers and body, plus the additional HTTP header x-arango-async-job-id. If this header is present, then the job was found and the response contains the original job's result. If the header is not present, the job was not found and the response contains status information from the job manager. 
*
* jobId String The async job id. 
* no response value expected for this operation
* */
const _apiJobJobIdPUT = ({ jobId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        jobId,
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
* Deletes either all job results, expired job results, or the result of a specific job. Clients can use this method to perform an eventual garbage collection of job results. 
*
* type String The type of jobs to delete. type can be * *all* Deletes all jobs results. Currently executing or queued async   jobs will not be stopped by this call. * *expired* Deletes expired results. To determine the expiration status of a   result, pass the stamp query parameter. stamp needs to be a UNIX timestamp,   and all async job results created at a lower timestamp will be deleted. * *an actual job-id* In this case, the call will remove the result of the   specified async job. If the job is currently executing or queued, it will   not be aborted. 
* stamp BigDecimal A UNIX timestamp specifying the expiration threshold when type is expired.  (optional)
* no response value expected for this operation
* */
const _apiJobTypebyTypeDELETE = ({ type, stamp }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        type,
        stamp,
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
* Returns the list of ids of async jobs with a specific status (either done or pending). The list can be used by the client to get an overview of the job system status and to retrieve completed job results later. 
*
* type String The type of jobs to return. The type can be either done or pending. Setting the type to done will make the method return the ids of already completed async jobs for which results can be fetched. Setting the type to pending will return the ids of not yet finished async jobs. 
* count BigDecimal The maximum number of ids to return per call. If not specified, a server-defined maximum value will be used.  (optional)
* no response value expected for this operation
* */
const _apiJobTypebyTypeGET = ({ type, count }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        type,
        count,
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
  _apiJobJobIdCancelPUT,
  _apiJobJobIdGET,
  _apiJobJobIdPUT,
  _apiJobTypebyTypeDELETE,
  _apiJobTypebyTypeGET,
};
