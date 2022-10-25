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

func formatCommand(code string) string {
	// Add js internal module import
	code = fmt.Sprintf("var internal = require('internal');\n%s", code)

	curlRequestRe := regexp.MustCompile(".*log.*Request.*")
	curlRequests := curlRequestRe.FindAllString(code, -1)

	for _, curlRequest := range curlRequests {
		curlArgsRe := regexp2.MustCompile("(?<=\\().*(?=\\))", 0)
		curlArgs, err := curlArgsRe.FindStringMatch(curlRequest)
		if err != nil || curlArgs == nil {
			continue
		}

		logCurlRequest := utils.LogCurlRequest(curlArgs.String())
		code = strings.Replace(code, curlRequest, logCurlRequest, -1)
	}

	code = strings.ReplaceAll(code, "assert", "print")

	logJsonResponseRE := regexp.MustCompile("log.*Response.*")
	if logJsonResponses := logJsonResponseRE.FindAllString(code, -1); logJsonResponses != nil {
		for _, logJsonResponse := range logJsonResponses {
			code = strings.Replace(code, logJsonResponse, utils.LOGJSONRESPONSE, -1)
		}
	}

	return code
}

func formatArangoResponse(arangoOutput, renderOption string) (input, output string, err error) {
	input, err = formatCurlRequest(arangoOutput)
	if err != nil {
		return
	}

	if strings.Contains(renderOption, "output") {
		output = formatCurlResponse(arangoOutput)
	}

	return
}

func formatCurlRequest(input string) (output string, err error) {
	requestRe, _ := regexp2.MustCompile(`(?ms)(?<=REQUEST)(.*?)(?=END REQ)`, 0).FindStringMatch(input)
	if requestRe == nil {
		return
	}

	re := regexp.MustCompile(`(?m)^\s*$\n`) // Cut all excessive spaces and newlines from output
	requestArgs := re.ReplaceAllString(requestRe.String(), "")

	args := make([]interface{}, 0)
	err = json.Unmarshal([]byte(requestArgs), &args)
	if err != nil {
		common.Logger.Printf("[HTTP] formatCurlRequest unmarshal error: %s\nRequest Args string: %s", err.Error(), requestArgs)
		return
	}

	curlString := fmt.Sprintf("curl -X %s -H 'accept: application/json' %s", args[0], args[1])
	if len(args) > 2 {
		postBody, _ := json.Marshal(args[2])
		curlString = fmt.Sprintf("%s\n-d %s ", curlString, postBody)
	}

	output = curlString
	return
}

func formatCurlResponse(input string) (output string) {
	responseRE := regexp2.MustCompile(`(?ms)(?<=RESPONSE\n).*(?=END RESP)`, 0)
	responseMatch, _ := responseRE.FindStringMatch(input)
	if responseMatch == nil {
		common.Logger.Printf("[HTTP] formatCurlResponse could not find Response part %s\n", input)
		return
	}

	return responseMatch.String()
}
