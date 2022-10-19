package aql

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

type AQLService struct {
	common.Service
}

const (
	DATASET_HEADER = `let db = require('internal').db;
					  let examples = require("@arangodb/graph-examples/example-graph.js");
					  let user_examples = require("@arangodb/examples/example-users.js");`
)

func (service AQLService) Execute(request common.Example) (res AQLResponse) {
	service.formatRequestCode(&request)

	// Check example is cached
	if cached, _ := service.IsCached(request); cached {
		if cachedResp, err := service.GetCachedExampleResponse(request); err == nil {
			res.ExampleResponse = cachedResp
			return
		}
	}

	repository, _ := common.GetRepository(request.Options.Release, request.Options.Version)

	// Check if dataset to be used
	if request.Options.Dataset != "" {
		createDSCmd := DATASET_HEADER
		createDSCmd = DATASET_HEADER + "\n" + Datasets[request.Options.Dataset].Create
		service.InvokeArangoSH(createDSCmd, repository)
	}

	// If xpError on, don't use try catch wrap
	//request.Code = utils.TryCatchWrap()

	// Example is not cached, execute it against the arango instance
	cmdOutput := service.InvokeArangoSH(request.Code, repository)
	if strings.Contains(string(request.Options.Render), "output") {
		res.Output = fmt.Sprintf("%s\n%s", res.Output, cmdOutput)
	}

	res.Input, res.Options = request.Code, request.Options

	common.FormatResponse(&res.ExampleResponse)

	service.SaveCachedExampleResponse(res.ExampleResponse)

	res.BindVars = request.Options.BindVars
	return
}

func (service AQLService) formatRequestCode(request *common.Example) {
	request.Code = fmt.Sprintf("db._query(`%s`", request.Code)
	if len(request.Options.BindVars) != 0 {
		bindVarsJson, _ := json.Marshal(request.Options.BindVars)
		request.Code = fmt.Sprintf("%s, %s", request.Code, bindVarsJson)
	}

	request.Code = request.Code + ");"
}
