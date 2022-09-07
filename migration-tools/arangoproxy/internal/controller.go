package internal

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/js"
)

func StartController() {
	http.HandleFunc("/js", JSHandler)

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

	request, err := common.ParseRequest(req)
	if err != nil {
		fmt.Printf("%s", err.Error())
		return
	}

	JSService.Execute(request)
}
