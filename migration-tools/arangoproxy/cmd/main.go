package main

import (
	"flag"
	"io"
	"log"
	"os"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
)

var listener string
var Qualcosa string

func init() {
	logFile, _ := os.OpenFile("log.txt", os.O_CREATE|os.O_APPEND|os.O_RDWR, 0666)
	mw := io.MultiWriter(os.Stdout, logFile)
	common.Logger = log.New(mw, "", log.Ldate|log.Ltime)

	common.Logger.Println(startupBanner)
	common.Logger.Print("./arangoproxy -help for help usage\n\n")
	common.Logger.Print("Init Setup\n")

	var help, cleanCache bool

	flag.StringVar(&listener, "url", ":8080", "URL of webserver")
	flag.BoolVar(&help, "help", false, "Display help usage")
	flag.BoolVar(&cleanCache, "no-cache", false, "Reset cache")
	flag.Parse()

	if help {
		common.Logger.Printf("Usage: ...\n")
		os.Exit(0)
	}

	if cleanCache {
		common.Logger.Printf("Deleting Cache\n")
		os.OpenFile("./cache/requests.txt", os.O_TRUNC, 0644)
		os.OpenFile("./cache/responses.txt", os.O_TRUNC, 0644)
	}

	common.Logger.Print("Cleaning api-docs.json file\n")
	os.OpenFile("./api-docs.json", os.O_TRUNC, 0644)

	common.Logger.Print("Setup Done\n---------\n")
}

func main() {
	common.Logger.Print("Available endpoints:\n - /js\n - /aql\n - /http-spec\n - /http-example\n")
	common.Logger.Printf("Starting Server at %s\n", listener)

	internal.StartController(listener)
}

var startupBanner = `
      _             _   _   _   _   _         
 /\  |_)  /\  |\ | /__ / \ |_) |_) / \ \/ \_/ 
/--\ | \ /--\ | \| \_| \_/ |   | \ \_/ /\  |  
											 
`
