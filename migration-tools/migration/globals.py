import argparse

##CMDLINE ARGS
parser = argparse.ArgumentParser(description='Optional app description')
parser.add_argument('--src', type=str,
                    help='Old toolchain path docs folder included')
parser.add_argument('--dst', type=str,
                    help='New toolchain path docs folder included')
parser.add_argument('--arango-main', type=str,
                    help='Path of the arangodb main repository where all docublocks are located')
args = parser.parse_args()

if args.src is None or args.dst is None:
	print("Args are required")
	exit(1)

# Handle Windows and trailing path separators
src = args.src.replace("\\", "/").rstrip("/")
dst = args.dst.replace("\\", "/").rstrip("/")
main = args.arango_main.replace("\\", "/").rstrip("/")

OLD_TOOLCHAIN = src
NEW_TOOLCHAIN = f"{dst}/site"
ARANGO_MAIN = main

infos = {"": {}}
currentWeight = 0

httpDocuBlocksCount = 0
inlineDocuBlocksCount = 0

## Regexes
frontMatterCapture = r"(?<=---\n)(.*?)(?=---)"
widgetRegex = r"{% .* %}[\n]+.*[\n]+{% .* %}"


## DocuBlocks
ALL_COMMENTS_FILE = f"{OLD_TOOLCHAIN}/3.10/generated/allComments.txt"
OAPI_COMPONENTS_FILE = f"{args.dst}/migration-tools/arangoproxy/cmd/openapi/components.yaml"
OLD_GENERATED_FOLDER = f"{OLD_TOOLCHAIN}/3.10/generated/Examples"
blocksFileLocations = {}
components = {"schemas": {}, "parameters": [], "securitySchemes": [], "requestBodies": [], "responses": [], "headers": [], "links": [], "callbacks": []}


static_replacements = {
    "comments": {
        "{% comment %}": "{{% comment %}}",
        "{% endcomment %}": "{{% /comment %}}",
        "{%- comment %}": "{{% comment %}}",
        "{%- endcomment %}": "{{% /comment %}}",
        "<!--": "{{% comment %}}\n",
        "-->": "\n{{% /comment %}}"
    }
}


