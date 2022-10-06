package httpapi

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/dlclark/regexp2"
)

type HTTPService struct {
	common.Service
}

func (service HTTPService) ExecuteHTTPExample(request common.Example) (res common.ExampleResponse) {
	code := request.Code
	curlRequestRe := regexp.MustCompile("log.*Request.*")
	curlRequests := curlRequestRe.FindAllString(request.Code, -1)

	for _, curlRequest := range curlRequests {
		curlArgsRe := regexp2.MustCompile("(?<=\\().*(?=\\))", 0)
		curlArgs, err := curlArgsRe.FindStringMatch(curlRequest)
		if err != nil || curlArgs == nil {
			continue
		}

		args := strings.Split(curlArgs.String(), ",")
		method := strings.ReplaceAll(args[0], "'", "")
		method = strings.ReplaceAll(method, "\"", "")

		req := fmt.Sprintf("db._connection.%s(%s);", method, strings.Join(args[1:], ","))
		request.Code = strings.Replace(request.Code, curlRequest, req, -1)
	}

	request.Code = strings.ReplaceAll(request.Code, "assert", "print")
	request.Code = strings.ReplaceAll(request.Code, "logJsonResponse", "print")

	//fmt.Printf("INPUT %s\n", request.Code)

	res = service.ExecuteExample(request)
	res.Input = strings.Join(service.ParseInput(code), "\n")
	return
}

func (service HTTPService) ParseInput(input string) (res []string) {
	curlRequestRe := regexp.MustCompile("log.*Request.*")
	curlRequests := curlRequestRe.FindAllString(input, -1)

	for _, curlRequest := range curlRequests {
		fmt.Printf("CURL REQUREST %s\n", curlRequest)
		curlArgsRe := regexp2.MustCompile("(?<=\\().*(?=\\))", 0)
		curlArgs, err := curlArgsRe.FindStringMatch(curlRequest)
		if err != nil || curlArgs == nil {
			continue
		}

		fmt.Printf("CURLARGS %s\n", curlArgs.String())
		args := strings.Split(curlArgs.String(), ",")
		method := strings.ReplaceAll(args[0], "'", "")
		urlRe := regexp2.MustCompile("(?<=url = ).*(?=;)", 0)
		url, err := urlRe.FindStringMatch(input)
		if err != nil || url == nil {
			continue
		}

		curlString := "curl -X " + method + " --header 'accept: application/json' " + url.String()
		fmt.Printf("CURL STRING %s\n", curlString)
		res = append(res, curlString)
	}

	return
}

/*
func (service HTTPService) ExecuteHTTPExample(request common.Example) (res HTTPResponse) {
	arangoSHLines, httpLines := []string{}, []string{}
	curlRequestRe := regexp2.MustCompile("(?<=logCurlRequest\\().*(?=\\))", 0)
	curlRequest, err := curlRequestRe.FindStringMatch(request.Code)
	if err != nil || curlRequest.String() == "" {
		fmt.Printf("Cannot find curlRequest")
		return
	}

	codeLines := strings.Split(request.Code, ";\n")
	for _, line := range codeLines {
		fmt.Printf("\nLINE %s\n", line)
		if strings.Contains(line, "logJsonResponse") {
			// Token finale, invoca arangosh e http con gli array che hai
			fmt.Printf("LOGJSONRESPONSE\n")
			httpLines = append(httpLines, line+";\n")
			fmt.Printf("FINALE CODELINES %s\nHTTPLINES %s\n", arangoSHLines, httpLines)
			command := strings.Join(arangoSHLines, "")
			fmt.Printf("INVOCO ARANGOSH %s\n", command)
			output := service.InvokeArangoSH(command, config.Repository{})
			fmt.Printf("OUTPUTU ARANGOSH %s\n", output)
			continue
		}

		if strings.Contains(line, "logCurlRequest") || strings.Contains(line, "assert") {
			// Token di request, assembla la curl finale
			httpLines = append(httpLines, line+";\n")
			continue
		}

		lineSplit := strings.Split(line, " = ")[0]
		if len(strings.Split(line, " = ")) == 1 {
			arangoSHLines = append(arangoSHLines, line+";\n")
			continue
		}
		assignedVar := strings.ReplaceAll(lineSplit, " ", "")
		var re = regexp.MustCompile(`(?m)let|var`)
		assignedVar = re.ReplaceAllString(assignedVar, "")
		if strings.Contains(curlRequest.String(), assignedVar) {
			httpLines = append(httpLines, line+";\n")
			continue
		}
	}
	return
}
*/
