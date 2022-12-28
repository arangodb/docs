package internal

import (
	"io"
	"log"
	"net"
	"os"
	"time"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/arangosh"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
)

func InitLog(logFilepath string) {
	logFile, _ := os.OpenFile(logFilepath, os.O_CREATE|os.O_APPEND|os.O_RDWR, 0666)
	mw := io.MultiWriter(os.Stdout, logFile)
	common.Logger = log.New(mw, "", log.Ldate|log.Ltime)
}

func CleanCache() {
	os.OpenFile(config.Conf.Cache.RequestsFile, os.O_TRUNC, 0644)
	os.OpenFile(config.Conf.Cache.ResponsesFile, os.O_TRUNC, 0644)
	for _, repository := range config.Conf.Repositories {
		arangosh.Exec(utils.REMOVE_ALL_COLLECTIONS, repository) // FIXME
		cmd, _ := utils.GetSetupFunctions()
		arangosh.Exec(cmd, repository)
	}
}

func RepositoriesHealthCheck() {
	for _, repository := range config.Conf.Repositories {
		common.Logger.Printf("HEALTH CHECK %s\n", repository.Type)
		_, err := net.Dial("tcp", repository.Url)
		for err != nil {
			common.Logger.Printf("ERROR HEALTH CHECK ARANGO INTSANCE %s\n", repository.Type)
			time.Sleep(time.Second * 3)
			_, err = net.Dial("tcp", repository.Url)
		}
	}
}
