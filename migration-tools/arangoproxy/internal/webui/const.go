package webui

// Base content for the api-docs file
const SWAGGER_INITIALIZE = `
{
	"openapi": "3.0.2",
	"info": {
		"description": "ArangoDB REST API Interface",
		"version": "1.0",
		"title": "ArangoDB",
		"license": {
			"name": "Apache License, Version 2.0"
		}
	},
	"basePath": "/",
	"components": {
		"schemas": {}
	},
	"paths" : {}
}
`
