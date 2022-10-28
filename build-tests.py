import os
import io
import re
import traceback
import yaml
import subprocess

launchFile = "./test.js"
fileStream = open(launchFile, "w")

def generateInternalJSFunctions():
    headerF = io.open("./exampleHeader.js", encoding="utf-8", newline=None)
    fileStream.write(headerF.read())
    headerF.close()


def processFiles():
    for root, dirs, files in os.walk(f"site/content", topdown=True):
        for file in files:
            parseFile(f"{root}/{file}")

def parseFile(filepath):
    buffer = ""
    try:
        file = open(filepath, "r")
        buffer = file.read()
        file.close()
    except Exception as ex:
        print(traceback.format_exc())
        raise ex

    examplesRE = re.findall(r"(?<=```)\w+\n---.*?(?=```)", buffer, re.MULTILINE | re.DOTALL)
    for example in examplesRE:
        exampleType = example.split("\n")[0]
        example = "\n".join(example.split("\n")[1:])
        exampleOptionsRE = re.search(r"---.*---", example, re.MULTILINE | re.DOTALL)
        args = {"name": "undefined"}
        if exampleOptionsRE:
            exampleOptions = exampleOptionsRE.group(0)
            exampleOptions = exampleOptions.replace("---", "")

            try:
                args = yaml.load(exampleOptions)
            except Exception:
                pass
            example = example.replace(exampleOptions, "").replace("------", "").replace("~", "")

        jsFunc = f'\n\
try{{\n\
(function(allErrors) {{\n\
 internal.startPrettyPrint(true);\n\
  internal.stopColorPrint(true);\n\
  var testName = "{args["name"]}";\n\
  var outputDir = "test";\n\
  var sourceFile = "sourceFile";\n\
  var startTime = time();\n\
  output = "";\n\
  var assert = function(a) {{ globalAssert(a, testName, sourceFile); }};\n\
    testFunc = function() {{\n\
        {example}\n\
    }}\n\
    rc = runTestFuncCatch(testFunc, testName, "");\n\
    allErrors += rc\n\
    \
}});\n\
}} catch(ex) {{\n\
    print("errors " + allErrors);\n\
}}\n\n'

        fileStream.write(jsFunc)
    return

def executeTests():
    command = f'\
arangosh \
    --configuration none \
    --server.endpoint tcp://127.0.0.1:8529\
    --log.file arangolog.txt \
    --console.audit-file boh\
    --log.level queries=trace --log.level info\
    --javascript.startup-directory /usr/share/arangodb3/js \
    --javascript.module-directory enterprise/js \
    --javascript.execute {launchFile} \
    --javascript.allow-external-process-control true \
    --javascript.allow-port-testing true \
    --server.password  \
    '

    arangosh = subprocess.run(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"arango output {arangosh.stdout}\n{arangosh.stderr}\n\n")
    errorFile = io.open("./arangolog.txt", encoding="utf-8", newline=None)
    print(f"Errors {errorFile.read()}")


if __name__ == "__main__":
    print("----- Starting example tests ------")
    generateInternalJSFunctions()
    processFiles()
    fileStream.write('print("Errori " + allErrors);')
    executeTests()
    print("----- End example tests ------")
    fileStream.close()