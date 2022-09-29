package webui

import (
	"encoding/json"
	"errors"
	"os"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
	"github.com/dlclark/regexp2"
)

func WriteX(spec map[string]interface{}) error {
	apiDocs, err := os.OpenFile("./api-docs.json", os.O_APPEND|os.O_WRONLY|os.O_TRUNC, os.ModeAppend)
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

func Write(spec map[string]interface{}) error {
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
		common.Logger.Printf("EXISTING PATH %s\n", existingPath)
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
	jsonEndpoint, err := json.Marshal(apiMap)
	if err != nil {
		common.Logger.Printf("[WEBUI] Error marshalling endpoint: %s\n", err.Error())
		return err
	}

	_, err = apiFile.WriteString(string(jsonEndpoint))
	if err != nil {
		common.Logger.Printf("[WEBUI] Error writing to file: %s\n", err.Error())
	}

	return err
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

	pathRe := regexp2.MustCompile("(?<=paths\":{\").*(?=\":{\""+method+"\")", 0)
	pathMatch, err := pathRe.FindStringMatch(string(specJson))
	if pathMatch == nil {
		err = errors.New("cannot find path")
		return
	}
	path = pathMatch.String()
	common.Logger.Printf("[PATH] %s\n", path)

	return
}
