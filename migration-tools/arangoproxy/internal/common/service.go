package common

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"os/exec"
	"regexp"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
	"github.com/dlclark/regexp2"
)

const ()

type Service struct{}

// Check in the examples.txt hashes file if this example's hash is the same as before
func (service Service) ValidateExample(request Request) (bool, error) {
	hashName := fmt.Sprintf("%s_%s_%s", request.Options.Name, request.Options.Release, request.Options.Version)
	hashFile, err := os.ReadFile("./examples.txt")
	if err != nil {
		fmt.Printf("Error opening file %s", err.Error())
		return false, err
	}

	exampleHash := utils.CalculateHash(request.String())

	if strings.Contains(string(hashFile), fmt.Sprintf("%s: %s", hashName, exampleHash)) {
		fmt.Print("Example has not changed")
		return false, nil // Example has not been modified
	}

	fmt.Print("Example has changed")
	f, err := os.OpenFile("./examples.txt",
		os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println(err)
	}
	defer f.Close()
	_, err = f.WriteString(fmt.Sprintf("%s: %s\n", hashName, exampleHash))
	fmt.Printf("error %s", err)
	return true, nil
}

// TODO: a bit chaotic, to refactor
func (service Service) InvokeArangoSH(request Request) map[string]string {
	cmdName := "arangosh"
	cmdArgs := []string{"--configuration", "none",
		"--server.endpoint", "http+tcp://127.0.0.1:8529",
		"--server.password", "AlterBridge95!",
		"--javascript.startup-directory", "/usr/share/arangodb3/js"}
	cmd := exec.Command(cmdName, cmdArgs...)

	var out, er bytes.Buffer
	cmd.Stdin = strings.NewReader(request.Code)
	cmd.Stdout = &out
	cmd.Stderr = &er

	cmd.Run()

	outputRegex := regexp2.MustCompile("(?<=Type 'tutorial' for a tutorial or 'help' to see common examples\n)[\\w\\s\n\\W]*(?=\n\n\n)", 0)
	cmdOutput, _ := outputRegex.FindStringMatch(out.String())

	return service.FormatInputOutput(request.Code, cmdOutput.String())
}

func (service Service) FormatInputOutput(input string, output string) map[string]string {
	outputSplitted := strings.Split((output), "\n\n")

	inputSplit := strings.Split(input, ";")

	resultTrace := make(map[string]string)
	i := 0

	for _, elem := range inputSplit {
		if strings.HasPrefix(elem, "\nlet") || elem == "" {
			resultTrace[fmt.Sprintf("%d - %s;", i, elem)] = ""
			continue
		}

		outputElem := outputSplitted[i]

		errorRegex, _ := regexp.Compile("ArangoError.*")
		if errorRegex.FindString(outputElem) != "" {
			resultTrace[fmt.Sprintf("%d - %s;", i, elem)] = errorRegex.FindString(outputElem)
			i = i + 1
			continue
		}

		resultTrace[fmt.Sprintf("%d - %s;", i, elem)] = outputSplitted[i]
		i = i + 1
	}

	return resultTrace
}
