package internal

import (
	"io"
	"log"
	"os"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/common"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
)

func InitLog(logFilepath string) {
	logFile, _ := os.OpenFile(logFilepath, os.O_CREATE|os.O_APPEND|os.O_RDWR, 0666)
	mw := io.MultiWriter(os.Stdout, logFile)
	common.Logger = log.New(mw, "", log.Ldate|log.Ltime)
}

func CleanCache() {
	os.OpenFile(config.Conf.Cache.RequestsFile, os.O_TRUNC, 0644)
	os.OpenFile(config.Conf.Cache.ResponsesFile, os.O_TRUNC, 0644)
}
