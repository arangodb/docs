package aql

import (
	"encoding/json"
	"os"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

var collectionsToIgnore = new(common.IgnoreCollections)

type AQLResponse struct {
	common.ExampleResponse
	BindVars map[string]interface{} `json:"bindVars"`
}

type Dataset struct {
	Create string `json:"create"`
	Remove string `json:"remove"`
}

var Datasets = make(map[string]Dataset)

func LoadDatasets(datasetsFile string) error {

	fileStream, err := os.ReadFile(datasetsFile)
	if err != nil {
		return err
	}

	err = json.Unmarshal(fileStream, &Datasets)
	common.Logger.Printf("DATASETS LOAD %s\n", Datasets)
	return err
}
