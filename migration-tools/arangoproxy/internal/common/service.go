package common

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
	"github.com/dlclark/regexp2"
)

const ()

type Service struct{}

// Get an example, check if is cached, if not execute the code against the arango instance chose in the request.Options
func (service Service) ExecuteExample(request Example) (res ExampleResponse) {

	// Check example is cached
	if cached, err := service.IsCached(request); cached {
		if res, err = service.GetCachedExampleResponse(request); err == nil {
			//Logger.Print("Returning cached ExampleResponse")
			return
		}
	}

	// If xpError on, don't use try catch wrap
	//request.Code = utils.TryCatchWrap()

	// Example is not cached, execute it against the arango instance
	repository, _ := GetRepository(request.Options.Release, request.Options.Version)
	cmdOutput := service.InvokeArangoSH(request.Code, repository)
	if strings.Contains(string(request.Options.Render), "output") {
		res.Output = fmt.Sprintf("%s\n%s", res.Output, cmdOutput)
	}

	res.Input, res.Options = request.Code, request.Options
	FormatResponse(&res)

	service.SaveCachedExampleResponse(res)
	return
}

func (service Service) InvokeArangoSH(command string, repository config.Repository) (output string) {
	command = strings.ReplaceAll(command, "~", "")
	cmdName := "arangosh"
	cmdArgs := []string{"--configuration", "none",
		"--server.endpoint", repository.Url,
		"--server.password", repository.Password,
		"--javascript.startup-directory", "/usr/share/arangodb3/js"}

	cmd := exec.Command(cmdName, cmdArgs...)

	var out, er bytes.Buffer
	cmd.Stdin = strings.NewReader(command)
	cmd.Stdout = &out
	cmd.Stderr = &er

	cmd.Run()

	// Cut what is not the command output itself from the arangosh command invoke
	outputRegex := regexp2.MustCompile("(?<=Type 'tutorial' for a tutorial or 'help' to see common examples\n)[\\w\\s\n\\W]*(?=\n\n\n)", 0)
	cmdOutput, _ := outputRegex.FindStringMatch(out.String())
	if cmdOutput == nil {
		Logger.Print("[InvokeArangoSH] [WARNING] Output is empty!")
		return ""
	}

	//return strings.ReplaceAll(cmdOutput.String(), "\n\n", "")
	fmt.Printf("Invoke ARANGO Output %s\n\n")
	return cmdOutput.String()
}
