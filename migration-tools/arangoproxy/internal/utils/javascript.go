package utils

import "fmt"

/*
	These functions are a porting from the arangodb old toolchain defined in exampleHeader.js and client/internal.js
	used for example generation
*/

const (
	DATASET_HEADER = `
let db = require('internal').db;
let examples = require("@arangodb/graph-examples/example-graph.js");
let user_examples = require("@arangodb/examples/example-users.js");`

	LOGJSONRESPONSE = `
output = '';
var rawAppender = function(text) {output += text;};
var logJsonResponse = internal.appendJsonResponse(rawAppender, rawAppender);
logJsonResponse.apply(logJsonResponse, [response]);
print('RESPONSE');
output;
print('END RESP');
`

	REMOVE_ALL_COLLECTIONS = `
for (let col of db._collections()) {
	if (!col.properties().isSystem) {
		db._drop(col._name);
	}
}
`
)

func TryCatchWrap(code string) string {
	return fmt.Sprintf("try {\n%s\n} catch(err) {\n print('ERROR ' + err.errorNum + ' on ' + err.stack);\n }", code)
}

func Assert(condition string) string {
	return fmt.Sprintf(`
if (!%s) {
	throw new Error('assertion ' + %s + ' failed');
}`, condition, condition)
}

func LogCurlRequest(args string) string {
	curlRequest := fmt.Sprintf(`
print('REQUEST');
print([%s]);
print('END REQ');
var swallowText = function () {};
var curlRequestRaw = internal.appendCurlRequest(swallowText, swallowText, swallowText);
var response = curlRequestRaw.apply(curlRequestRaw, [%s]);`, args, args)

	return fmt.Sprintf("%s\n", curlRequest)
}

func RemoveAllTestCollections(collectionsToIgnore []string) string {
	return fmt.Sprintf(`
	for (let col of db._collections()) {

		if (!col.properties().isSystem) and (!%s.includes(col._name)) {
			db._drop(col._name);
		}
	}
	`, collectionsToIgnore)
}
