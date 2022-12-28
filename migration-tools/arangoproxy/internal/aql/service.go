package aql

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/arangosh"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
)

type AQLService struct {
	common.Service
}

func (service AQLService) Execute(request common.Example) (res AQLResponse) {
	defer common.Recover(fmt.Sprintf("AQLService.Execute(%s)", request.Code))
	commands := service.formatRequestCode(&request)

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
		createDSCmd := utils.Datasets[request.Options.Dataset].Create
		removeDSCmd := utils.Datasets[request.Options.Dataset].Remove
		commands = utils.DATASET_HEADER + "\n" + removeDSCmd + "\n" + createDSCmd + "\n" + commands + "\n" + removeDSCmd
	}

	// If xpError on, don't use try catch wrap
	//request.Code = utils.TryCatchWrap()

	// Example is not cached, execute it against the arango instance
	//commands = utils.TryCatchWrap(commands)
	cmdOutput := arangosh.Exec(commands, repository)

	res.ExampleResponse.Input, res.ExampleResponse.Options = request.Code, request.Options

	if strings.Contains(string(request.Options.Render), "output") {
		res.Output = fmt.Sprintf("%s\n%s", res.Output, cmdOutput)
	}

	common.FormatResponse(&res.ExampleResponse)

	service.SaveCachedExampleResponse(res.ExampleResponse)

	res.BindVars = request.Options.BindVars

	return
}

func (service AQLService) formatRequestCode(request *common.Example) string {
	commands := fmt.Sprintf("db._query(`%s`", request.Code)
	if len(request.Options.BindVars) != 0 {
		bindVarsJson, _ := json.Marshal(request.Options.BindVars)
		commands = fmt.Sprintf("%s, %s", commands, bindVarsJson)
	}

	commands = commands + ");"
	return commands
}
