import re
import json
import yaml

# HTTP DocuBlocks
apiDocsFile = "/home/dan/work/projects/old-arango-docs/docs/3.10/generated/allComments.txt"
blocksFileLocations = {}

def initBlocksFileLocations():
    with open(apiDocsFile, 'r') as apiDocs:
        data = apiDocs.read()

        docuBlocks = re.findall(r"<!-- filename: .* -->\n@startDocuBlock .*", data)
        for docuBlock in docuBlocks:
            fileLocation = re.findall(r"(?<=<!-- filename: ).*(?= -->)", docuBlock)[0]
            blockName = re.findall(r"(?<=@startDocuBlock ).*", docuBlock)[0]

            blocksFileLocations[blockName] = fileLocation

    return

def migrateHTTPDocuBlocks(paragraph):
    docuBlockNameRe = re.findall(r"(?<={% docublock ).*(?= %})", paragraph)
    for docuBlock in docuBlockNameRe:
        if 'errorCodes' in docuBlock: ## TODO: Implement
            continue

        docuBlockFile = blocksFileLocations[docuBlock]
        docuBlockFile = open(docuBlockFile, "r").read()
        declaredDocuBlocks = re.findall(r"(?<=@startDocuBlock )(.*?)@endDocuBlock", docuBlockFile, re.MULTILINE | re.DOTALL)

        for block in declaredDocuBlocks:
            if block.startswith(docuBlock):
                if docuBlock == "documentRevision":
                    revisionContent = re.search(r"(?<=documentRevision\n\n)(.*?)", block, re.MULTILINE | re.DOTALL).group(0)
                    paragraph = paragraph.replace("{% docublock "+ docuBlock + " %}", revisionContent)
                    continue

                newBlock = processHTTPDocuBlock(block)

                paragraph = paragraph.replace("{% docublock "+ docuBlock + " %}", newBlock)
                #print(paragraph)
    return paragraph

def processHTTPDocuBlock(docuBlock):
    examples = re.findall(r"(?<=@EXAMPLE_)(.*?)(?=@END_EXAMPLE_)", docuBlock, re.MULTILINE | re.DOTALL)
    docuBlock = re.sub(r"@EXAMPLES.*", "", docuBlock, 0, re.MULTILINE | re.DOTALL)
    restBlocks = docuBlock.split("@REST")
    newBlock = {
        'header': {
            'verb': '',
            'url': '',
            'description': '',
            'operationId': ''
        },
        'parameters': [],
        'responses': [], 
        'requestBody': [],
        'examples': [],
        }

    for block in examples:
        exampleBlock = {'options': {}, 'code': ""}
        exampleType = re.search(r"ARANGO.*(?={)", block).group(0)
        if exampleType == "ARANGOSH_RUN":
            exampleBlock["options"]["render"] = "input"
        elif exampleType == "ARANGOSH_OUTPUT":
            exampleBlock["options"]["render"] = "input/output"

        exampleName = re.search(r"(?<={).*(?=})", block).group(0)
        exampleBlock["options"]["name"] = exampleName
        exampleBlock["options"]["version"] = "3.10"
        code = re.search(r"(?<="+exampleType+"{"+exampleName+"}\n).*", block, re.MULTILINE | re.DOTALL).group(0)
        exampleBlock["code"] = code

        newBlock["examples"].append(exampleBlock)

    for block in restBlocks:
        #print(block)
        try:
            if re.search(r"HEADER{", block):
                headerRe = re.search(r"(?<=HEADER){.*}", block).group(0)
                headerSplit = headerRe.split(",")

                try:
                    newBlock["header"]["verb"] = headerSplit[0].split(" ")[0].strip("{").lower()
                    newBlock["header"]["url"] = headerSplit[0].split(" ")[1] 
                    newBlock["header"]["description"] = headerSplit[1].replace("}", "")
                    newBlock["header"]["operationId"] = headerSplit[2].replace("}", "")
                except IndexError:
                    pass      

            if block.startswith("DESCRIPTION"):
                newBlock["description"] = block.replace("DESCRIPTION\n", "").rstrip("}")

            elif re.search(r".*PARAM{", block):
                paramType = re.search(r".*{", block).group(0).strip("{")
                paramBlock = {}
                
                p = f"(?<={paramType})"
                paramRe = re.search(p + r".*}", block).group(0)
                paramSplit = paramRe.split(",")

                try:
                    paramBlock["name"] = paramSplit[0].strip("{")
                    paramBlock["type"] = paramSplit[1]
                    paramBlock["necessity"] = paramSplit[2]
                except IndexError:
                    pass
                
                block = re.sub(p + r".*}", '', block)
                paramBlock["description"] = re.sub(r".*PARAM", '', block).replace(":", "")

                if "BODYPARAM" in paramType:
                    newBlock["requestBody"].append(paramBlock)
                    continue

                if "URLPARAM" in paramType:
                    paramBlock["in"] = "path"
                elif "QUERYPARAM" in paramType:
                    paramBlock["in"] = "query"
                elif "HEADERPARAM" in paramType:
                    paramBlock["in"] = "header"

                newBlock["parameters"].append(paramBlock)
                    

            if re.search(r"RETURNCODE{", block):
                blockSplit = block.split("\n")
                retBlock = {}
                retBlock["status"] = re.search(r"(?<=RETURNCODE{).*(?=})", blockSplit[0]).group(0)
                retBlock["status"] = f'\"{retBlock["status"]}\"'
                retBlock["description"] = "".join(blockSplit[1:]).strip("@endDocuBlock").replace(":", "")
                retBlock["responseBody"] = []
                newBlock["responses"].append(retBlock)

            if re.search(r"REPLYBODY{", block):
                relatedResponseBlock = newBlock["responses"][len(newBlock["responses"])-1]
                replyBlock = {}
                
                paramRe = re.search(r"(?<=REPLYBODY){.*}", block).group(0)
                paramSplit = paramRe.split(",")

                try:
                    replyBlock["name"] = paramSplit[0].strip("{")
                    replyBlock["type"] = paramSplit[1]
                    replyBlock["necessity"] = paramSplit[2]
                except IndexError:
                    pass
                
                block = re.sub(r"(?<=REPLYBODY){.*}", '', block)
                replyBlock["description"] = re.sub(r"REPLYBODY", '', block).replace(":", "")

                relatedResponseBlock["responseBody"].append(replyBlock)


        
    
        except Exception as ex:
            print(f"Exception occurred for block {block}\n{ex}")
            exit(1)

    yml = render_yaml(newBlock)

    exampleCodeBlocks = ""
    if len(newBlock["examples"]) > 0:
        exampleCodeBlocks = parse_examples(newBlock)

    return yml + "\n" + exampleCodeBlocks

def render_yaml(block):
    res = ''
    f1 = f'```http-spec\n\
openapi: 3.0.2\n\
paths:\n\
  {block["header"]["url"]}:\n\
    {block["header"]["verb"]}:\n\
        {"description: " + block["header"]["description"] if block["header"]["description"] else ""}\n\
        {"operationId: " + block["header"]["operationId"] if block["header"]["operationId"] else "" }'
    res = f1 + "\n" + parse_request_body(res, block)
    res = parse_responses(res, block)
    
    res = parse_parameters(res, block)

    res = res + f'\n\
```'
    res = res.replace("@endDocuBlock", "")   
    #res = res.replace("\n\n", "")  
    return re.sub(r"^\s*$\n", '', res, 0, re.MULTILINE | re.DOTALL)

def parse_request_body(res, block):
    if len(block["requestBody"]) > 0:
        parameters = f'\
        requestBody:\n\
            content:\n\
                application/json:\n\
                    schema:\n\
                        type: object\n\
                        properties:\n'
        for param in block["requestBody"]:
            description = param["description"].split("\n")
            paramBlock = f'\
                            {param["name"]}:\n\
                              type: {param["type"]}\n\
                              required: {"true" if param["necessity"] == "required" else "false"}\n\
                              description: >-\n'
            for d in description:
                paramBlock = paramBlock + f'\
                                {d}\n' 
            
            parameters = parameters + paramBlock
        res = res + "\n" + parameters
    return res

def parse_parameters(res, block):
    if len(block["parameters"]) > 0:
        parameters = f'\
    parameters:\n'
        for param in block["parameters"]:
            description = param["description"].split("\n")
            paramBlock = f'\
        - name: {param["name"]}\n\
          in: {param["in"]}\n\
          required: {"true" if param["necessity"] == "required" else "false"}\n\
          schema:\n\
            type: {param["type"]}\n\
          description: >-\n'
            for d in description:
                paramBlock = paramBlock + f'\
            {d}\n'
            parameters = parameters + paramBlock
        res = res + "\n" + parameters
    return res

def parse_responses(res, block):
    if len(block["responses"]) > 0:
        parameters = f'\
        responses:\n'
        for response in block["responses"]:
            responseBlock = f'\
            {response["status"]}:\n\
                description: {response["description"]}\n'
            if len(response["responseBody"]) > 0:
                responseBlock = responseBlock + f'\
                content:\n\
                  application/json:\n\
                    schema:\n\
                        type: object\n\
                        properties:\n'
                for responseBody in response["responseBody"]:
                    description = responseBody["description"].split("\n")
                    bodyBlock = f'\
                            {responseBody["name"]}:\n\
                              type: {responseBody["type"]}\n\
                              required: {"true" if responseBody["necessity"] == "required" else "false"}\n\
                              description: >-\n'
                    for d in description:
                        bodyBlock = bodyBlock + f'\
                                {d}\n' 
                    responseBlock = responseBlock + bodyBlock
            
            parameters = parameters + responseBlock
        res = res + "\n" + parameters
    return res

def parse_examples(block):
    res = '**Examples**\n'
    for example in block["examples"]:
        codeBlock = f'\n\
```http-example\n\
---\n\
name: {example["options"]["name"]}\n\
version: {example["options"]["version"]}\n\
render: {example["options"]["render"]}\n\
bindVars: {example["options"]["bindVars"] if "bindVars" in example["options"] else ""}\n\
dataset: {example["options"]["dataset"] if "dataset" in example["options"] else ""}\n\
explain: {example["options"]["explain"] if "explain" in example["options"] else ""}\n\
---\n\
{example["code"]}\n\
```\
'

        res = res + "\n" + codeBlock
    return re.sub(r"^\s*$\n", '', res, 0, re.MULTILINE | re.DOTALL)




if __name__ == "__main__":
    initBlocksFileLocations()