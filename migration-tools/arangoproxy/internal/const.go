package internal

const SWAGGER_INITIALIZE = `
{
	"swagger": "2.0",
	"info": {
		"description": "ArangoDB REST API Interface",
		"version": "1.0",
		"title": "ArangoDB",
		"license": {
			"name": "Apache License, Version 2.0"
		}
	},
	"basePath": "/",
	"definitions": {
		"ARANGO_ERROR": {
			"description": "An ArangoDB Error code",
			"type": "integer"
		},
		"ArangoError": {
			"description": "the arangodb error type",
			"properties": {
				"code": {
					"description": "the HTTP Status code",
					"type": "integer"
				},
				"error": {
					"description": "boolean flag to indicate whether an error occurred (*true* in this case)",
					"type": "boolean"
				},
				"errorMessage": {
					"description": "a descriptive error message describing what happened, may contain additional information",
					"type": "string"
				},
				"errorNum": {
					"description": "the ARANGO_ERROR code",
					"type": "integer"
				}
			}
		}
		
	},
	"paths" : {}
}
`
