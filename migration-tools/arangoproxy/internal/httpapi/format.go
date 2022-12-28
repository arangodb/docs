package httpapi

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
	"github.com/dlclark/regexp2"
)

func formatCommand(code string) string {
	httpFuncs, err := utils.GetHTTPFunctions()
	if err != nil {
		common.Logger.Printf("Error reading functions: %s\n", err.Error())
	}
	code = fmt.Sprintf("%s\n%s\n", httpFuncs, code)

	multiLineRE := regexp.MustCompile(`(?m)[+]\s*\n*`)
	allMultiLines := multiLineRE.FindAllString(code, -1)
	for _, multiLine := range allMultiLines {
		noMoreMultiline := strings.ReplaceAll(multiLine, "\n", "")
		code = strings.Replace(code, multiLine, noMoreMultiline, -1)
	}

	return code
}

func formatArangoResponse(arangoOutput, renderOption string) (input, output string, err error) {
	curlRE := regexp2.MustCompile(`(?ms)REQ(.*?)ENDREQ`, 0)
	curlRequests := utils.Regexp2FindAllString(curlRE, arangoOutput)
	for _, curl := range curlRequests {
		input = fmt.Sprintf("%s\n%s", input, curl)
	}

	input = strings.ReplaceAll(input, "REQ", "")
	input = strings.ReplaceAll(input, "ENDREQ", "")
	input = strings.ReplaceAll(input, "END", "\n")

	respRE := regexp2.MustCompile(`(?ms)RESP(.*?)ENDRESP`, 0)
	responses := utils.Regexp2FindAllString(respRE, arangoOutput)
	for _, response := range responses {
		output = fmt.Sprintf("%s\n%s", output, response)
	}

	output = strings.ReplaceAll(output, "RESP", "")
	output = strings.ReplaceAll(output, "ENDRESP", "")
	output = strings.ReplaceAll(output, "END", "\n")

	return input, output, nil
}
