package webui

import (
	"encoding/json"
	"os"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

var docs map[string]interface{}

func Write(spec map[string]interface{}) error {
	apiDocs, err := os.OpenFile("./api-docs.json", os.O_APPEND|os.O_WRONLY, os.ModeAppend)
	if err != nil {
		common.Logger.Printf("[WEBUI] Error Opening api docs file: %s\n", err.Error())
		return err
	}

	endpoint := spec["paths"]
	jsonEndpoint, err := json.Marshal(endpoint)
	if err != nil {
		common.Logger.Printf("[WEBUI] Error marshalling endpoint: %s\n", err.Error())
		return err
	}
	modifiedEndpoint := strings.TrimPrefix(string(jsonEndpoint), "{")
	_, err = apiDocs.WriteString(modifiedEndpoint + ",")
	if err != nil {
		common.Logger.Printf("[WEBUI] Error writing to file: %s\n", err.Error())
	}
	return err
}
