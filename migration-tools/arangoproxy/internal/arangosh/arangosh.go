package arangosh

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
	"github.com/dlclark/regexp2"
)

func Exec(command string, repository config.Repository) (output string) {
	commonFunctions, _ := utils.GetCommonFunctions()
	command = fmt.Sprintf("%s\n%s", commonFunctions, command)

	arangoSHBin := fmt.Sprintf("/home/arangodb%s/bin/arangosh", repository.Version)

	cmd := exec.Command("bash", "-c", arangoSHBin+" --server.endpoint "+repository.Url)

	var out, er bytes.Buffer
	cmd.Stdin = strings.NewReader(strings.ReplaceAll(command, "~", ""))
	cmd.Stdout = &out
	cmd.Stderr = &er

	cmd.Run()

	common.Logger.Printf("RES %s %s", out.String(), er.String())

	// Cut what is not the command output itself from the arangosh command invoke
	outputRegex := regexp2.MustCompile("(?ms)(?<=Type 'tutorial' for a tutorial or 'help' to see common examples).*(?=\r?\n\r?\n\r?\n)", 0)
	cmdOutput, _ := outputRegex.FindStringMatch(out.String())
	if cmdOutput == nil {
		common.Logger.Print("[InvokeArangoSH] [WARNING] Output is empty!")
		return ""
	}
	return cmdOutput.String()
}
