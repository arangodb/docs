package common

import (
	"crypto/tls"
	"fmt"
	"time"

	"github.com/arangodb/go-driver"
	"github.com/arangodb/go-driver/http"
)

type RepositoryType string

const (
	STABLE  RepositoryType = "stable"
	NIGHTLY RepositoryType = "nightly"
)

type Repository struct {
	Type    RepositoryType
	Version string
	driver.Client
}

var repositories map[string]Repository

func init() {
	repositories = make(map[string]Repository)
	Connect()
}

func Connect() {
	conn, err := http.NewConnection(http.ConnectionConfig{
		Endpoints: []string{"http://localhost:8529"},
		TLSConfig: &tls.Config{ /*...*/ },
	})
	if err != nil {
		fmt.Printf("Connection Error: %s\nRetrying in 5 secs", err.Error())
		time.Sleep(time.Second * 5)
		Connect()
	}

	// For every arango kind of instance, create connection and store it in map

	drvr, err := driver.NewClient(driver.ClientConfig{
		Connection:     conn,
		Authentication: driver.BasicAuthentication("user", "password"),
	})

	repo := Repository{
		STABLE,
		"3.10",
		drvr,
	}

	repositories[fmt.Sprintf("%s_%s", repo.Type, repo.Version)] = repo
}

/*
Command line to be used to invoke arangosh, taken from old toolchain
"${ARANGOSH}" \
    --configuration none \
    --server.endpoint tcp://127.0.0.1:${PORT} \
    --log.file ${LOGFILE} \
    --javascript.startup-directory js \
    --javascript.module-directory enterprise/js \
    --javascript.execute $SCRIPT \
    --javascript.allow-external-process-control true \
    --javascript.allow-port-testing true \
    --server.password "" \
    -- \
    "$@"
*/
