package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

/*
	These functions are a porting from the arangodb old toolchain defined in exampleHeader.js and client/internal.js
	used for example generation
*/

const (
	DATASET_HEADER = `
let db = require('internal').db;
let examples = require("@arangodb/graph-examples/example-graph.js");
let user_examples = require("@arangodb/examples/example-users.js");`

	REMOVE_ALL_COLLECTIONS = `
for (let col of db._collections()) {
	if (!col.properties().isSystem) {
		db._drop(col._name);
	}
}
`
)

type Dataset struct {
	Create string `json:"create"`
	Remove string `json:"remove"`
}

var Datasets = make(map[string]Dataset)

func LoadDatasets(datasetsFile string) error {

	fileStream, err := ioutil.ReadFile(datasetsFile)
	if err != nil {
		return err
	}

	err = json.Unmarshal(fileStream, &Datasets)
	return err
}

func TryCatchWrap(code string) string {
	return fmt.Sprintf("try {\n%s\n} catch(err) {\n print('ERROR');\nprint('Arango Error ' + err.errorNum);\nprint('END ERR');\n }", code)
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

func RemoveAllTestCollections() string {
	return fmt.Sprintf(`
	for (let col of db._collections()) {

		if (!col.properties().isSystem && !toIgnore.includes(col._name)) {
			db._drop(col._name);
		}
	}
	`)
}

func DatasetExists(dataset string) string {
	createDSCmd := DATASET_HEADER + "\n" + Datasets[dataset].Create
	removeDSCmd := DATASET_HEADER + "\n" + Datasets[dataset].Remove
	iff := fmt.Sprintf(`const ds = %s;
	if (ds !== '') {
		%s
		%s
	  }`, dataset, removeDSCmd, createDSCmd)

	return iff
}

func GetCommonFunctions() (string, error) {
	file, err := os.ReadFile("../internal/utils/common.js")
	return string(file), err
}

func GetHTTPFunctions() (string, error) {
	file, err := os.ReadFile("../internal/utils/http.js")
	return string(file), err

}

func GetSetupFunctions() (string, error) {
	file, err := os.ReadFile("../internal/utils/setup.js")
	return string(file), err
}
