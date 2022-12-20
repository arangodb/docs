/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Commits the local service state of the Coordinator to the database. This can be used to resolve service conflicts between Coordinators that can not be fixed automatically due to missing data. 
*
* replace Boolean Overwrite existing service files in database even if they already exist.  (optional)
* no response value expected for this operation
* */
const _apiFoxxCommitPOST = ({ replace }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        replace,
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
* Fetches the current configuration for the service at the given mount path. Returns an object mapping the configuration option names to their definitions including a human-friendly *title* and the *current* value (if any). 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxConfigurationGET = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Replaces the given service's configuration. Returns an object mapping all configuration option names to their new values. 
*
* mount String Mount path of the installed service. 
* apiFoxxConfigurationGetRequest1 ApiFoxxConfigurationGetRequest1  (optional)
* no response value expected for this operation
* */
const _apiFoxxConfigurationPATCH = ({ mount, apiFoxxConfigurationGetRequest1 }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        apiFoxxConfigurationGetRequest1,
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
* Replaces the given service's configuration completely. Returns an object mapping all configuration option names to their new values. 
*
* mount String Mount path of the installed service. 
* apiFoxxConfigurationGetRequest ApiFoxxConfigurationGetRequest  (optional)
* no response value expected for this operation
* */
const _apiFoxxConfigurationPUT = ({ mount, apiFoxxConfigurationGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        apiFoxxConfigurationGetRequest,
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
* Fetches the current dependencies for service at the given mount path. Returns an object mapping the dependency names to their definitions including a human-friendly *title* and the *current* mount path (if any). 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxDependenciesGET = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Replaces the given service's dependencies. Returns an object mapping all dependency names to their new mount paths. 
*
* mount String Mount path of the installed service. 
* apiFoxxDependenciesGetRequest1 ApiFoxxDependenciesGetRequest1  (optional)
* no response value expected for this operation
* */
const _apiFoxxDependenciesPATCH = ({ mount, apiFoxxDependenciesGetRequest1 }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        apiFoxxDependenciesGetRequest1,
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
* Replaces the given service's dependencies completely. Returns an object mapping all dependency names to their new mount paths. 
*
* mount String Mount path of the installed service. 
* apiFoxxDependenciesGetRequest ApiFoxxDependenciesGetRequest  (optional)
* no response value expected for this operation
* */
const _apiFoxxDependenciesPUT = ({ mount, apiFoxxDependenciesGetRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        apiFoxxDependenciesGetRequest,
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
* Puts the service at the given mount path into production mode. When running ArangoDB in a cluster with multiple Coordinators this will replace the service on all other Coordinators with the version on this Coordinator. 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxDevelopmentDELETE = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Puts the service into development mode. While the service is running in development mode the service will be reloaded from the filesystem and its setup script (if any) will be re-executed every time the service handles a request. When running ArangoDB in a cluster with multiple Coordinators note that changes to the filesystem on one Coordinator will not be reflected across the other Coordinators. This means you should treat your Coordinators as inconsistent as long as any service is running in development mode. 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxDevelopmentPOST = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Downloads a zip bundle of the service directory. When development mode is enabled, this always creates a new bundle. Otherwise the bundle will represent the version of a service that is installed on that ArangoDB instance. 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxDownloadPOST = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Fetches a list of services installed in the current database. Returns a list of objects with the following attributes: - *mount*: the mount path of the service - *development*: *true* if the service is running in development mode - *legacy*: *true* if the service is running in 2.8 legacy compatibility mode - *provides*: the service manifest's *provides* value or an empty object Additionally the object may contain the following attributes if they have been set on the manifest: - *name*: a string identifying the service type - *version*: a semver-compatible version string 
*
* excludeSystem Boolean Whether or not system services should be excluded from the result.  (optional)
* no response value expected for this operation
* */
const _apiFoxxGET = ({ excludeSystem }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        excludeSystem,
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
* Installs the given new service at the given mount path. The request body can be any of the following formats: - `application/zip`: a raw zip bundle containing a service - `application/javascript`: a standalone JavaScript file - `application/json`: a service definition as JSON - `multipart/form-data`: a service definition as a multipart form A service definition is an object or form with the following properties or fields: - *configuration*: a JSON object describing configuration values - *dependencies*: a JSON object describing dependency settings - *source*: a fully qualified URL or an absolute path on the server's file system When using multipart data, the *source* field can also alternatively be a file field containing either a zip bundle or a standalone JavaScript file. When using a standalone JavaScript file the given file will be executed to define our service's HTTP endpoints. It is the same which would be defined in the field `main` of the service manifest. If *source* is a URL, the URL must be reachable from the server. If *source* is a file system path, the path will be resolved on the server. In either case the path or URL is expected to resolve to a zip bundle, JavaScript file or (in case of a file system path) directory. Note that when using file system paths in a cluster with multiple Coordinators the file system path must resolve to equivalent files on every Coordinator. 
*
* mount String Mount path the service should be installed at. 
* development Boolean Set to `true` to enable development mode.  (optional)
* setup Boolean Set to `false` to not run the service's setup script.  (optional)
* legacy Boolean Set to `true` to install the service in 2.8 legacy compatibility mode.  (optional)
* no response value expected for this operation
* */
const _apiFoxxPOST = ({ mount, development, setup, legacy }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        development,
        setup,
        legacy,
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
* Fetches the service's README or README.md file's contents if any. 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxReadmeGET = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Fetches a list of the scripts defined by the service. Returns an object mapping the raw script names to human-friendly names. 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxScriptsGET = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Runs the given script for the service at the given mount path. Returns the exports of the script, if any. 
*
* name String Name of the script to run. 
* mount String Mount path of the installed service. 
* apiFoxxScriptsNamePostRequest ApiFoxxScriptsNamePostRequest  (optional)
* no response value expected for this operation
* */
const _apiFoxxScriptsNamePOST = ({ name, mount, apiFoxxScriptsNamePostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        name,
        mount,
        apiFoxxScriptsNamePostRequest,
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
* Removes the service at the given mount path from the database and file system. Returns an empty response on success. 
*
* mount String Mount path of the installed service. 
* teardown Boolean Set to `false` to not run the service's teardown script.  (optional)
* no response value expected for this operation
* */
const _apiFoxxServiceDELETE = ({ mount, teardown }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        teardown,
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
* Fetches detailed information for the service at the given mount path. Returns an object with the following attributes: - *mount*: the mount path of the service - *path*: the local file system path of the service - *development*: *true* if the service is running in development mode - *legacy*: *true* if the service is running in 2.8 legacy compatibility mode - *manifest*: the normalized JSON manifest of the service Additionally the object may contain the following attributes if they have been set on the manifest: - *name*: a string identifying the service type - *version*: a semver-compatible version string 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxServiceGET = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Installs the given new service on top of the service currently installed at the given mount path. This is only recommended for switching between different versions of the same service. Unlike replacing a service, upgrading a service retains the old service's configuration and dependencies (if any) and should therefore only be used to migrate an existing service to a newer or equivalent service. The request body can be any of the following formats: - `application/zip`: a raw zip bundle containing a service - `application/javascript`: a standalone JavaScript file - `application/json`: a service definition as JSON - `multipart/form-data`: a service definition as a multipart form A service definition is an object or form with the following properties or fields: - *configuration*: a JSON object describing configuration values - *dependencies*: a JSON object describing dependency settings - *source*: a fully qualified URL or an absolute path on the server's file system When using multipart data, the *source* field can also alternatively be a file field containing either a zip bundle or a standalone JavaScript file. When using a standalone JavaScript file the given file will be executed to define our service's HTTP endpoints. It is the same which would be defined in the field `main` of the service manifest. If *source* is a URL, the URL must be reachable from the server. If *source* is a file system path, the path will be resolved on the server. In either case the path or URL is expected to resolve to a zip bundle, JavaScript file or (in case of a file system path) directory. Note that when using file system paths in a cluster with multiple Coordinators the file system path must resolve to equivalent files on every Coordinator. 
*
* mount String Mount path of the installed service. 
* teardown Boolean Set to `true` to run the old service's teardown script.  (optional)
* setup Boolean Set to `false` to not run the new service's setup script.  (optional)
* legacy Boolean Set to `true` to install the new service in 2.8 legacy compatibility mode.  (optional)
* force Boolean Set to `true` to force service install even if no service is installed under given mount.  (optional)
* no response value expected for this operation
* */
const _apiFoxxServicePATCH = ({ mount, teardown, setup, legacy, force }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        teardown,
        setup,
        legacy,
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
* Removes the service at the given mount path from the database and file system. Then installs the given new service at the same mount path. This is a slightly safer equivalent to performing an uninstall of the old service followed by installing the new service. The new service's main and script files (if any) will be checked for basic syntax errors before the old service is removed. The request body can be any of the following formats: - `application/zip`: a raw zip bundle containing a service - `application/javascript`: a standalone JavaScript file - `application/json`: a service definition as JSON - `multipart/form-data`: a service definition as a multipart form A service definition is an object or form with the following properties or fields: - *configuration*: a JSON object describing configuration values - *dependencies*: a JSON object describing dependency settings - *source*: a fully qualified URL or an absolute path on the server's file system When using multipart data, the *source* field can also alternatively be a file field containing either a zip bundle or a standalone JavaScript file. When using a standalone JavaScript file the given file will be executed to define our service's HTTP endpoints. It is the same which would be defined in the field `main` of the service manifest. If *source* is a URL, the URL must be reachable from the server. If *source* is a file system path, the path will be resolved on the server. In either case the path or URL is expected to resolve to a zip bundle, JavaScript file or (in case of a file system path) directory. Note that when using file system paths in a cluster with multiple Coordinators the file system path must resolve to equivalent files on every Coordinator. 
*
* mount String Mount path of the installed service. 
* teardown Boolean Set to `false` to not run the old service's teardown script.  (optional)
* setup Boolean Set to `false` to not run the new service's setup script.  (optional)
* legacy Boolean Set to `true` to install the new service in 2.8 legacy compatibility mode.  (optional)
* force Boolean Set to `true` to force service install even if no service is installed under given mount.  (optional)
* no response value expected for this operation
* */
const _apiFoxxServicePUT = ({ mount, teardown, setup, legacy, force }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        teardown,
        setup,
        legacy,
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
* Fetches the Swagger API description for the service at the given mount path. The response body will be an OpenAPI 2.0 compatible JSON description of the service API. 
*
* mount String Mount path of the installed service. 
* no response value expected for this operation
* */
const _apiFoxxSwaggerGET = ({ mount }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
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
* Runs the tests for the service at the given mount path and returns the results. Supported test reporters are: - *default*: a simple list of test cases - *suite*: an object of test cases nested in suites - *stream*: a raw stream of test results - *xunit*: an XUnit/JUnit compatible structure - *tap*: a raw TAP compatible stream The *Accept* request header can be used to further control the response format: When using the *stream* reporter `application/x-ldjson` will result in the response body being formatted as a newline-delimited JSON stream. When using the *tap* reporter `text/plain` or `text/_*` will result in the response body being formatted as a plain text TAP report. When using the *xunit* reporter `application/xml` or `text/xml` will result in the response body being formatted as XML instead of JSONML. Otherwise the response body will be formatted as non-prettyprinted JSON. 
*
* mount String Mount path of the installed service. 
* reporter String Test reporter to use.  (optional)
* idiomatic Boolean Use the matching format for the reporter, regardless of the *Accept* header.  (optional)
* filter String Only run tests where the full name (including full test suites and test case) matches this string.  (optional)
* no response value expected for this operation
* */
const _apiFoxxTestsPOST = ({ mount, reporter, idiomatic, filter }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        mount,
        reporter,
        idiomatic,
        filter,
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
  _apiFoxxCommitPOST,
  _apiFoxxConfigurationGET,
  _apiFoxxConfigurationPATCH,
  _apiFoxxConfigurationPUT,
  _apiFoxxDependenciesGET,
  _apiFoxxDependenciesPATCH,
  _apiFoxxDependenciesPUT,
  _apiFoxxDevelopmentDELETE,
  _apiFoxxDevelopmentPOST,
  _apiFoxxDownloadPOST,
  _apiFoxxGET,
  _apiFoxxPOST,
  _apiFoxxReadmeGET,
  _apiFoxxScriptsGET,
  _apiFoxxScriptsNamePOST,
  _apiFoxxServiceDELETE,
  _apiFoxxServiceGET,
  _apiFoxxServicePATCH,
  _apiFoxxServicePUT,
  _apiFoxxSwaggerGET,
  _apiFoxxTestsPOST,
};
