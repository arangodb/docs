package js

import (
	"fmt"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

type JSService struct {
	common.Service
}

func (service JSService) Execute(request common.Request) common.Response {
	fmt.Printf("JSService.Execute invoked\n")
	// Do some content stuff  ...

	_, err := service.ValidateExample(request)
	if err != nil {
		return common.Response{Input: "", Output: "", Error: err.Error()}
	}

	//if !toProcess {
	// ?
	//service.InvokeArangoSH(request)
	//return common.Response{}
	//}

	cmdResult := service.InvokeArangoSH(request)
	fmt.Printf("cmd res %s\n", cmdResult)

	return service.processOutput(request, cmdResult)
}

func (service JSService) processOutput(request common.Request, cmdResult map[string]string) common.Response {
	response := new(common.Response)

	for input, output := range cmdResult {
		if strings.Contains(output, "ArangoError") {
			// How do we want to handle error transmission?? is in the output already
		}

		if strings.Contains(string(request.Options.Render), "input") {
			response.Input = fmt.Sprintf("%s\n%s", response.Input, input)
		}

		if strings.Contains(string(request.Options.Render), "output") {
			response.Output = fmt.Sprintf("%s\n%s", response.Output, output)
		}
	}

	fmt.Printf("ProcessOutput res %s\n", response)

	return *response
}
