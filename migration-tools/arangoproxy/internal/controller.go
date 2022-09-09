package internal

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/js"
)

func StartController() {
	http.HandleFunc("/js", JSHandler)
	http.HandleFunc("/aql", TODOHandler)
	http.HandleFunc("/go", TODOHandler)
	http.HandleFunc("/java", TODOHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

var (
	JSService = js.JSService{}
)

func JSHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Print("JSHandler invoked")
	req, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("Error reading request body: %s", err.Error())
		return
	}

	request, err := common.ParseRequest(req, common.JS)
	if err != nil {
		fmt.Printf("%s", err.Error())
		return
	}

	resp := JSService.Execute(request)
	response, err := json.Marshal(resp)
	if err != nil {
		fmt.Printf("Error marshal %s", err.Error())
		return
	}
	fmt.Printf("Response %s", response)
	w.Write(response)
}

func TODOHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("TODO")
}
