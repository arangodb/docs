const fs = require('fs').promises;
const path = require('path');
const globby = require('globby');
const changeLink = require('./changeLink');
const mkdirp = require('mkdirp');

async function migrateMds(basePath, targetPath) {
    const absoluteBasePath = await fs.realpath(basePath);
    const paths = await globby([path.join(basePath, "**/*.md")]);
    const files = await Promise.all(paths.map(async (p) => {
        const absolute = await fs.realpath(p);
        const relative = path.relative(absoluteBasePath, absolute);
        
        const fileName = changeLink(relative);

        let content = (await fs.readFile(p)).toString();
        if (!content.startsWith("---\n")) {
            content = "---\nlayout: default\n---\n" + content;
        } else {
            content = "---\nlayout: default\n" + content.substr(4)
        }
        // replace all md links with their changed link
        content = content.replace(/\]\((?!https?:)(.*\.(html|md))(#[^\)]+)?\)/g, (x, link, fileExt, anchor) => {
            if (!link.startsWith('/')) {
                link = path.join(path.dirname(relative), link);
            }
            if (anchor === undefined) {
                anchor = '';
            }
            return '](' + changeLink(link).replace('.md', '.html') + anchor + ')';
        });
        // fix crosslinks between documents (../AQL/Geil/Aql.md => -aql-geil-aql.md => ../aql/geil-aql.md)
        content = content.replace(/\]\(-([^-]+)-([^\.]+)\.html\)/g, '](../\$1/\$2.html)');
        // replace all LOCAL images with images/IMAGEBASEPATH
        content = content.replace(/\]\((?!https?:).*?([^/]+\.png)\)/g, '](images/\$1)');
        
        content = content.replace(/^\s*@startDocuBlockInline.*?@endDocuBlock[^\n$]+\n/msg, (block) => {
            if (block.match(/@EXAMPLE_ARANGOSH.*/s)) {
                return `{% arangoshexample examplevar=\"examplevar\" short=\"short\" long=\"long\" %}${block}{% endarangoshexample %}\n{% include arangoshexample.html id=examplevar short=short long=long %}`;
            } else if (block.match(/@EXAMPLE_AQL.*/s)) {
                return `{% aqlexample examplevar=\"examplevar\" type=\"type\" query=\"query\" bind=\"bind\" result=\"result\" %}${block}{% endaqlexample %}\n{% include aqlexample.html id=examplevar query=query bind=bind result=result %}`;
            }
            return block;
        });

        return {
            name: fileName,
            content,
        };
    }));
    // console.log(files);
    return Promise.all(files.map(async (file) => {
        return await fs.writeFile(path.join(targetPath, file.name), file.content);
    }));
}

// verified beforehand that all imagenames are unique over all directories
async function migrateImages(basePath, targetPath) {
    const paths = await globby([basePath + "/**/*.png"]);
    return Promise.all(paths.map(image => {
        return fs.copyFile(image, path.join(targetPath, "images", path.basename(image)));
    }));
}

async function main(basePath, targetPath) {
    await mkdirp(path.join(targetPath, "images"));
    Promise.all([migrateImages(basePath, targetPath), migrateMds(basePath, targetPath)]);
}

const basePath = process.argv[2];
if (!basePath) {
    console.error('usage migrate <from> <to>');
    process.exit(1);
}

const targetPath = process.argv[3];
if (!targetPath) {
    console.error('usage migrate <from> <to>');
    process.exit(1);
}

fs.access(basePath).then(() => {
    return main(basePath, targetPath);
}, () => {
    console.error("Couldn't find " + basePath);
    process.exit(1);
})
.catch(e => {
    console.error(e);
    process.exit(2);
})
