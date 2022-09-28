package httpapi

import (
	"io"
	"io/ioutil"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"gopkg.in/yaml.v3"
)

type HTTPSpecRequest struct {
	ApiSpec map[string]interface{} `json:"spec"`
}

type HTTPResponse struct {
	ApiSpec map[string]interface{} `json:"spec"`
}

func ParseRequest(request io.Reader) (res HTTPSpecRequest, err error) {
	req, err := ioutil.ReadAll(request)
	if err != nil {
		common.Logger.Printf("Error reading request body: %s", err.Error())
		return
	}
	apiMap := make(map[string]interface{})
	err = yaml.Unmarshal(req, &apiMap)
	if err != nil {
		common.Logger.Printf("[http/ParseRequest] Error Parsing yaml: %s\n", err.Error())
		return
	}

	res.ApiSpec = apiMap
	return res, err
}
