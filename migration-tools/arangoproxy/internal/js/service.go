package js

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

type JSService struct {
	common.Service
}

func (service JSService) Execute(request common.Request) error {
	fmt.Printf("JSService.Execute invoked\n")
	// Do some content stuff  ...

	toProcess, err := service.ValidateExample(request)
	if err != nil {
		return err
	}

	if toProcess {
		//Launch example, update file if output needed, otherwise only launch and check
	}

	service.InvokeArangoSH(request)
	return nil
}

func (service JSService) InvokeArangoSH(request common.Request) error {
	cmdName := "arangosh"
	cmdArgs := []string{"--configuration", "none",
		"--server.endpoint", "http+tcp://127.0.0.1:8529",
		"--server.password", "",
		"--javascript.startup-directory", "/usr/share/arangodb3/js"}
	cmd := exec.Command(cmdName, cmdArgs...)

	var out, er bytes.Buffer
	cmd.Stdin = strings.NewReader(request.Code)
	cmd.Stdout = &out
	cmd.Stderr = &er

	cmd.Run()

	fmt.Printf("StdErr %s StdOut %s", er.String(), out.String())
	return nil
}
