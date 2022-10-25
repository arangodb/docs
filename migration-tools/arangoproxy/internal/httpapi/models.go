package httpapi

import (
	"io"
	"io/ioutil"
	"regexp"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"gopkg.in/yaml.v3"
)

var collectionsToIgnore = new(common.IgnoreCollections)

type HTTPSpecRequest struct {
	Filename string                 // The markdown file that triggered the http-spec call
	ApiSpec  map[string]interface{} `json:"spec"` // The swagger specification
}

type HTTPResponse struct {
	ApiSpec map[string]interface{} `json:"spec"`
}

// Reads the Hugo http-spec request, get the calling file and unmarshal the yaml spec
func ParseRequest(request io.Reader) (res HTTPSpecRequest, err error) {
	req, err := ioutil.ReadAll(request)
	if err != nil {
		common.Logger.Printf("Error reading request body: %s", err.Error())
		return
	}

	// Strip bad chars from the filename field
	dirtyChars := regexp.MustCompile(`(?ms)\\u001b\[1;36m\\"|"\\u001b\[0m`)
	filename := strings.Split(string(req), "\n")[0]
	res.Filename = dirtyChars.ReplaceAllString(filename, "")

	spec := strings.Replace(string(req), filename, "", -1)

	// Unmarshal the yaml openapi spec inside a map
	apiMap := make(map[string]interface{})
	err = yaml.Unmarshal([]byte(spec), &apiMap)
	if err != nil {
		common.Logger.Printf("[http/ParseRequest] Error Parsing yaml: %s\n", err.Error())
		return
	}

	res.ApiSpec = apiMap
	return res, err
}
