import yaml
import os
import re
from pathlib import Path
import shutil
import time
import traceback
from utils import *


oldToolchain = "old-arango-docs/docs"
newToolchain = "docs/site"

frontMatterCapture = r"(?<=---\n)[\w:\s\W]*[\n]*(?=\n---)"
widgetRegex = r"{% .* %}[\n]+.*[\n]+{% .* %}"

menu = {}

# Directory Tree Migration phase
## In this phase, old toolchain files and dirs are copied in a new tree suitable for hugo. No file processing is done.
## Code became a mess, TODO: Refactor
def structure_migration():
	print(f"----- STARTING MIGRATION FROM {oldToolchain} TO {newToolchain}")

	directoryTree = open(f"{oldToolchain}/_data/3.10-manual.yml")
	documents = yaml.full_load(directoryTree)
	label = 'Manual'

	for item in documents:
		if "subtitle" in item:
			label = item['subtitle']
			label = label.replace(" ", "_")

		create_files('', label, item)

	sections = ['oasis', 'drivers', 'aql']
	for section in sections:
		Path(f"{newToolchain}/content/{section}").mkdir(parents=True, exist_ok=True)
		label = ''
		directoryTree = open(f"{oldToolchain}/_data/3.10-{section}.yml")
		documents = yaml.full_load(directoryTree)
		for item in documents:
			if "subtitle" in item:
				label = item['subtitle']
				label = label.replace(" ", "_")
				Path(f"{newToolchain}/content/{section}/{label}").mkdir(parents=True, exist_ok=True)
				labelPage = Page()
				labelPage.frontMatter.title = label
				labelPage.frontMatter.menuTitle = label
				labelPage.frontMatter.fileID = label
				menu[f"{newToolchain}/content/{section}/{label}/_index.md"] = label

				file = open(f"{newToolchain}/content/{section}/{label}/_index.md", "w")
				file.write(labelPage.toString())
				file.close()

			create_files(section, label, item)
	
	print("----- STRUCTURE MIGRATION END ----")


## TODO: Code is a mess, refactor
def create_files(section, label, chapter):
	if not "text" in chapter:			# Is just a subtitle
		return
	path = f"{newToolchain}/content/{label}"
	if section != '':
		path = f"{newToolchain}/content/{section}/{label}"

	root = chapter['text']		# Menu entry
	filename = f"{chapter['href']}".replace(".html", ".md")
	oldFilePath = f"{oldToolchain}/3.10/{filename}"

	if section != '':
		oldFilePath = f"{oldToolchain}/3.10/{section}/{filename}"


	if not "children" in chapter:		# Leaf in the current tree
		if 'http' in chapter['href']:
			return

		if filename == 'index.md':
			filename = '_index.md'

		newFilePath = f"{path}/{filename}"
		newFilePath = newFilePath.replace("//", "/")
		shutil.copyfile(oldFilePath, newFilePath)
		if root == 'Introduction':
			root = section

		menu[newFilePath] = f"'{root}'" if '@' in root else root
		return

	# Not in a leaf, create a new menu entry/chapter index file and go through the subtree
	root = root.replace(" ", "-")
	Path(f"{path}/{root}").mkdir(parents=True, exist_ok=True)
	indexPath = f"{path}/{root}/_index.md"
	indexPath = indexPath.replace("//", "/")
	print(oldFilePath)
	shutil.copyfile(oldFilePath, indexPath)
	menu[indexPath] = f"'{root}'" if '@' in root else root

	for child in chapter["children"]:
		create_files(section, f"{label}/{root}", child)

# File processing jekyll-hugo migration phase
def processFiles():
	print(f"----- STARTING CONTENT MIGRATION")
	for root, dirs, files in os.walk(f"{newToolchain}/content", topdown=True):
		for file in files:
			processFile(f"{root}/{file}")
	print("------ CONTENT MIGRATION END")

def processFile(filepath):
	print(f"Migrating {filepath} content")
	try:
		file = open(filepath, "r")
		buffer = file.read()
		file.close()
	except Exception as ex:
		print(traceback.format_exc())
		raise ex

	page = Page()

	#Front Matter
	page.frontMatter.menuTitle = menu[filepath]
	_processFrontMatter(page, buffer)
	fileID = filepath.split("/")
	page.frontMatter.fileID = fileID[len(fileID)-1].replace(".md", "")
	buffer = re.sub(r"-{3}\n[\w\s:/#,()?’'\@&\[\]\*.>-]+\n-{3}", '', buffer)

	#Internal content
	_processChapters(page, buffer)

	file = open(filepath, "w")
	file.write(page.toString())
	file.close()

	return

def _processFrontMatter(page, buffer):
	frontMatterRegex = re.search(frontMatterCapture, buffer)
	if not frontMatterRegex:
		return		# TODO

	frontMatter = frontMatterRegex.group(0)

	fmTitleRegex = re.search(r"(?<=title: ).*", frontMatter)
	if fmTitleRegex:
		page.frontMatter.title = fmTitleRegex.group(0)

	paragraphTitleRegex = re.search(r"(?<=---\n)(# .*)|(.*\n(?=={4,}))", buffer)
	if paragraphTitleRegex:
		page.frontMatter.title = paragraphTitleRegex.group(0).replace('#', '').replace(':', '')
		page.frontMatter.title = re.sub(r"{{ .* }}", '', page.frontMatter.title)
	
	set_page_description(page, buffer, frontMatter)

	return page

def _processChapters(page, paragraph):
	if paragraph is None or paragraph == '':
		return

	paragraph = re.sub("{+\s?page.description\s?}+", '', paragraph)
	paragraph = paragraph.replace("{:target=\"_blank\"}", "")
	test = re.search(r"#+ .*|(.*\n={4,})", paragraph)
	if test:
		paragraph = paragraph.replace(test.group(0), '', 1)

	paragraph = re.sub(r"(?<=\n\n)[\w\s\W]+{:class=\"lead\"}", '', paragraph)

	paragraph = migrate_headers(paragraph)
	paragraph = migrate_hrefs(paragraph)
	paragraph = migrate_hints(paragraph)

	page.content = paragraph
	return


def migrate_media():
	print("----- MIGRATING MEDIA")
	for root, dirs, files in os.walk(f"{oldToolchain}/3.10/images", topdown=True):
		for file in files:
			print(f"migrating {file}")
			shutil.copyfile(f"{root}/{file}", f"{newToolchain}/assets/images/{file}")

	for root, dirs, files in os.walk(f"{oldToolchain}/3.10/oasis/images", topdown=True):
		for file in files:
			print(f"migrating {file}")
			shutil.copyfile(f"{root}/{file}", f"{newToolchain}/assets/images/{file}")
	print("----- END MEDIA MIGRATION")

class Page():
	def __init__(self):
		self.frontMatter = FrontMatter()
		self.content = ""

	def toString(self):
		res = self.frontMatter.toString()
		res = f"{res}\n{self.content}"
		return res

class FrontMatter():
	def __init__(self):
		self.title = ""
		self.layout = "default"
		self.fileID = ""
		self.description = ""
		self.menuTitle = ""

	def toString(self):
		return f"---\nfileID: {self.fileID}\ntitle: {self.title}\nmenuTitle: {self.menuTitle}\ndescription: {self.description}\nlayout: default\n---\n"


if __name__ == "__main__":
	print("Starting migration")

	try:
		structure_migration()
		processFiles()
		migrate_media()
	except Exception as ex:
		print(traceback.format_exc())