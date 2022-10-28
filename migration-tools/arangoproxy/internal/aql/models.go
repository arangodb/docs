package aql

import (
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

var collectionsToIgnore = new(common.IgnoreCollections)

type AQLResponse struct {
	common.ExampleResponse
	BindVars map[string]interface{} `json:"bindVars"`
}

func init() {
	collectionsToIgnore.ToIgnore = make(map[string]bool)
}
