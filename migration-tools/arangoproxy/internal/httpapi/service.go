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

	// Check example is cached
	if cached, _ := service.IsCached(request); cached {
		if res, err = service.GetCachedExampleResponse(request); err == nil {
			//Logger.Print("Returning cached ExampleResponse")
			return
		}
	}

	commands := formatCommand(request.Code)
	repository, _ := common.GetRepository(request.Options.Release, request.Options.Version)

	commands = service.HandleIgnoreCollections(commands, collectionsToIgnore)

	//commands = utils.TryCatchWrap(commands)
	common.Logger.Printf("%s CODE %s\n", request.Options.Name, commands)
	cmdOutput := arangosh.Exec(commands, repository)
	common.Logger.Printf("%s OUTPUT %s\n\n", request.Options.Name, cmdOutput)

	curlRequest, curlOutput, err := formatArangoResponse(cmdOutput, string(request.Options.Render))
	if err != nil {
		return
	}

	res = *common.NewExampleResponse(curlRequest, curlOutput, request.Options)

	service.SaveCachedExampleResponse(res)

	return
}
