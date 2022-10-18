package webui

/*
	Package dedicated to creating the api-docs file to be served to the WebUI Team
*/

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"strings"
	"time"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/httpapi"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
	"github.com/dlclark/regexp2"
	"gopkg.in/yaml.v3"
)

// Create a base api-docs file with only the common schemas and empty paths
func InitSwaggerFile() {
	common.Logger.Print("Cleaning api-docs.json file\n")

	buf, err := ioutil.ReadFile(config.Conf.OpenApi.ComponentsFile)
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

	apiDocsMap["components"].(map[string]interface{})["schemas"] = components["schemas"].(map[string]interface{})
	apiDocsJson, err := json.Marshal(apiDocsMap)
	if err != nil {
		common.Logger.Printf("Cannot marshal apidocs file: %s\n", err.Error())
		os.Exit(1)
	}

	file, err := os.OpenFile(config.Conf.OpenApi.ApiDocsFile, os.O_TRUNC|os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		common.Logger.Printf("Cannot clean api-docs: %s\n", err.Error())
		os.Exit(1)
	}
	file.WriteString(string(apiDocsJson))
	file.Close()
}

func SpecListener(input <-chan httpapi.HTTPSpecRequest) {
	cacheLimit := 30
	cache := make([]httpapi.HTTPSpecRequest, 0, cacheLimit)
	cacheTimeout := time.Second * 5
	tick := time.NewTicker(cacheTimeout)

	for {
		select {
		case m := <-input:
			cache = append(cache, m)
			if len(cache) < cacheLimit {
				break
			}

			Write(cache)
			cache = make([]httpapi.HTTPSpecRequest, 0, cacheLimit)

			tick.Stop()
			tick = time.NewTicker(cacheTimeout)

		case <-tick.C:
			Write(cache)
			cache = make([]httpapi.HTTPSpecRequest, 0, cacheLimit)
		}
	}
}

// Load the api-docs content and add the new endpoint {spec} to it and add the entire content to file
func Write(specs []httpapi.HTTPSpecRequest) error {
	// Get all previous api-docs content
	apiDocsMap, err := utils.ReadFileAsMap(config.Conf.OpenApi.ApiDocsFile)
	if err != nil {
		common.Logger.Printf("[WEBUI-Write] Error read file as map: %s\n", err.Error())

		return err
	}

	for _, spec := range specs {
		// Parse the new provided endpoint
		path, method, err := getApiPathAndMethod(spec.ApiSpec)
		if err != nil {
			return errors.New("spec is malformed: " + err.Error())
		}

		// Add the new endpoint to the existing endpoints
		if existingPath, ok := apiDocsMap["paths"].(map[string]interface{})[path]; ok {
			existingPath.(map[string]interface{})[method] = make(map[string]interface{})
			existingPath.(map[string]interface{})[method] = spec.ApiSpec["paths"].(map[string]interface{})[path].(map[string]interface{})[method]
			existingPath.(map[string]interface{})[method].(map[string]interface{})["x-filename"] = spec.Filename
		} else {
			apiDocsMap["paths"].(map[string]interface{})[path] = make(map[string]interface{})
			apiDocsMap["paths"].(map[string]interface{})[path] = spec.ApiSpec["paths"].(map[string]interface{})[path]
			apiDocsMap["paths"].(map[string]interface{})[path].(map[string]interface{})["x-filename"] = spec.Filename

		}
	}
	// Write the endpoints to file
	return WriteAPI(apiDocsMap)
}

// Write the new entire swagger spec to the api-docs file
func WriteAPI(apiMap map[string]interface{}) error {
	apiFile, err := os.OpenFile(config.Conf.OpenApi.ApiDocsFile, os.O_WRONLY|os.O_APPEND|os.O_TRUNC, 0644)
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

	return nil
}

// Given the new endpoint specification, use regex to retrieve the path and the method of the endpoint
func getApiPathAndMethod(spec map[string]interface{}) (path string, method string, err error) {
	specJson, err := json.Marshal(spec)
	if err != nil {
		return
	}

	// Get the endpoint method
	methodRe := regexp2.MustCompile("\"(post|put|delete|get|patch)\"", 0)
	methodMatch, err := methodRe.FindStringMatch(string(specJson))
	if methodMatch == nil {
		err = errors.New("cannot find method")
		return
	}
	method = strings.Trim(methodMatch.String(), "\"")

	// Get the endpoint url
	pathRe := regexp2.MustCompile("(?<=paths\":{\").*((?=\":{\""+method+"\")|(?=\":{\"parameters\"))", 0)
	pathMatch, err := pathRe.FindStringMatch(string(specJson))
	if pathMatch == nil {
		err = errors.New("cannot find path")
		return
	}
	path = pathMatch.String()

	return
}
