package httpapi

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
	"github.com/dlclark/regexp2"
)

type HTTPService struct {
	common.Service
}

func (service HTTPService) ExecuteHTTPExample(request common.Example) (res common.ExampleResponse) {
	// Add js internal module import
	request.Code = fmt.Sprintf("var internal = require('internal');\n%s", request.Code)

	curlRequestRe := regexp.MustCompile(".*log.*Request.*")
	curlRequests := curlRequestRe.FindAllString(request.Code, -1)

	for _, curlRequest := range curlRequests {
		curlArgsRe := regexp2.MustCompile("(?<=\\().*(?=\\))", 0)
		curlArgs, err := curlArgsRe.FindStringMatch(curlRequest)
		if err != nil || curlArgs == nil {
			continue
		}

		logCurlRequest := utils.LogCurlRequest(curlArgs.String())
		request.Code = strings.Replace(request.Code, curlRequest, logCurlRequest, -1)
	}

	request.Code = strings.ReplaceAll(request.Code, "assert", "print")

	logJsonResponseRE := regexp.MustCompile("log.*Response.*")
	logJsonResponses := logJsonResponseRE.FindAllString(request.Code, -1)

	for _, logJsonResponse := range logJsonResponses {
		newResponse := fmt.Sprintf("print('RESPONSE');\nprint(response);\nprint('END RESPONSE');\n")
		request.Code = strings.Replace(request.Code, logJsonResponse, newResponse, -1)
	}

	res = service.ExecuteExample(request)
	service.parseResponse(&res)
	return
}

func (service HTTPService) parseResponse(resp *common.ExampleResponse) {
	response := resp.Output

	requestRE := regexp2.MustCompile(`(?ms)(?<=REQUEST\n).*(?=END REQUEST)`, 0)
	requestArgs, _ := requestRE.FindStringMatch(response)
	if requestArgs == nil {
		return
	}

	//common.Logger.Printf("REQUEST ARTGS %s\n", requestArgs.String())
	args := make([]interface{}, 0)

	json.Unmarshal([]byte(requestArgs.String()), &args)
	//common.Logger.Printf("ARGS ARRAY %s\n", args)
	curlString := fmt.Sprintf("curl -X %s -H 'accept: application/json' %s", args[0], args[1])
	if len(args) > 2 {
		postBody, _ := json.Marshal(args[2])
		curlString = fmt.Sprintf("%s\n-d %s ", curlString, postBody)
	}

	resp.Input = curlString

	responseRE := regexp2.MustCompile(`(?ms)(?<=RESPONSE\n).*(?=END RESPONSE)`, 0)
	responseMatch, _ := responseRE.FindStringMatch(response)
	resp.Output = responseMatch.String()
}
