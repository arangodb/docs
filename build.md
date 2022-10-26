# ArangoDB Docs Toolchain build

## Prerequisites:
-   **Go**
-   **Python 3**
-   **hugo**

## Migration Wizard:
create a dedicated folder for testing the wizard process.

**Setup**

```
mkdir new-toolchain-test
cd new-tool-chain-test
new-toolchain-test> git clone git@github.com:arangodb/docs.git
new-toolchain-test> git checkout new-hugo-tooling-main
new-toolchain-test> cd docs/
new-toolchain-test/docs> cd migration-tools/migration
new-toolchain-test/docs/migration-tools/migration> ./clean.sh      // This will remove all media and content from a previous migration

new-toolchain-test/docs/migration-tools/migration> pip3 install pyyaml
```


**Execute migration**
```
// Execute the migration
new-toolchain-test/docs/migration-tools/migration> python3 migration.py --src {path to the old toolchain docs with /docs included} --dst {path of the new toolchain included /docs} --arango-main {path   where there is the main arango repository source code, needed to read the docublocks definitions}
```

**Start the arangoproxy server**
```
new-toolchain-test/docs/migration-tools/migration> cd ../arangoproxy/cmd/

//Check the arangoproxy config is right for you
new-toolchain-test/docs/migration-tools/arangoproxy/cmd> cat config/local.json        // make sure the arango instance url and ports are right, passwords etc..


// Start the golang webserver
new-toolchain-test/docs/migration-tools/arangoproxy/cmd> go run main.go -no-cache     // Warning this will erase all collections in your local arango instances and deletes the arangoproxy examples cache
```

**Start the hugo server**
```
// Open a new shell
new-toolchain-test/docs> cd site
new-toolchain-test/docs/site> hugo serve
```

Wait for the hugo serve build to complete, the site will be available at http://localhost:1313





## Build (no-migration)
-   Build and Start the arangoproxy webserver
    ```
    arangoproxy/cmd> go build -o arangoproxy
    arangoproxy/cmd> ./arangoproxy {flags}
    ```

-   Launch the hugo build command
    ```
    docs/site> hugo
    ```

The static html will be placed under **docs/site/public/**

For development purpose, it is suggested to use the **hugo serve** command for hot reload on changes, the runtime server will be available at **http://localhost:1313/**
