import yaml
import os
import re
from pathlib import Path
import shutil
import time
import traceback
from utils import *
from http_docublocks import *
from inline_docublocks import *
import argparse
from globals import *


def structure_migration_new(label, document, manual):
	if document is None:
		directoryTree = open(f"{OLD_TOOLCHAIN}/_data/3.10-{manual}.yml", encoding="utf-8")
		document = yaml.full_load(directoryTree)

		if manual != "manual":
			create_index("", {"text": manual.upper(), "href": "index.html"}, manual+"/")
			document = document[1:]

	extendedSection = ''
	if manual != "manual":
		extendedSection = manual +"/"

	for item in document:
		# Ignore external links
		if "href" in item and (item["href"].startswith("http://") or item["href"].startswith("https://")):
			continue

		if "subtitle" in item or "divider" in item:
			continue

		if "children" in item:
			label = create_index(label, item, extendedSection)
			
			structure_migration_new(label, item["children"], extendedSection)
			labelSplit = label.split("/")
			label = "/".join(labelSplit[0:len(labelSplit)-1])
			continue
		else:
			label = create_files_new(label, item, extendedSection)


def create_chapter(item, manual):
	label = item["subtitle"].lower().replace(" ", "-").replace("&","").replace("--","-")

	if manual != "manual":
		label = f"{manual}/{label}"

	filepath = f'{NEW_TOOLCHAIN}/content/{label}/_index.md'
	Path(f'{NEW_TOOLCHAIN}/content/{label}').mkdir(parents=True, exist_ok=True)

	labelPage = Page()
	labelPage.frontMatter.title = item["subtitle"]
	labelPage.frontMatter.menuTitle = item["subtitle"]
	labelPage.frontMatter.weight = get_weight(currentWeight)
	labelPage.frontMatter.fileID = "fileID"
	infos[filepath] = {"title": item["subtitle"], "weight": get_weight(currentWeight)}
	
	file = open(filepath, "w", encoding="utf-8")
	file.write(labelPage.toString())
	file.close()
	return label


def create_index(label, item, extendedSection):
	oldFileName = item["href"].replace(".html", ".md")
	folderName = item["text"].lower().replace(" ", "-").replace("/", "")
	label = label + "/" + folderName

	Path(clean_line(f'{NEW_TOOLCHAIN}/content/{label}')).mkdir(parents=True, exist_ok=True)

	indexPath = clean_line(f'{NEW_TOOLCHAIN}/content/{label}/_index.md')
	oldFilePath = f'{OLD_TOOLCHAIN}/3.10/{extendedSection}{oldFileName}'
	shutil.copyfile(oldFilePath, indexPath)
	infos[indexPath] = {
		"title": f'\'{item["text"]}\'' if '@' in item["text"] else item["text"],
		"weight": get_weight(currentWeight),
		"fileID": oldFileName.replace(".md", "")
		}
	return label

def create_files_new(label, item, extendedSection):
	oldFileName = item["href"].replace(".html", ".md")
	oldFilePath = f'{OLD_TOOLCHAIN}/3.10/{extendedSection}{oldFileName}'.replace("//", "/")
	if label == '':
		return create_file_no_label(item, extendedSection)

	filePath = clean_line(f'{NEW_TOOLCHAIN}/content/{label}/{oldFileName}')

	try:
		shutil.copyfile(oldFilePath, filePath)
	except FileNotFoundError:
		print(f"WARNING! FILE NOT FOUND IN OLD TOOLCHAIN {oldFilePath}")
		
	infos[filePath]  = {
		"title": f'\'{item["text"]}\'' if '@' in item["text"] else item["text"],
		"weight": get_weight(currentWeight),
		"fileID": oldFileName.replace(".md", "")
		}
	return label

# To handle analyzers.md etc. case that are root-level pages
def create_file_no_label(item, extendedSection):
	oldFileName = item["href"].replace(".html", ".md")
	oldFilePath = f'{OLD_TOOLCHAIN}/3.10/{extendedSection}{oldFileName}'.replace("//", "/")

	label = oldFileName.replace(".md", "")
	Path(clean_line(f'{NEW_TOOLCHAIN}/content/{label}')).mkdir(parents=True, exist_ok=True)

	filePath = clean_line(f'{NEW_TOOLCHAIN}/content/{label}/_index.md')

	try:
		shutil.copyfile(oldFilePath, filePath)
	except FileNotFoundError:
		print(f"WARNING! FILE NOT FOUND IN OLD TOOLCHAIN {oldFilePath}")
		
	infos[filePath]  = {
		"title": f'\'{item["text"]}\'' if '@' in item["text"] else item["text"],
		"weight": get_weight(currentWeight),
		"fileID": oldFileName.replace(".md", "")
		}
	return ''



# File processing jekyll-hugo migration phase
def processFiles():
	print(f"----- STARTING CONTENT MIGRATION")
	#print(menu)
	for root, dirs, files in os.walk(f"{NEW_TOOLCHAIN}/content", topdown=True):
		for file in files:
			processFile(f"{root}/{file}".replace("\\", "/"))
	print("------ CONTENT MIGRATION END")

def processFile(filepath):
	#print(f"Migrating {filepath} content")
	try:
		file = open(filepath, "r", encoding="utf-8")
		buffer = file.read()
		file.close()
	except Exception as ex:
		print(traceback.format_exc())
		raise ex

	page = Page()

	#Front Matter
	if filepath in infos:
		page.frontMatter.weight = infos[filepath]["weight"] if "weight" in infos[filepath] else 0
		if "appendix" in filepath or "release-notes" in filepath:
			page.frontMatter.weight = page.frontMatter.weight + 10000

	_processFrontMatter(page, buffer)
	fileID = filepath.split("/")
	page.frontMatter.fileID = fileID[len(fileID)-1].replace(".md", "")
	if page.frontMatter.fileID == "_index":
		page.frontMatter.fileID = fileID[len(fileID)-2]
	if "fileID" in infos[filepath]:
		page.frontMatter.fileID = infos[filepath]["fileID"]

	buffer = re.sub(r"^---\n.*\n---\n", '', buffer, 0, re.MULTILINE | re.DOTALL)

	#Internal content
	_processChapters(page, buffer)

	file = open(filepath, "w", encoding="utf-8")
	file.write(page.toString())
	file.close()

	return

def _processFrontMatter(page, buffer):
	frontMatterRegex = re.search(r"---(.*?)---", buffer, re.MULTILINE | re.DOTALL)
	if not frontMatterRegex:
		return		# TODO

	frontMatter = frontMatterRegex.group(0)

	migrate_title(page, frontMatter, buffer)
	set_page_description(page, buffer, frontMatter)
	return page

def _processChapters(page, paragraph):
	if paragraph is None or paragraph == '':
		return
	paragraph = re.sub("{+\s?page.description\s?}+", '', paragraph)
	paragraph = paragraph.replace("{:target=\"_blank\"}", "")
	paragraph = paragraph.replace("{:style=\"clear: left;\"}", "")

	test = re.search(r"#+ .*|(.*\n={4,})", paragraph)
	if test:
		paragraph = paragraph.replace(test.group(0), '', 1)

	paragraph = re.sub(r"(?<=\n\n)[\w\s\W]+{:class=\"lead\"}", '', paragraph)
	versionBlocks = re.findall(r"{%- assign ver.*{%- endif %}", paragraph)
	for versionBlock in versionBlocks:
		if not "3.10" in versionBlock:
			paragraph = paragraph.replace(versionBlock, "")

	paragraph = migrate_headers(paragraph)
	paragraph = migrate_hrefs(paragraph, infos)
	paragraph = migrate_youtube_links(paragraph)

	paragraph = migrate_hints(paragraph)
	paragraph = migrate_capture_alternative(paragraph)
	paragraph = migrate_enterprise_tag(paragraph)
	paragraph = migrate_details(paragraph)
	paragraph = migrate_comments(paragraph)

	paragraph = migrateHTTPDocuBlocks(paragraph)
	paragraph = migrateInlineDocuBlocks(paragraph)
	paragraph = paragraph.lstrip("\n")

	page.content = paragraph
	return


def migrate_media():
	print("----- MIGRATING MEDIA")
	Path(f"{NEW_TOOLCHAIN}/assets/images/").mkdir(parents=True, exist_ok=True)
	for root, dirs, files in os.walk(f"{OLD_TOOLCHAIN}/3.10/images", topdown=True):
		for file in files:
			shutil.copyfile(f"{root}/{file}", f"{NEW_TOOLCHAIN}/assets/images/{file}")

	for root, dirs, files in os.walk(f"{OLD_TOOLCHAIN}/3.10/arangograph/images", topdown=True):
		for file in files:
			shutil.copyfile(f"{root}/{file}", f"{NEW_TOOLCHAIN}/assets/images/{file}")
	print("----- END MEDIA MIGRATION")

class Page():
	def __init__(self):
		self.frontMatter = FrontMatter()
		self.content = ""

	def toString(self):
		res = self.frontMatter.toString()
		cleanedFrontMatter = re.sub(r"^\s*$\n", '', res, 0, re.MULTILINE | re.DOTALL)
		res =  f"{cleanedFrontMatter}{self.content}"
		#res = re.sub(r"(?<=---)\n*", '\n', f"{cleanedFrontMatter}{self.content}", 0, re.MULTILINE | re.DOTALL)
		return res

class FrontMatter():
	def __init__(self):
		self.title = ""
		self.layout = "default"
		self.fileID = ""
		self.description = ""
		self.menuTitle = ""
		self.weight = 0

	@staticmethod
	def clean(str):
		return str.replace("`", "").lstrip(" ")

	def toString(self):
		return f"---\nfileID: {self.fileID}\ntitle: {self.clean(self.title)}\nweight: {self.weight}\ndescription: {self.description}\nlayout: default\n---\n"

def get_weight(weight):
	global currentWeight
	currentWeight += 5
	return currentWeight

if __name__ == "__main__":
	print("Starting migration")
	try:
		structure_migration_new('', None, "manual")
		structure_migration_new('http', None, "http")
		structure_migration_new('arangograph', None, "arangograph")
		structure_migration_new('aql', None, "aql")
		structure_migration_new('drivers', None, "drivers")
		initBlocksFileLocations()
		processFiles()
		write_components_to_file()
		migrate_media()
	except Exception as ex:
		print(traceback.format_exc())