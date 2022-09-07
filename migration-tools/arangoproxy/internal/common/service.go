package common

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

const ()

type Service struct{}

func (service Service) ValidateExample(request Request) (bool, error) {
	// Get example name, check if file with function in it exists
	// if does not exists, create file, write function in it
	reqString, _ := json.Marshal(request)

	example, err := os.ReadFile(fmt.Sprintf("../examples/%s", request.Options.Name))
	if err != nil {
		fmt.Printf("Example is new, generating %s", request.Options.Name)
		err = service.GenerateNewExample(string(reqString), request.Options.Name)
		return false, err
	}

	// Example already exists, check if it has changed
	if strings.Contains(string(example), string(reqString)) {
		return false, nil
	}

	return true, nil
}

func (service Service) GenerateNewExample(request, filename string) error {
	file, err := os.Create(fmt.Sprintf("../examples/%s", filename))
	if err != nil {
		fmt.Printf("Create file error %s", err.Error())
		return fmt.Errorf("Cannot create file: %s", err.Error())
	}

	_, err = file.Write([]byte(request))
	fmt.Printf("File Write err %s", err)
	return err
}
