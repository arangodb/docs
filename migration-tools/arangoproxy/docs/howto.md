# ArangoProxy How To

## Build

Compile the arangoproxy webserver (Only when new code is available).

**Golang needs to be installed to perform the go build command**

```
arangoproxy/cmd> go build -o arangoproxy
```

Golang will automatically detect the hardware and produce the right executable inside the cmd folder

## Run

```
arangoproxy/cmd> ./arangoproxy {flags}
```

### Flags

- `-help`: show help usage
- `--config {filepath}`: load from config file (default: `configs/local.json`)
- `-no-cache`: clean cache files -- WARNING: All collections in the arango instances will be erased!

## Configuration

Configuration is loaded with json files.

A configuration file is made of (taken from `local.json`):

```json
{
    "webserver": ":8080",   // url+port the arangoproxy will be reachable
    "logFile": "log.txt",   // where to write logs
    "datasetsFile": ""      // Where datasets examples for aql are stored
    // OpenApi module configuration
    "openapi": {            
        // Filepath to write the swagger spec for th webui team
        "apiDocsFile": "./openapi/api-docs.json", 
        // Filepath where the http-spec endpoint will load common openapi schemas    
        "componentsFile": "./openapi/components.yaml" 
    },
    // Cache module configuration
    "cache": {    
        // Filepath where requests (examples input) cache will be saved          
        "requestsFile": "./cache/requests.txt", 
        // Filepath where responses (examples output) will be saved      
        "responsesFile": "./cache/responses.txt" 
    },
    // Arango instances configuration
    "repositories": [
        {
            "type": "local", // Instance type: e.g. nightly, stable ...
            "version": "3.10",
            "url": "http+tcp://127.0.0.1:8529",
            "password": ""
        }
    ]
}
```
