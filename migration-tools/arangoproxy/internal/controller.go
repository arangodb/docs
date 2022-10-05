package internal

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/aql"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/httpapi"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/js"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/webui"
)

// Start and expose the webserver
func StartController(url string) {
	// Create routes
	http.HandleFunc("/js", JSHandler)
	http.HandleFunc("/http-spec", HTTPSpecHandler)
	http.HandleFunc("/http-example", HTTPExampleHandler)
	http.HandleFunc("/aql", AQLHandler)
	http.HandleFunc("/go", TODOHandler)
	http.HandleFunc("/java", TODOHandler)

	log.Fatal(http.ListenAndServe(url, nil))
}

// Dependency Injection
var (
	JSService   = js.JSService{}
	HTTPService = httpapi.HTTPService{}
	AQLService  = aql.AQLService{}

	APIWriteWG = sync.WaitGroup{} // WaitGroup is needed for concurrent writing on the api-docs.json being the HTTPSpecHandler multiplexed
)

// Handler for the js codeblocks
func JSHandler(w http.ResponseWriter, r *http.Request) {
	request, err := common.ParseExample(r.Body, common.JS)
	if err != nil {
		common.Logger.Printf("[js/CONTROLLER] Error parsing request %s\n", err.Error())
		return
	}

	//common.Logger.Printf("[js/CONTROLLER] Processing Example %s\n", request.Options.Name)

	resp := JSService.ExecuteExample(request)
	response, err := json.Marshal(resp)
	if err != nil {
		fmt.Printf("[js/CONTROLLER] Error marshalling response: %s\n", err.Error())
		return
	}

	w.Write(response)
}

// Handler for http-example codeblocks
func HTTPExampleHandler(w http.ResponseWriter, r *http.Request) {
	request, err := common.ParseExample(r.Body, common.HTTP)
	if err != nil {
		common.Logger.Printf("[http-example/CONTROLLER] Error parsing request %s\n", err.Error())
		return
	}

	//common.Logger.Printf("[http-example/CONTROLLER] Processing Example %s\n", request.Options.Name)

	resp := HTTPService.ExecuteExample(request)
	response, err := json.Marshal(resp)
	if err != nil {
		fmt.Printf("[http-example/CONTROLLER] Error marshalling response: %s\n", err.Error())
		return
	}
	w.Write(response)
}

// Handler for http-spec codeblocks
func HTTPSpecHandler(w http.ResponseWriter, r *http.Request) {
	request, err := httpapi.ParseRequest(r.Body)
	if err != nil {
		common.Logger.Printf("[http-spec/CONTROLLER] Error Parsing Request: %s\n", err.Error())
		x, _ := json.Marshal(httpapi.HTTPResponse{})
		w.Write(x)
		return
	}
	response := httpapi.HTTPResponse{ApiSpec: request.ApiSpec}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		common.Logger.Printf("[http-spec/CONTROLLER] Error Marshalling Response: %s\n", err.Error())
	}

	APIWriteWG.Wait()
	APIWriteWG.Add(1)
	// Write new specs to api-docs
	webui.Write(response.ApiSpec, request.Filename)
	APIWriteWG.Done()

	w.Write(jsonResponse)
}

// Handler for aql codeblocks
func AQLHandler(w http.ResponseWriter, r *http.Request) {
	request, err := common.ParseExample(r.Body, common.AQL)
	if err != nil {
		common.Logger.Printf("[aql/CONTROLLER] Error parsing request %s\n", err.Error())
		return
	}

	//common.Logger.Printf("[aql/CONTROLLER] Processing Example %s\n", request.Options.Name)

	resp := AQLService.Execute(request)
	response, err := json.Marshal(resp)
	if err != nil {
		fmt.Printf("[aql/CONTROLLER] Error marshalling response: %s\n", err.Error())
		return
	}
	w.Write(response)
}

// Empty handler
func TODOHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("TODO")
}
