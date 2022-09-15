import re
import json

# HTTP DocuBlocks
apiDocsFile = "./docs/3.10/generated/allComments.txt"
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
        docuBlockFile = blocksFileLocations[docuBlock]
        docuBlockFile = open(docuBlockFile, "r").read()
        declaredDocuBlocks = docuBlockFile.split("@startDocuBlock ")

        for block in declaredDocuBlocks:
            if block.startswith(docuBlock+"\n"):
                yml = processHTTPDocuBlock(block)
                # dump object as yaml and replace the old content with new codeblock yaml

    return

def processHTTPDocuBlock(docuBlock):
    blocks = docuBlock.split("@REST")

    for block in blocks:
        if block.startswith("HEADER"):
            #processHeader

        if block.startswith("DESCRIPTION"):
            #processDesc

        if block.startswith("RETURNCODE"):
            #processReturn

        if block.startswith("EXAMPLE_"):
            #processExample


    return


class HTTPDocuBlock():
    def __init__(self):
        self.brief = ""
        self.header = RestHeader()
        self.hints = ""
        self.urlParameters = list(RestURLParameter())

class RestParameter():
    def __init__(self):
        self.param = ""
        self.type = ""
        self.necessity = ""
        self.description = ""

class RestHeader():
    def __init__(self):
        self.verb = ""
        self.url = ""
        self.description = ""
        self.operationId = ""

class RestURLParameter(RestParameter):
    def __init__(super, self):
        super().__init__(self)

class RestQueryParameter(RestParameter):
    def __init__(super, self):
        super().__init__(self)

class RestHeaderParameter(RestParameter):
    def __init__(super, self):
        super().__init__(self)

class RestBodyParameter(RestParameter):
    def __init__(super, self):
        super().__init__(self)
        self.subtype = ""

class RestReturnCode():
    def __init__(self):
        self.status = 413
        self.description = ""

class RestReplyBody():
    def __init__(self):
        self.name = ""
        self.type = ""
        self.necessity = ""
        self.subtype = ""

# Inline DocuBlocks




if __name__ == "__main__":
    initBlocksFileLocations()