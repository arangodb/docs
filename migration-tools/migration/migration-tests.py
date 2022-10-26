from http_docublocks import *


def test_http_docublocks():
    paragraph = open("test/http_docublocks.md", encoding="utf-8")
    migrateHTTPDocuBlocks(paragraph.read())
    paragraph.close()


if __name__ == "__main__":
    initBlocksFileLocations()
    test_http_docublocks()