package arangosh

import (
	"bytes"
	"os/exec"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
	"github.com/dlclark/regexp2"
)

func Exec(command string, repository config.Repository) (output string) {
	cmdName := "arangosh"
	cmdArgs := []string{
		//"--configuration", "none",
		//"--javascript.startup-directory", "/usr/share/arangodb3/js",
		"--server.endpoint", repository.Url,
	}
	if repository.Password == "" {
		cmdArgs = append(cmdArgs, "--server.authentication", "false")
	} else {
		cmdArgs = append(cmdArgs, "--server.password", repository.Password)
	}

	cmd := exec.Command(cmdName, cmdArgs...)

	var out, er bytes.Buffer
	cmd.Stdin = strings.NewReader(strings.ReplaceAll(command, "~", ""))
	cmd.Stdout = &out
	cmd.Stderr = &er

	cmd.Run()

	// Cut what is not the command output itself from the arangosh command invoke
	outputRegex := regexp2.MustCompile("(?ms)(?<=Type 'tutorial' for a tutorial or 'help' to see common examples).*(?=\r?\n\r?\n\r?\n)", 0)
	cmdOutput, _ := outputRegex.FindStringMatch(out.String())
	if cmdOutput == nil {
		common.Logger.Print("[InvokeArangoSH] [WARNING] Output is empty!")
		return ""
	}

	return cmdOutput.String()
}
