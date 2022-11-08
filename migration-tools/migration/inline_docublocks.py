import re
import globals
import yaml
import utils

def migrateInlineDocuBlocks(paragraph):
    paragraph = re.sub(r"{%.*arangoshexample.* %}", '', paragraph, 0)
    paragraph = re.sub(r"{%.*aqlexample.* %}", '', paragraph, 0)
    paragraph = re.sub(r"@END_EXAMPLE_.*", '', paragraph, 0)
    docublocks = re.findall(r"(?<=@startDocuBlockInline )(.*?)[\s](?=@endDocuBlock)", paragraph, re.MULTILINE | re.DOTALL)
    if docublocks:
        globals.inlineDocuBlocksCount += len(docublocks)
        for block in docublocks:
            originalBlock = block
            newBlock = {"language": "js",
                        "options": {
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
                newBlock["options"]["name"] = re.search(r"(?<=@EXAMPLE_ARANGOSH_OUTPUT{).*(?=})", exampleType).group(0)

            elif "@EXAMPLE_AQL" in exampleType:
                newBlock["language"] = "aql"
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
    exampleOptions = yaml.dump(block["options"], sort_keys=False, default_flow_style=False)
    res = f'\n\
{{{{< version "3.10" >}}}}\n\
{{{{< tabs >}}}}\n\
{{{{% tab name="{block["language"]}" %}}}}\n\
```{block["language"]}\n\
---\n\
{exampleOptions}\n\
---\n\
{block["code"]}\n\
```\n\
```{block["language"]}\n\
{utils.migrate_docublock_output(block["options"]["name"])}\n\
```\n\
{{{{% /tab %}}}}\n\
{{{{< /tabs >}}}}\n\
{{{{< /version >}}}}\n\
'
    return re.sub(r"^\s*$\n", '', res, 0, re.MULTILINE | re.DOTALL)