# ArangoDB Docs Toolchain build

## Prerequisites:
-   **Go**
-   **Python 3**
-   **hugo**

## Build
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
