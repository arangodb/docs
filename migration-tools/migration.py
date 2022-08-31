import yaml
import os
import re
from pathlib import Path
import shutil
import time
import traceback


oldToolchain = "/home/dan/work/projects/old-arango-docs/docs"
newToolchain = "/home/dan/work/projects/arangodb/docs/site"

frontMatterCapture = r"(?<=---\n)[\w:\s\W]*[\n]*(?=\n---)"
widgetRegex = r"{% .* %}[\n]+.*[\n]+{% .* %}"

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
			label = label.replace(" ", "_")

		create_files(label, item)
	
	print("----- STRUCTURE MIGRATION END ----")


def create_files(label, chapter):
	if not "text" in chapter:			# Is just a subtitle
		return

	path = f"{newToolchain}/content/{label}"

	root = chapter['text']		# Menu entry
	filename = f"{chapter['href']}".replace(".html", ".md")
	oldFilePath = f"{oldToolchain}/3.10/{filename}"

	if not "children" in chapter:		# Leaf in the current tree
		newFilePath = f"{path}/{filename}"
		shutil.copyfile(oldFilePath, newFilePath)
		processFile(newFilePath)
		return

	# Not in a leaf, create a new menu entry/chapter index file and go through the subtree
	root = root.replace(" ", "_")
	print(f"Creating folder {path}/{root}")
	Path(f"{path}/{root}").mkdir(parents=True, exist_ok=True)
	shutil.copyfile(oldFilePath, f"{path}/{root}/_index.md")

	for child in chapter["children"]:
		create_files(f"{label}/{root}", child)


# File processing jekyll-hugo migration phase
def processFiles():
	for root, dirs, files in os.walk(f"{newToolchain}/content", topdown=True):
		for file in files:
			print(f"opening file {root}/{file}")
			processFile(f"{root}/{file}")

def processFile(filepath):
	#print(f"Migrating {filepath} content")
	try:
		file = open(filepath, "r")
		buffer = file.read()
		file.close()
	except Exception:
		print(traceback.format_exc())
		time.sleep(3)
		processFile(filepath)

	page = Page()

	#Front Matter
	_processFrontMatter(page, buffer)
	fileID = filepath.split("/")
	page.frontMatter.fileID = fileID[len(fileID)-1].replace(".md", "")
	buffer = re.sub(r"-{3}\n[\w\s:/#,()?’'&.>-]+\n-{3}", '', buffer)

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

	titleRegex = re.search(r"(?<=---\n)(# .*)|(.*\n(?=={4,}))", buffer)
	if titleRegex:
		page.frontMatter.title = titleRegex.group(0).replace('#', '')
	else:
		print("frontMatter")


	descRegex = re.search(r"(?<=description: )(([>-]+\n(\s{2}[\s\w,-]+\n)+)|.*\n)", frontMatter)
	if descRegex:
		page.frontMatter.description = descRegex.group(0)

	paragraphDescRegex = re.search(r"(?<=\n\n)[\w\s\W]+(?={:class=\"lead\"})", buffer)
	if paragraphDescRegex:
		description = paragraphDescRegex.group(0)
		if not "page.description" in description:
			description = description.replace("\n", "\n  ")
			page.frontMatter.description = f">-\n  {description}"

	return page

def _processChapters(page, paragraph):
	if paragraph is None or paragraph == '':
		return

	paragraph = re.sub("{+\s?page.description\s?}+", '', paragraph)
	paragraph = paragraph.replace("{:target=\"_blank\"}", "")
	test = re.search(r"#+ .*|(.*\n={4,})", paragraph)
	if test:
		paragraph = paragraph.replace(test.group(0), '')

	paragraph = re.sub(r"(?<=\n\n)[\w\s\W]+{:class=\"lead\"}", '', paragraph)

	headersRegex = re.findall(r"(?<=\n)[\w\s_/]+\n-{4,}", paragraph)
	for header in headersRegex:
		if '|' in header:
			continue

		headerSplit = header.replace('-', '').split("\n")
		headerText = f"\n## {headerSplit[len(headerSplit)-2]}"
		paragraph = paragraph.replace(header, headerText)

	hrefRegex = re.findall(r"[^\s]*\[.*\]\(.*\)({:style.*})?", paragraph)
	for href in hrefRegex:
		if 'https://' in href or 'http://' in href:
			continue

		label = re.search(r"(?<=\[).*(?=\])", href).group(0)	# Bug with new style regex, to fix
		if "\"" in label:
			label = label.replace('"', '')

		attr = re.search(r"(?<=\]\().*(?=\))", href).group(0).strip('"').strip('()').replace('.html', '')

		if href.startswith("!"):
			## Check for the inline images
			if ':style' in href:
				imgWidget = '{{{{< img src="{}" alt="{}" size="medium" inline="true" >}}}}'.format(attr, label)
				paragraph = paragraph.replace(href, imgWidget)
				continue

			imgWidget = '{{{{< img src="{}" alt="{}" size="medium" >}}}}'.format(attr, label)
			paragraph = paragraph.replace(href, imgWidget)
			continue

	hintRegex = re.findall(r"{% hint .* %}[\n\w\s\*\.,\"\`!#\[\]\(\)-]*{% .* %}", paragraph)
	for hint in hintRegex:
		print(f"processing {hint}")
		hintSplit = hint.split("\n")
		hintType = re.search("'.*'", hintSplit[0]).group(0).strip("'")
		hintText = "\n".join(hintSplit[1:len(hintSplit)-2])

		newHint = f"{{{{% hints/{hintType} %}}}}\n{hintText}\n{{{{% /hints/{hintType} %}}}}"
		#print(f"oldhint\n{hint}\n\nnewHing\n{newHint}\n")
		paragraph = paragraph.replace(hint, newHint)

	page.content = paragraph


def migrate_media():
	for root, dirs, files in os.walk(f"{oldToolchain}/3.10/images", topdown=True):
		for file in files:
			#print(f"migrating {file}")
			shutil.copyfile(f"{root}/{file}", f"{newToolchain}/assets/images/{file}")

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

	def toString(self):
		return f"---\nfileID: {self.fileID}\ntitle: {self.title}\nmenuTitle: {self.title}\ndescription: {self.description}\nlayout: default\n---\n"


if __name__ == "__main__":
	print("Starting migration")

	try:
		structure_migration()
		processFiles()
		migrate_media()
	except Exception as ex:
		print(traceback.format_exc())