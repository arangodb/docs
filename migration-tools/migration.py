import yaml
import os
from pathlib import Path
import shutil


oldToolchain = "old-arango-docs/docs"
newToolchain = "arangodb/docs/site/content"

def structure_migration():
	print(f"Starting migration from {oldToolchain} to {newToolchain}")

	directoryTree = open(f"{oldToolchain}/_data/3.10-manual.yml")
	documents = yaml.full_load(directoryTree)
	label = 'Manual'

	for item in documents:
		if "subtitle" in item:
			label = item['subtitle']
			print(f"New label {label}")

		create_chapter(label, item)


def create_chapter(label, chapter):
	if not "text" in chapter:			# Is just a subtitle
		return

	path = f"{newToolchain}/{label}"

	root = chapter['text']		# Menu entry

	if not "children" in chapter:		# Leaf in the current tree
		oldFilePath = f"{oldToolchain}/3.10/{chapter['href']}".replace(".html", ".md")
		newFilePath = f"{path}/{chapter['href']}"

		shutil.copyfile(oldFilePath, f"{filename}.md")

		processFile(file)
		return


	# Not in a leaf, create a new menu entry/chapter index file and go through the subtree
	print("found children")
	print(f"Creating folder {path}/{root}")

	Path(f"{path}/{root}").mkdir(parents=True, exist_ok=True)
	file = open(f"{path}/{root}/_index.md",'w+')
	file.close()

	for child in chapter["children"]:
		create_chapter(f"{label}/{root}", child)


def processFile(file):
	print("Migrating file content")
	return

if __name__ == "__main__":
	print("Starting migration")
	structure_migration()
