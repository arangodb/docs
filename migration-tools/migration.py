import yaml
import os
import re
from pathlib import Path
import shutil


oldToolchain = "/home/dan/work/projects/old-arango-docs/docs"
newToolchain = "/home/dan/work/projects/arangodb/docs/site/content"

# Directory Tree Migration phase
## In this phase, old toolchain files and dirs are copied in a new tree suitable for hugo. No file processing is done.
def structure_migration():
	print(f"----- STARTING MIGRATION FROM {oldToolchain} TO {newToolchain}")

	directoryTree = open(f"{oldToolchain}/_data/3.10-manual.yml")
	documents = yaml.full_load(directoryTree)
	label = 'Manual'

	for item in documents:
		if "subtitle" in item:
			label = item['subtitle']
			print(f"New label {label}")

		create_files(label, item)
	
	print("----- STRUCTURE MIGRATION END ----")


def create_files(label, chapter):
	if not "text" in chapter:			# Is just a subtitle
		return

	path = f"{newToolchain}/{label}"

	root = chapter['text']		# Menu entry
	filename = f"{chapter['href']}".replace(".html", ".md")
	oldFilePath = f"{oldToolchain}/3.10/{filename}"

	if not "children" in chapter:		# Leaf in the current tree
		newFilePath = f"{path}/{filename}"
		shutil.copyfile(oldFilePath, newFilePath)
		processFile(newFilePath)
		return

	# Not in a leaf, create a new menu entry/chapter index file and go through the subtree
	print("found children")
	print(f"Creating folder {path}/{root}")

	Path(f"{path}/{root}").mkdir(parents=True, exist_ok=True)
	shutil.copyfile(oldFilePath, f"{path}/{root}/_index.md")

	for child in chapter["children"]:
		create_files(f"{label}/{root}", child)


# File processing jekyll-hugo migration phase
def processFiles():
	for root, dirs, files in os.walk(newToolchain, topdown=False):
		for file in files:
			processFile(file)

def processFile(filepath):
	print(f"Migrating {filepath} content")

	file = open(filepath, "r")
	buffer = file.read()
	file.close()

	#Front Matter
	fileID = filepath.split("/")
	_processFrontMatter(fileID[len(fileID)-1].replace(".md", ""), buffer)
	return

def _processFrontMatter(fileID, buffer):
	frontMatterRegex = re.search("---\n(.*\n)*---\n", buffer)
	if not frontMatterRegex:
		return		# TODO

	frontMatter = frontMatterRegex.group(0)

	
	frontMatter = f"fileID: {fileID}\n{frontMatter}"

	if 'redirectFrom' in frontMatter:
		redirectRegex = re.sub("redirect_from:\n*(\s* -.*)*", '', frontMatter)

	frontMatter = f"{frontMatter}\nmenuTitle"
	print(frontMatter)
		




if __name__ == "__main__":
	print("Starting migration")

	try:
		structure_migration()
		processFiles()
	except Exception as ex:
		print(f"[MAIN] Exception occurred: {ex}")