const path = require('path');

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: 8080,
  URL_PATH: 'http://localhost',
  BASE_VERSION: '/_db/_system',
  CONTROLLER_DIRECTORY: path.join(__dirname, 'controllers'),
  PROJECT_DIR: __dirname,
  CLIENT: "arangosh"    // who will talk with the stub, arangosh or normal http? the difference is in the controller handleRequest response
};
config.OPENAPI_YAML = path.join(config.ROOT_DIR, 'api', 'openapi.yaml');
config.FULL_PATH = `${config.URL_PATH}:${config.URL_PORT}/${config.BASE_VERSION}`;
config.FILE_UPLOAD_PATH = path.join(config.PROJECT_DIR, 'uploaded_files');

module.exports = config;
