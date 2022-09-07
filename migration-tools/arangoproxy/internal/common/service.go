package common

import (
	"fmt"
	"os"
	"strings"
)

const ()

type Service struct{}

func (service Service) ValidateExample(request Request) (bool, error) {
	// Get example name, check if file with function in it exists
	// if does not exists, create file, write function in it
	example, err := os.ReadFile(fmt.Sprintf("../examples/%s/%s.%s", request.Type, request.Options.Name, request.Type))
	if err != nil {
		fmt.Printf("Example is new, generating %s", request.Options.Name)
		err = service.GenerateNewExample(request)
		return false, err
	}

	// Example already exists, check if it has changed
	if strings.Contains(string(example), request.String()) {
		fmt.Printf("Example has not changed")
		return false, nil
	}

	fmt.Printf("Example has changed, regenerating %s", request.Options.Name)
	err = service.GenerateNewExample(request)
	return true, err
}

func (service Service) GenerateNewExample(request Request) error {
	file, err := os.Create(fmt.Sprintf("../examples/%s/%s.%s", request.Type, request.Options.Name, request.Type))
	if err != nil {
		fmt.Printf("Create file error %s", err.Error())
		return fmt.Errorf("Cannot create file: %s", err.Error())
	}

	_, err = file.Write([]byte(request.String()))
	fmt.Printf("File Write err %s", err)
	return err
}
