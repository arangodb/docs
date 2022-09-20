import re

def migrateInlineDocuBlocks(paragraph):
    docublocks = re.findall(r"@startDocuBlockInline (.*?)[\s]?@endDocuBlock", paragraph, re.MULTILINE | re.DOTALL)
    if docublocks:
        for block in docublocks:
            newBlock = {
                        "options": {
                            "language": "js",
                            "name": "",
                            "render": "input",
                            "version": "3.10"
                            },
                        "code": "",
                        }
            blockLines = block.split("\n")
            newBlock["options"]["name"] = blockLines[0]

            if "@EXAMPLE_ARANGOSH_OUTPUT" in blockLines[1]:
                newBlock["options"]["render"] = "input/output"
            elif "@EXAMPLE_AQL" in blockLines[1]:
                newBlock["options"]["language"] = "aql"

            newBlock["code"] = "\n".join(blockLines[2:len(blockLines)-2]) if len(blockLines) > 4 else blockLines[2]
            codeblock = render_codeblock(newBlock)
            paragraph = paragraph.replace(block, codeblock)
            
    paragraph = re.sub(r"{%.*arangoshexample.* %}", '', paragraph)
    paragraph = re.sub(r"{%.*aqlexample.* %}", '', paragraph)
    paragraph = re.sub(r"[\s]?@endDocuBlock .*", '', paragraph)
    paragraph = re.sub(r"[\s]*@startDocuBlockInline ", '', paragraph)
    return paragraph

def render_codeblock(block):
    return f'\n\
```{block["options"]["language"]}\n\
---\n\
name: {block["options"]["name"]}\n\
version: {block["options"]["version"]}\n\
render: {block["options"]["render"]}\n\
---\n\
{block["code"]}\n\
```\
'