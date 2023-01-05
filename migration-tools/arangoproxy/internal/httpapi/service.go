package httpapi

import (
	"fmt"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/arangosh"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

type HTTPService struct {
	common.Service
}

func (service HTTPService) ExecuteHTTPExample(request common.Example) (res common.ExampleResponse, err error) {
	defer common.Recover(fmt.Sprintf("HTTPService.ExecuteHTTPExample(%s)", request.Code))

	commands := formatCommand(request.Code)
	repository, _ := common.GetRepository(request.Options.Release, request.Options.Version)

	//commands = utils.TryCatchWrap(commands)
	cmdOutput := arangosh.Exec(commands, repository)

	curlRequest, curlOutput, err := formatArangoResponse(cmdOutput, string(request.Options.Render))
	if err != nil {
		return
	}

	common.Logger.Printf("%s\n%s\n", curlRequest, curlOutput)

	res = *common.NewExampleResponse(curlRequest, curlOutput, request.Options)

	service.SaveCachedExampleResponse(request, res)

	return
}
