package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/webui"
)

// Pre-Run Setup
func init() {
	var configFile string
	var help, cleanCache bool

	flag.StringVar(&configFile, "config", "./configs/local.json", "path of config file")
	flag.BoolVar(&help, "help", false, "Display help usage")
	flag.BoolVar(&cleanCache, "no-cache", false, "Reset cache")
	flag.Parse()

	err := config.LoadConfig(configFile)
	if err != nil {
		fmt.Printf("Error loading config: %s\n, aborting...", err.Error())
		os.Exit(1)
	}

	internal.InitLog(config.Conf.Log)

	common.Logger.Println(startupBanner)
	common.Logger.Print("./arangoproxy -help for help usage\n\n")
	common.Logger.Print("Init Setup\n")

	if help {
		common.Logger.Printf("Usage: ...\n")
		os.Exit(0)
	}

	if cleanCache {
		common.Logger.Printf("Deleting Cache\n")
		internal.CleanCache()
	}

	webui.InitSwaggerFile()
	common.Logger.Print("Setup Done\n---------\n")
}

func main() {
	common.Logger.Print("Available endpoints:\n - /js\n - /aql\n - /http-spec\n - /http-example\n")
	common.Logger.Printf("Starting Server at %s\n", config.Conf.WebServer)

	internal.StartController(config.Conf.WebServer)
}

var startupBanner = `
      _             _   _   _   _   _         
 /\  |_)  /\  |\ | /__ / \ |_) |_) / \ \/ \_/ 
/--\ | \ /--\ | \| \_| \_/ |   | \ \_/ /\  |  
											 
`
