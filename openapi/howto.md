# ArangoDB OpenApi generator

## Generate api-docs.json
To generate the api-docs.json file run the following python script

    python3 generateApiDocs.py --src {path/to/docs/} --dst {where to store the api-docs file}

## Generate openapi server stub
To generate the stub you will need:

- npm
- api-docs.json file

To generate the needed code (Temporary workaround due to operationId issue)

    ./generateStubWorkaround.sh

This will create the ./arangostub folder

To run the server stub:

    cd arangostub/
    npm install && npm start