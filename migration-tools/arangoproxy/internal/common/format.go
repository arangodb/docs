package common

import (
	"regexp"
	"strings"
)

/*
	Functions to reformat inputs/outputs
*/

func FormatResponse(response *ExampleResponse) {
	Logger.Printf("PRIMA DEL MATCH %s\n", response.Input)

	codeComments := regexp.MustCompile(`(?m)~.*`) // Cut the ~... strings from the displayed input
	response.Input = codeComments.ReplaceAllString(response.Input, "")
	Logger.Printf("PRIMA DEL MATCH %s\n", response.Input)

	re := regexp.MustCompile(`(?m)^\s*$\n`) // Cut all excessive spaces and newlines from output
	response.Input = re.ReplaceAllString(response.Input, "")
	if strings.Contains(string(response.Options.Render), "output") {
		response.Output = re.ReplaceAllString(response.Output, "")
		response.Output = strings.TrimPrefix(response.Output, "\n")
	}
}
