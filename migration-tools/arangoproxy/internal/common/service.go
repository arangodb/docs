package common

import (
	"bytes"
	"fmt"
	"os/exec"
	"regexp"
	"strings"

	"github.com/dlclark/regexp2"
)

const ()

type Service struct{}

func (service Service) ExecuteExample(request Example) (res ExampleResponse) {
	res.Input, res.Options = strings.ReplaceAll(request.Code, "\n     ", ""), request.Options

	if cached, err := service.IsCached(request); cached {
		if res, err = service.GetCachedExampleResponse(request); err == nil {
			Logger.Print("Returning cached ExampleResponse")
			return
		}
	}

	cmdOutput := service.InvokeArangoSH(request.Code)
	if strings.Contains(string(request.Options.Render), "output") {
		res.Output = fmt.Sprintf("%s\n%s", res.Output, cmdOutput)
	}

	re := regexp.MustCompile(`^\s*$\n`)
	res.Input = re.ReplaceAllString(res.Input, "")
	res.Output = re.ReplaceAllString(res.Output, "")

	service.SaveCachedExampleResponse(res)
	return
}

func (service Service) InvokeArangoSH(command string) (output string) {
	cmdName := "arangosh"
	cmdArgs := []string{"--configuration", "none",
		"--server.endpoint", "http+tcp://127.0.0.1:8529",
		"--server.password", "AlterBridge95!",
		"--javascript.startup-directory", "/usr/share/arangodb3/js"}
	cmd := exec.Command(cmdName, cmdArgs...)

	var out, er bytes.Buffer
	cmd.Stdin = strings.NewReader(command)
	cmd.Stdout = &out
	cmd.Stderr = &er

	cmd.Run()

	outputRegex := regexp2.MustCompile("(?<=Type 'tutorial' for a tutorial or 'help' to see common examples\n)[\\w\\s\n\\W]*(?=\n\n\n)", 0)
	cmdOutput, _ := outputRegex.FindStringMatch(out.String())
	if cmdOutput == nil {
		Logger.Print("[InvokeArangoSH] [WARNING] Output is empty!")
		return ""
	}

	return strings.ReplaceAll(cmdOutput.String(), "\n\n", "")
}
