package js

import (
	"fmt"

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

	if !toProcess {
		return nil
	}

	// Launch example
	return nil
}
