const jsYaml = require('js-yaml');
const fs = require('fs');


var schema = [];

function loadSchema(openApiYaml) {
    console.log("Loading schema");
    schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml));
    //console.log(schema)
}

function getSchema() {
    return schema
}

function getComponent(name) {
    return schema.components.schemas[name]
}

module.exports = {
    loadSchema,
    getSchema,
    getComponent,
  };