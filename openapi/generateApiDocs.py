import argparse
import yaml
import os
import json
import re


##CMDLINE ARGS
parser = argparse.ArgumentParser(description='Optional app description')
parser.add_argument('--src', type=str,
                    help='docs/ folder')
parser.add_argument('--dst', type=str,
                    help='api-docs.json file destination')
args = parser.parse_args()

if args.src is None or args.dst is None:
	print("Args are required")
	exit(1)

# Handle Windows and trailing path separators
docs = args.src
dst = args.dst

apiDocsRes = {
	"openapi": "3.0.2",
	"info": {
		"description": "ArangoDB REST API Interface",
		"version": "1.0",
		"title": "ArangoDB",
		"license": {
			"name": "Apache License, Version 2.0"
		}
	},
	"components": {
		"schemas": {}
	},
	"paths" : {}
}

def generateAPIDocs():
	for root, dirs, files in os.walk(f"{docs}/site/content", topdown=True):
		for file in files:
			processFile(f"{root}/{file}".replace("\\", "/"))

def loadSchemas():
    try:
        file = open("./components.yaml", "r", encoding="utf-8")
        data = file.read()
        file.close()
    except Exception as ex:
        print(traceback.format_exc())
        raise ex

    components = yaml.safe_load(data)
    print(components)
    apiDocsRes["components"]["schemas"] = components["schemas"]
    

def processFile(filepath):
    try:
        file = open(filepath, "r", encoding="utf-8")
        data = file.read()
        file.close()
    except Exception as ex:
        print(traceback.format_exc())
        raise ex

    endpoints = re.findall(r"\`{3}http-spec(.*?)\`{3}", data, re.MULTILINE | re.DOTALL)
    for endpoint in endpoints:
        endpointDict = yaml.safe_load(endpoint)
        path = next(iter(endpointDict["paths"]))
        method = next(iter(endpointDict["paths"][path]))
        if not path in apiDocsRes["paths"]:
            apiDocsRes["paths"][path] = {}

        apiDocsRes["paths"][path][method] = endpointDict["paths"][path][method]

    dstFile = open(dst, "w")
    json.dump(apiDocsRes, dstFile)
    dstFile.close()

if __name__ == "__main__":
    loadSchemas()
    generateAPIDocs()


