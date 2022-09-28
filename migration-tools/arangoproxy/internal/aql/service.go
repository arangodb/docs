package aql

import (
	"fmt"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

type AQLService struct {
	common.Service
}

func (service AQLService) Execute(request common.Example) (res AQLResponse) {
	res.Input = request.Code
	request.Code = fmt.Sprintf("db._query(`%s`)", request.Code)

	exampleRes := service.ExecuteExample(request)

	res.BindVars = request.Options.BindVars
	res.Output, res.Error, res.Options = exampleRes.Output, exampleRes.Error, exampleRes.Options

	return
}
