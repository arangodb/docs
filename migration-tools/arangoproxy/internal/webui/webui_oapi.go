package webui

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"strings"
	"sync"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
	"github.com/dlclark/regexp2"
	"gopkg.in/yaml.v3"
)

func InitSwaggerFile() {
	common.Logger.Print("Cleaning api-docs.json file\n")

	buf, err := ioutil.ReadFile("./openapi/components.yaml")
	if err != nil {
		common.Logger.Printf("Cannot read components file s: %s\n", err.Error())
		os.Exit(1)
	}

	components := make(map[string]interface{})
	err = yaml.Unmarshal(buf, &components)
	if err != nil {
		common.Logger.Printf("Cannot unmarshal components file: %s\n", err.Error())
		os.Exit(1)
	}

	apiDocsMap := make(map[string]interface{})
	err = json.Unmarshal([]byte(SWAGGER_INITIALIZE), &apiDocsMap)
	if err != nil {
		common.Logger.Printf("[WEBUI-Write] Error read file as map: %s\n", err.Error())
	}

	apiDocsMap["definitions"] = components["schemas"].(map[string]interface{})
	apiDocsJson, err := json.Marshal(apiDocsMap)
	if err != nil {
		common.Logger.Printf("Cannot marshal apidocs file: %s\n", err.Error())
		os.Exit(1)
	}

	file, err := os.OpenFile("./openapi/api-docs.json", os.O_TRUNC|os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		common.Logger.Printf("Cannot clean api-docs: %s\n", err.Error())
		os.Exit(1)
	}
	file.WriteString(string(apiDocsJson))
	file.Close()
}

func Write(spec map[string]interface{}, WriteWG *sync.WaitGroup) error {
	defer WriteWG.Done()

	apiDocsMap, err := utils.ReadFileAsMap("./api-docs.json")
	if err != nil {
		common.Logger.Printf("[WEBUI-Write] Error read file as map: %s\n", err.Error())

		return err
	}

	path, method, err := getApiPathAndMethod(spec)
	if err != nil {
		return errors.New("spec is malformed: " + err.Error())
	}

	if existingPath, ok := apiDocsMap["paths"].(map[string]interface{})[path]; ok {
		existingPath.(map[string]interface{})[method] = make(map[string]interface{})
		existingPath.(map[string]interface{})[method] = spec["paths"].(map[string]interface{})[path].(map[string]interface{})[method]
	} else {
		apiDocsMap["paths"].(map[string]interface{})[path] = make(map[string]interface{})
		apiDocsMap["paths"].(map[string]interface{})[path] = spec["paths"].(map[string]interface{})[path]
	}

	return WriteAPI(apiDocsMap)
}

func WriteAPI(apiMap map[string]interface{}) error {
	apiFile, err := os.OpenFile("./api-docs.json", os.O_WRONLY|os.O_APPEND|os.O_TRUNC, 0644)
	defer apiFile.Close()
	jsonEndpoint, err := json.Marshal(apiMap)
	if err != nil {
		common.Logger.Printf("[WEBUI] Error marshalling endpoint: %s\n", err.Error())
		return err
	}

	_, err = apiFile.WriteString(string(jsonEndpoint))
	if err != nil {
		common.Logger.Printf("[WEBUI] Error writing to file: %s\n", err.Error())
		return err
	}

	common.Logger.Printf("[WRITEAPI] Write ok\n")
	return nil
}

func getApiPathAndMethod(spec map[string]interface{}) (path string, method string, err error) {
	specJson, err := json.Marshal(spec)
	if err != nil {
		return
	}

	common.Logger.Print("SPEC %s\n", string(specJson))

	methodRe := regexp2.MustCompile("\"(post|put|delete|get|patch)\"", 0)
	methodMatch, err := methodRe.FindStringMatch(string(specJson))
	if methodMatch == nil {
		err = errors.New("cannot find method")
		return
	}

	method = strings.Trim(methodMatch.String(), "\"")
	common.Logger.Printf("[METHOD] %s\n", method)

	pathRe := regexp2.MustCompile("(?<=paths\":{\").*((?=\":{\""+method+"\")|(?=\":{\"parameters\"))", 0)
	pathMatch, err := pathRe.FindStringMatch(string(specJson))
	if pathMatch == nil {
		err = errors.New("cannot find path")
		return
	}
	path = pathMatch.String()
	common.Logger.Printf("[PATH] %s\n", path)

	return
}
