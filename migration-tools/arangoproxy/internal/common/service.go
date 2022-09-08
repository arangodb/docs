package common

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
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
