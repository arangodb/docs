from docublocks import *


def test_http_docublocks():
    paragraph = open("test/http_docublocks.md")
    migrateHTTPDocuBlocks(paragraph.read())
    paragraph.close()


if __name__ == "__main__":
    initBlocksFileLocations()
    test_http_docublocks()