import yaml
import os
import re
from pathlib import Path
import shutil
import traceback


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

	page = Page()

	#Front Matter
	_processFrontMatter(page, buffer)
	fileID = filepath.split("/")
	page.frontMatter.fileID = fileID[len(fileID)-1].replace(".md", "")
	buffer = re.sub(r"(?<=---)\n[\s\w:\,>\.-]*(?<=---)", '', buffer)

	#Internal content
	paragraphs = re.split(r"\n(?:(.+\n={1,})|([#]+.*)|(.*\n-{3,}))", buffer)
	for i in range(len(paragraphs)):
		_processChapters(page, paragraphs[i])

	file = open(filepath, "w")
	file.write(page.toString())
	file.close()

	return

def _processFrontMatter(page, buffer):
	frontMatterRegex = re.search(r"(?<=---)\n[\s\w:\,>\.-]*(?<=---)", buffer)
	if not frontMatterRegex:
		return		# TODO

	frontMatter = frontMatterRegex.group(0)

	if not 'title' in frontMatter:
		headerRegex = re.search(r"(.+\n(?==))|((?<=#).*)",  buffer)
		if headerRegex is not None:
			title = headerRegex.group(0).replace('\n', '')
			if ":" in title:
				title = '"{}"'.format(title)
			page.frontMatter.title = title
			page.frontMatter.menuTitle = title
	else:
		titleRegex = re.search(r"(?<=title: ).*", frontMatter)
		page.frontMatter.title = titleRegex.group(0)

	page.frontMatter.description = re.search(r"(?<=description: ).*", frontMatter).group(0) if re.search(r"(?<=description: ).*", frontMatter) else ""

	return page

def _processChapters(page, paragraph):
	if paragraph is None or paragraph == '':
		return

	if paragraph.startswith("# ") or "====" in paragraph:
		return

	paragraph = re.sub("{:class=\"lead\"}", '', paragraph)
	paragraph = re.sub("{+\s?page.description\s?}+", '', paragraph)


	#HREFs
	hrefRegex = re.findall("\[.*\]\(.*\)", paragraph)
	for href in hrefRegex:
		if 'https://' in href or 'http://' in href:
			continue

		label = href.split("]")[0].strip('[')
		if "\"" in label:
			label = label.replace('"', '')

		fileID = href.split("]")[1].strip('()').replace('.html', '')
		newHref = '{{{{< reference fileID="{}" label="{}" >}}}}'.format(fileID, label)
		paragraph = paragraph.replace(href, newHref)


	page.paragraphs.append(paragraph)


class Page():
	def __init__(self):
		self.frontMatter = FrontMatter()
		self.paragraphs = []

	def toString(self):
		res = self.frontMatter.toString()
		for paragraph in self.paragraphs:
			res = f"{res}\n{paragraph}"

		return res

class FrontMatter():
	def __init__(self):
		self.title = ""
		self.layout = "default"
		self.fileID = ""
		self.description = ""

	def toString(self):
		return f"---\nfileID: {self.fileID}\ntitle: {self.title}\nmenuTitle: {self.title}\ndescription: {self.description}\nlayout: default"


if __name__ == "__main__":
	print("Starting migration")

	try:
		structure_migration()
		processFiles()
	except Exception as ex:
		print(traceback.format_exc())