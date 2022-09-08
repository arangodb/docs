package js

import (
	"fmt"
	"testing"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

func TestInvokeArangoSH(t *testing.T) {
	service := JSService{}

	request := common.Request{
		Options: common.RequestOptions{Name: "test"},
		Code:    fmt.Sprintf(`db.coll.save({ foo: 123 });`),
		Type:    "js",
	}

	service.Execute(request)
}
