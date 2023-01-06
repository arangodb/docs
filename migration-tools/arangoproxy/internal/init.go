package internal

import (
	"fmt"
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
	os.OpenFile(config.Conf.Cache, os.O_TRUNC, 0644)
	for _, repository := range config.Conf.Repositories {
		arangosh.Exec(utils.REMOVE_ALL_COLLECTIONS, repository) // FIXME
		cmd, _ := utils.GetSetupFunctions()
		arangosh.Exec(cmd, repository)
	}
}

func InitRepositories() {
	common.Repositories = make(map[string]config.Repository)
	fmt.Printf("INIT REPOSITORIES CONF %s\n", config.Conf.Repositories)
	for _, repo := range config.Conf.Repositories {
		common.Repositories[fmt.Sprintf("%s_%s", repo.Type, repo.Version)] = repo
		cmd, _ := utils.GetSetupFunctions()
		arangosh.Exec(cmd, repo)
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
