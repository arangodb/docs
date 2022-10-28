package common

import (
	"regexp"
	"strings"

	"github.com/dlclark/regexp2"
)

/*
	Functions to reformat inputs/outputs
*/

func FormatResponse(response *ExampleResponse) {
	codeComments := regexp.MustCompile(`(?m)~.*`) // Cut the ~... strings from the displayed input
	response.Input = codeComments.ReplaceAllString(response.Input, "")

	re := regexp.MustCompile(`(?m)^\s*$\r?\n`) // Cut all excessive spaces and newlines from output
	response.Input = re.ReplaceAllString(response.Input, "")
	if strings.Contains(string(response.Options.Render), "output") {
		response.Output = re.ReplaceAllString(response.Output, "")
		response.Output = strings.TrimPrefix(strings.TrimPrefix(response.Output, "\n"), "\r\n")
	}

	searchErrorsInResponse(response)
}

func searchErrorsInResponse(response *ExampleResponse) {
	errorRE := regexp2.MustCompile(`(?ms)(?<=ERROR\n).*(?=END ERR)`, 0)
	errorMatch, _ := errorRE.FindStringMatch(response.Output)
	if errorMatch == nil {
		return
	}

	response.Error = errorMatch.String()
}
