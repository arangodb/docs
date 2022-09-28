package aql

import "github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"

type AQLResponse struct {
	common.ExampleResponse
	BindVars map[string]interface{} `json:"bindVars"`
}
