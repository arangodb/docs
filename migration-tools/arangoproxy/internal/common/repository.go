package common

import (
	"fmt"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
)

var Repositories map[string]config.Repository

func InitRepositories() {
	Repositories = make(map[string]config.Repository)
	fmt.Printf("INIT REPOSITORIES CONF %s\n", config.Conf.Repositories)
	for _, repo := range config.Conf.Repositories {
		Repositories[fmt.Sprintf("%s_%s", repo.Type, repo.Version)] = repo
	}
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
