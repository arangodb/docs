import re
import json
import yaml
import traceback
from definitions import *
import globals

swaggerBaseTypes = [
    'object',
    'array',
    'number',
    'integer',
    'long',
    'float',
    'double',
    'string',
    'byte',
    'binary',
    'boolean',
    'date',
    'dateTime',
    'password',
    'int64'
]

def str_presenter(dumper, data):
    """configures yaml for dumping multiline strings
    Ref: https://stackoverflow.com/questions/8640959/how-can-i-control-what-scalar-form-pyyaml-uses-for-my-data"""
    if data.count('\n') > 0:  # check for multiline string
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)

yaml.add_representer(str, str_presenter)
yaml.representer.SafeRepresenter.add_representer(str, str_presenter) # to use with safe_dum


def initBlocksFileLocations():
    with open(globals.ALL_COMMENTS_FILE, 'r', encoding="utf-8") as apiDocs:
        data = apiDocs.read()

        docuBlocks = re.findall(r"<!-- filename: .* -->\n@startDocuBlock .*", data)
        for docuBlock in docuBlocks:
            fileLocation = re.findall(r"(?<=<!-- filename: ).*(?= -->)", docuBlock)[0]
            fileLocation = re.sub(r".*(?=\/Documentation)", globals.ARANGO_MAIN, fileLocation, 1, re.MULTILINE)

            blockName = re.findall(r"(?<=@startDocuBlock ).*", docuBlock)[0]

            globals.blocksFileLocations[blockName] = fileLocation
    return

def migrateHTTPDocuBlocks(paragraph):
    docuBlockNameRe = re.findall(r"(?<={% docublock ).*(?= %})", paragraph)
    globals.httpDocuBlocksCount = globals.httpDocuBlocksCount + len(docuBlockNameRe)
    for docuBlock in docuBlockNameRe:
        if 'errorCodes' in docuBlock: ## TODO: Implement
            continue

        docuBlockFile =globals.blocksFileLocations[docuBlock]
        print(docuBlockFile)
        tag = docuBlockFile.split("/")[len(docuBlockFile.split("/"))-2]
        try:
            docuBlockFile = open(docuBlockFile, "r", encoding="utf-8").read()
        except FileNotFoundError:
            continue
        
        declaredDocuBlocks = re.findall(r"(?<=@startDocuBlock )(.*?)@endDocuBlock", docuBlockFile, re.MULTILINE | re.DOTALL)

        for block in declaredDocuBlocks:
            if block.startswith(docuBlock):
                if docuBlock == "documentRevision":
                    revisionContent = re.search(r"(?<=documentRevision\n\n)(.*?)", block, re.MULTILINE | re.DOTALL).group(0)
                    paragraph = paragraph.replace("{% docublock "+ docuBlock + " %}", revisionContent)
                    continue

                newBlock = processHTTPDocuBlock(block, tag)

                paragraph = paragraph.replace("{% docublock "+ docuBlock + " %}", newBlock)
                #print(paragraph)

    return paragraph

def processHTTPDocuBlock(docuBlock, tag):
    blockExamples = processExamples(docuBlock)

    docuBlock = re.sub(r"@EXAMPLES.*", "", docuBlock, 0, re.MULTILINE | re.DOTALL)
    restBlocks = docuBlock.split("@REST")
    newBlock = {"openapi": "3.0.2", "paths": {}}
    url, verb, currentRetStatus = "", "", 0

    for block in restBlocks:
        #print(block)
        try:
            if re.search(r"HEADER{", block):
                url, verb = processHeader(block, newBlock)     

            if block.startswith("DESCRIPTION"):
                newBlock["paths"][url][verb]["description"] = block.replace("DESCRIPTION\n", "").rstrip("}")

            elif re.search(r".*PARAM{", block):
                processParameters(block, newBlock["paths"][url][verb])

            if re.search(r"RETURNCODE{", block):
                currentRetStatus = processResponse(block, newBlock["paths"][url][verb])

            if re.search(r"REPLYBODY{", block):
                processResponseBody(block, newBlock["paths"][url][verb]["responses"], currentRetStatus)

            if block.startswith("STRUCT"):
                processComponents(block)
    
        except Exception as ex:
            print(f"Exception occurred for block {block}\n{ex}")
            traceback.print_exc()
            exit(1)
    newBlock["paths"][url][verb]["tags"] = [tag]
    yml = render_yaml(newBlock)

    exampleCodeBlocks = ""
    if len(blockExamples) > 0:
        exampleCodeBlocks = parse_examples(blockExamples)

    return yml + "\n" + exampleCodeBlocks


### BLOCK PROCESSING    

def processExamples(docuBlock):
    examples = re.findall(r"(?<=@EXAMPLE_)(.*?)(?=@END_EXAMPLE_)", docuBlock, re.MULTILINE | re.DOTALL)
    blockExamples = []

    for block in examples:
        exampleBlock = {'options': {"draft": False}, 'code': ""}
        exampleType = re.search(r"ARANGO.*(?={)", block).group(0)
        if exampleType == "ARANGOSH_RUN":
            exampleBlock["options"]["render"] = "input"
        elif exampleType == "ARANGOSH_OUTPUT":
            exampleBlock["options"]["render"] = "input/output"

        exampleName = re.search(r"(?<={).*(?=})", block).group(0)
        exampleBlock["options"]["name"] = exampleName
        exampleBlock["options"]["release"] = "stable"
        exampleBlock["options"]["version"] = "3.10"
        code = re.search(r"(?<="+exampleType+"{"+exampleName+"}\n).*", block, re.MULTILINE | re.DOTALL).group(0)
        code = code.replace("|", " ")
        exampleBlock["code"] = code

        if "logJsonResponse" in code:
            exampleBlock["options"]["render"] = "input/output"


        blockExamples.append(exampleBlock)

    return blockExamples

def processHeader(docuBlock, newBlock):
    headerRe = re.search(r"(?<=HEADER){.*}", docuBlock).group(0)
    headerSplit = headerRe.split(",")
    try:
        url, verb, desc = headerSplit[0].split(" ")[1], headerSplit[0].split(" ")[0].strip("{").lower(), headerSplit[1].replace("}", "")
        newBlock["paths"][url] = {verb: {"description": desc}}
        newBlock["paths"][url][verb]["operationId"] = headerSplit[2].replace("}", "")
    except IndexError:
        pass 

    return url, verb

def processParameters(docuBlock, newBlock):
    paramType = re.search(r".*{", docuBlock).group(0).strip("{")

    if "BODYPARAM" in paramType:
        processRequestBody(docuBlock, newBlock)
        return

    paramBlock = {}
    
    p = f"(?<={paramType})"
    paramRe = re.search(r"(?<="+paramType+"{)" + r".*(?=})", docuBlock).group(0)
    paramSplit = paramRe.split(",")
    try:
        paramBlock["name"] = paramSplit[0]
        paramBlock["schema"] = {"type": paramSplit[1]}
        paramBlock["required"] = True if paramSplit[2] == "required" else False
        if paramSplit[3] != "" and not paramSplit[3] in swaggerBaseTypes:
            paramBlock["schema"] = {"$ref": f"#/components/schemas/{paramSplit[3]}" }
    except IndexError:
        pass
    
    docuBlock = re.sub(p + r".*}", '', docuBlock)
    paramBlock["description"] = re.sub(r".*PARAM", '', docuBlock).replace(":", "")

    if "URLPARAM" in paramType:
        paramBlock["in"] = "path"
    elif "QUERYPARAM" in paramType:
        paramBlock["in"] = "query"
    elif "HEADERPARAM" in paramType:
        paramBlock["in"] = "header"

    if "parameters" not in newBlock:
        newBlock["parameters"] = []

    newBlock["parameters"].append(paramBlock)

def processRequestBody(docuBlock, newBlock):
    paramRe = re.search(r"(?<=BODYPARAM{).*(?=})", docuBlock).group(0)
    paramSplit = paramRe.split(",")
    name = paramSplit[0]
    paramBlock = {}
    paramBlock[name] = {}
    try:
        paramBlock[name]["type"] = paramSplit[1]
        if paramSplit[3] != "" and not paramSplit[3] in swaggerBaseTypes:
            paramBlock[name]["schema"] = {"$ref": f"#/components/schemas/{paramSplit[3]}" }
    except IndexError:
        pass
    
    docuBlock = re.sub(r"BODYPARAM{.*}", '', docuBlock)
    paramBlock[name]["description"] = re.sub(r".*PARAM", '', docuBlock).replace(":", "")

    if "requestBody" not in newBlock:
        newBlock["requestBody"] = {"content": {"application/json": {"schema": {"type": "object", "properties": {}, "required": []}}}}


    newBlock["requestBody"]["content"]["application/json"]["schema"]["properties"][name] = paramBlock[name]
    if paramSplit[2] == "required":
            newBlock["requestBody"]["content"]["application/json"]["schema"]["required"].append(name)
    return

def processResponse(docuBlock, newBlock):
    blockSplit = docuBlock.split("\n")
    status = re.search(r"(?<=RETURNCODE{).*(?=})", blockSplit[0]).group(0)
    description = "".join(blockSplit[1:]).strip("@endDocuBlock").replace(":", "")

    retBlock = {"description": description}

    if "responses" not in newBlock:
        newBlock["responses"] = {}

    newBlock["responses"][status] = retBlock
    return status

def processResponseBody(docuBlock, newBlock, statusCode):
    replyBlock = {}
    
    paramRe = re.search(r"(?<=REPLYBODY{).*(?=})", docuBlock).group(0)
    paramSplit = paramRe.split(",")
    name = paramSplit[0].strip("{")
    try:
        replyBlock["type"] = paramSplit[1]
        if paramSplit[3] != "":
            replyBlock["schema"] = {"$ref": f"#/components/schemas/{paramSplit[3]}"}
    except IndexError:
        pass
    
    docuBlock = re.sub(r"(?<=REPLYBODY){.*}", '', docuBlock)
    replyBlock["description"] = re.sub(r"REPLYBODY", '', docuBlock).replace(":", "")

    if name == "" and "schema" in replyBlock:
        newBlock[statusCode]["content"] = {"application/json": {"schema": replyBlock["schema"]}}
        return

    if not "content" in newBlock:
        newBlock[statusCode]["content"] = {"application/json": {"schema": {"type": "object", "properties": {}, "required": []}}}

    newBlock[statusCode]["content"]["application/json"]["schema"]["properties"][name] = replyBlock
    if paramSplit[2] == "required":
            newBlock[statusCode]["content"]["application/json"]["schema"]["required"].append(name)
    return


def processComponents(block):
    argsRe = re.search(r"(?<={).*(?=})", block).group(0)
    args = argsRe.split(",") 
    
    description = "".join(block.split("\n")[1:])
    structName, paramName, paramType, paramRequired, paramSubtype = args[1], args[0], args[2], args[3], args[4]
    structProperty = {
        "type": paramType,
        "format": paramSubtype,
        "description": description,
    }    

    if structName in globals.components["schemas"]:
        globals.components["schemas"][structName]["properties"][paramName] = structProperty
        return

    globals.components["schemas"][structName] = {
        "type": "object",
        "properties": {paramName: structProperty}
            }
    return



####    YAML WRITERS

def render_yaml(block):
    blockYaml = yaml.dump(block, sort_keys=False, default_flow_style=False)
    res = f'```http-spec\n\
{blockYaml}\
```\n'
    res = res.replace("@endDocuBlock", "")   
    #res = res.replace("\n\n", "")  
    return re.sub(r"^\s*$\n", '', res, 0, re.MULTILINE | re.DOTALL)

def parse_examples(blockExamples):
    res = '**Examples**\n'
    for example in blockExamples:
        exampleOptions = yaml.dump(example["options"], sort_keys=False, default_flow_style=False)
        codeBlock = f'\n\
{{{{< version "3.10" >}}}}\n\
{{{{< tabs >}}}}\n\
{{{{% tab name="curl" %}}}}\n\
```http-example\n\
---\n\
{exampleOptions}\n\
---\n\
{example["code"]}\n\
```\n\
{{{{% /tab %}}}}\n\
{{{{< /tabs >}}}}\n\
{{{{< /version >}}}}\n\
'
        res = res + "\n" + codeBlock
    return re.sub(r"^\s*$\n", '', res, 0, re.MULTILINE | re.DOTALL)


def write_components_to_file():
    globals.components["schemas"] = definitions
    with open(globals.OAPI_COMPONENTS_FILE, 'w', encoding="utf-8") as outfile:
        yaml.dump(globals.components, outfile, sort_keys=False, default_flow_style=False)

if __name__ == "__main__":
    initBlocksFileLocations()