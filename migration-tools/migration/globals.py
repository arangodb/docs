import argparse

##CMDLINE ARGS
parser = argparse.ArgumentParser(description='Optional app description')
parser.add_argument('--src', type=str,
                    help='Old toolchain path docs folder included')
parser.add_argument('--dst', type=str,
                    help='New toolchain path docs folder included')
args = parser.parse_args()

if args.src is None or args.dst is None:
	print("Args are required")
	exit(1)

# Handle Windows and trailing path separators
src = args.src.replace("\\", "/").rstrip("/")
dst = args.dst.replace("\\", "/").rstrip("/")

OLD_TOOLCHAIN = src
NEW_TOOLCHAIN = f"{dst}/site"

infos = {"": {}}
currentWeight = 0

httpDocuBlocksCount = 0
inlineDocuBlocksCount = 0

## Regexes
frontMatterCapture = r"(?<=---\n)(.*?)(?=---)"
widgetRegex = r"{% .* %}[\n]+.*[\n]+{% .* %}"


## DocuBlocks
APIDOCS_FILE = f"{OLD_TOOLCHAIN}/3.10/generated/allComments.txt"
OAPI_COMPONENTS_FILE = f"{args.dst}/migration-tools/arangoproxy/cmd/openapi/components.yaml"
blocksFileLocations = {}
components = {"schemas": {}, "parameters": [], "securitySchemes": [], "requestBodies": [], "responses": [], "headers": [], "links": [], "callbacks": []}


