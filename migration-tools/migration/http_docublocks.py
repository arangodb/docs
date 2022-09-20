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
        declaredDocuBlocks = docuBlockFile.split("@startDocuBlock ")

        for block in declaredDocuBlocks:
            if block.startswith(docuBlock+"\n"):
                yml = processHTTPDocuBlock(block)

                paragraph = paragraph.replace("{% docublock "+ docuBlock + " %}", yml)
                #print(paragraph)
    return paragraph

def processHTTPDocuBlock(docuBlock):
    blocks = docuBlock.split("@EXAMPLE")
    restBlocks = blocks[0].split("@REST")
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

    for block in blocks:
        if block.startswith("_ARANGOSH"):
            #print(block)
            exampleBlock = {}
            exampleName = re.search(r"(?<={).*(?=})", block).group(0)
            exampleBlock["name"] = exampleName
            code = re.search(r"(?<=_ARANGOSH_RUN{"+exampleName+"}\n).*[\n\s\w\W]*", block).group(0)
            code = re.sub(r"@END_EXAMPLE_ARANGOSH_RUN.*", '', code)
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
                    newBlock["header"]["description"] = headerSplit[1]
                    newBlock["header"]["operationId"] = headerSplit[2].strip("}")
                except IndexError:
                    pass      

            if block.startswith("DESCRIPTION"):
                newBlock["description"] = block.replace("DESCRIPTION\n", "")

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
                paramBlock["description"] = block

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
                retBlock["description"] = "".join(blockSplit[1:]).strip("@endDocuBlock")

                newBlock["responses"].append(retBlock)

        
    
        except Exception as ex:
            print(f"Exception occurred for block {block}\n{ex}")
            exit(1)

    yml = render_yaml(newBlock)
    return yml

def render_yaml(block):
    parameters = ''
    for param in block["parameters"]:
        parameters = f'{parameters}\n\
            - name: {param["name"]}\n\
              in:   {param["in"]}\n\
              required: {"true" if param["necessity"] == "required" else "false"}\n\
            '

    bodyParameters = 'requestBody:\n\
            content:\n\
                application/json:\n\
                    schema:\n\
                        type: object\n\
                        properties:\n'
    for param in block["requestBody"]:
       bodyParameters = f'{bodyParameters}\n\
                            {param["name"]}:\n\
                                type: {param["type"]}\n\
                                required: {"true" if param["necessity"] == "required" else "false"}\n\
                                description: {param["description"]}\n'

    responses = ''
    for response in block["responses"]:
        responses = f'{responses}\n\
            {response["status"]}:\n\
              description: {response["description"]}'

    examples = ''
    for example in block["examples"]:
        examples = f'{examples}\n\
            {example["name"]}:\n\
                code: {example["code"]}\n\
            '

    res = f'```http\n\
openapi: 3.0.2\n\
servers:\n\
  - url: /v3\n\
paths:\n\
  {block["header"]["url"]}:\n\
    {block["header"]["verb"]}:\n\
        {"description:" + block["header"]["description"] if block["header"]["description"] else ""}\n\
        {"operationId:" + block["header"]["operationId"] if block["header"]["operationId"] else "" }\n\
        {"parameters:"  + parameters if parameters else ""}\n\
        {bodyParameters if block["requestBody"] else ""}\n\
        {"responses:" + responses if responses else ""}\n\
        {"x-arango-examples:" + examples if examples else ""}\n\
```'
    res = res.replace("@endDocuBlock", "")   
    res = res.replace("\n\n", "")  

    return res

if __name__ == "__main__":
    initBlocksFileLocations()