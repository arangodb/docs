import re
import globals

#TODO: Using yaml lib, is it possible to convert dicts into yaml without formatting those horrible strings by hand?

def migrateInlineDocuBlocks(paragraph):
    paragraph = re.sub(r"{%.*arangoshexample.* %}", '', paragraph, 0)
    paragraph = re.sub(r"{%.*aqlexample.* %}", '', paragraph, 0)
    paragraph = re.sub(r"@END_EXAMPLE_.*", '', paragraph, 0)
    docublocks = re.findall(r"(?<=@startDocuBlockInline )(.*?)[\s](?=@endDocuBlock)", paragraph, re.MULTILINE | re.DOTALL)
    if docublocks:
        globals.inlineDocuBlocksCount += len(docublocks)
        for block in docublocks:
            originalBlock = block
            newBlock = {
                        "options": {
                            "language": "js",
                            "name": "",
                            "description": "",
                            "render": "input",
                            "version": "3.10",
                            "draft": False,
                            },
                        "code": "",
                        }
            
            newBlock["options"]["name"] = block.split("\n")[0]
            exampleType = re.search(r"@EXAMPLE_.*",  block).group(0)

            if "@EXAMPLE_ARANGOSH_OUTPUT" in exampleType:
                newBlock["options"]["render"] = "input/output"

            elif "@EXAMPLE_AQL" in exampleType:
                newBlock["options"]["language"] = "aql"
                newBlock["options"]["render"] = "input/output"

            newBlock["options"]["release"] = "stable"

            brief = re.search(r"@brief.*", block)
            if brief:
                newBlock["options"]["description"] = brief.group(0)

            block = re.sub(r"@EXAMPLE_.*", '', block, 0)
            datasetRe = re.search(r"@DATASET.*", block)
            if datasetRe:
                newBlock["options"]["dataset"] = datasetRe.group(0).replace("@DATASET{", "").replace("}", "")
                block = re.sub(r"@DATASET.*", '', block, 0)

            explainRe = re.search(r"@EXPLAIN{TRUE}.*", block)
            if explainRe:
                newBlock["options"]["explain"] = "true"
                block = block.replace("@EXPLAIN{TRUE}", "")

            bindVarsRe = re.search(r"@BV (.*?)}", block, re.MULTILINE | re.DOTALL)
            if bindVarsRe:
                newBlock["options"]["bindVars"] = bindVarsRe.group(0).replace("@BV ", "")
                block = re.sub(r"@BV (.*?)}", "", block, 0, re.MULTILINE | re.DOTALL)

            
            newBlock["code"] = "\n".join(block.split("\n")[1:]).lstrip(" ").replace("    ", "")
            codeblock = render_codeblock(newBlock)
            codeblock = codeblock.replace("|", " ")
            paragraph = paragraph.replace(originalBlock, codeblock)
    paragraph = re.sub(r"@endDocuBlock.*", '', paragraph, 0)
    paragraph = re.sub(r".*@startDocuBlockInline", '', paragraph, 0)

    return paragraph

def render_codeblock(block):
    res = f'\n\
{{{{< version "3.10" >}}}}\n\
{{{{< tabs >}}}}\n\
{{{{% tab name="{block["options"]["language"]}" %}}}}\n\
```{block["options"]["language"]}\n\
---\n\
name: {block["options"]["name"]}\n\
description: {block["options"]["description"]}\n\
version: {block["options"]["version"]}\n\
render: {block["options"]["render"]}\n\
release: {block["options"]["release"]}\n\
bindVars: {block["options"]["bindVars"] if "bindVars" in block["options"] else ""}\n\
dataset: {block["options"]["dataset"] if "dataset" in block["options"] else ""}\n\
explain: {block["options"]["explain"] if "explain" in block["options"] else ""}\n\
---\n\
{block["code"]}\n\
```\n\
{{{{% /tab %}}}}\n\
{{{{< /tabs >}}}}\n\
{{{{< /version >}}}}\n\
'
    return re.sub(r"^\s*$\n", '', res, 0, re.MULTILINE | re.DOTALL)