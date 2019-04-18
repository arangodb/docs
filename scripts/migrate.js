const fs = require('fs').promises;
const path = require('path');
const globby = require('globby');
const changeLink = require('./changeLink');
const mkdirp = require('mkdirp');
const markedIt = require('marked-it-core');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

async function migrateMds(basePath, targetPath) {
    const absoluteBasePath = await fs.realpath(basePath);
    const paths = (await globby([path.join(basePath, "**/*.md")])).filter(filePath => {
        return path.relative(basePath, filePath).toLowerCase() !== 'summary.md';
    });
    const files = await Promise.all(paths.map(async (p) => {
        const absolute = await fs.realpath(p);
        const relative = path.relative(absoluteBasePath, absolute);
        
        const fileName = changeLink(relative);

        let content = (await fs.readFile(p)).toString();
        const result = markedIt.generate(content);
        const dom = new JSDOM(result.html.text);

        let description = null;
        const paragraph = dom.window.document.querySelector("p");
        if (paragraph) {
            if (paragraph.querySelector('code')) {
                const headline = dom.window.document.querySelector("h1, h2, h3, h4, h5, h6");
                if (headline) {
                    description = headline.textContent;
                }
            } else {
                description = paragraph.textContent
                    .replace(/\n/g, '')
                    .replace(/(.*?)[\.:].*/ms, '\$1')
                    .replace(/{%\s*hint[^%]*\s*%}/, '')
                    .replace(/{%\s*endhint\s*%}/, '')
                    .trim();

                if (description.startsWith('@startDocuBlock')) {
                    description = null;
                }
            }
        }

        let header = "---\nlayout: default\n";
        if (description) {
            header += "description: " + description + "\n";
        }

        if (!content.startsWith("---\n")) {
            content = header + "---\n" + content;
        } else {
            content = header + content.substr(4)
        }
        content = content.replace("ArangoDB VERSION_NUMBER", "ArangoDB {{ site.data.versions[page.version.name] }}");
        
        // replace all md links with their changed link
        content = content.replace(/\]\((?!https?:)(.*?\.(html|md))(#[^\)]+)?\)/g, (x, link, fileExt, anchor) => {
            if (!link.startsWith('/')) {
                link = path.join(path.dirname(relative), link);
            }
            if (anchor === undefined) {
                anchor = '';
            }
            return '](' + changeLink(link).replace('.md', '.html') + anchor + ')';
        });
        // fix crosslinks between documents (../AQL/Geil/Aql.md => -aql-geil-aql.md => ../aql/geil-aql.md)
        content = content.replace(/\]\(-([^-]+)-([^\.]+)\.html(#[^)]+)?\)/g, '](../\$1/\$2.html\$3)');
        // replace all LOCAL images with images/IMAGEBASEPATH
        content = content.replace(/\]\((?!https?:)[^\)]*?([^/)]+\.png)\)/g, '](../images/\$1)');

        content = content.replace(/\]\((\.\.\/aql|-aql)\.html\)/g, '](../aql/)');
        content = content.replace(/\]\((\.\.\/http|-http)\.html\)/g, '](../http/)');
        content = content.replace(/\]\((\.\.\/drivers|-drivers)\.html\)/g, '](../drivers/)');
        content = content.replace(/\]\((\.\.\/cookbook|-cookbook)\.html\)/g, '](../cookbook/)');
        content = content.replace("(-aql-dataqueries.html)", "(../aql/dataqueries.html");
        content = content.replace("(appendix/errorcodes.html)", "(appendix-errorcodes.html");
        content = content.replace("(indexing/hash.html)", "indexing-hash.html");
        content = content.replace("(administration/arangosh.html)", "administration-arangosh.html");
        
        content = content.replace(/^\s*@startDocuBlockInline.*?@endDocuBlock[^\n$]+\n/msg, (block) => {
            if (block.match(/@EXAMPLE_ARANGOSH.*/s)) {
                return `{% arangoshexample examplevar=\"examplevar\" script=\"script\" result=\"result\" %}${block}{% endarangoshexample %}\n{% include arangoshexample.html id=examplevar script=script result=result %}`;
            } else if (block.match(/@EXAMPLE_AQL.*/s)) {
                return `{% aqlexample examplevar=\"examplevar\" type=\"type\" query=\"query\" bind=\"bind\" result=\"result\" %}${block}{% endaqlexample %}\n{% include aqlexample.html id=examplevar query=query bind=bind result=result %}`;
            }
            return block;
        });
        content = content.replace(/^\s*@startDocuBlock\s+(\w+).*$/mg, "{% docublock \$1 %}")

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
    const paths = await globby([path.join(basePath + "/**/*.png")]);
    await Promise.all(['https://docs.arangodb.com/3.0/Manual/Graphs/graph_user_in_group.png', 'https://docs.arangodb.com/3.0/Manual/Deployment/simple_cluster.png'].map(url => {
        return fetch(url)
        .then(result => result.buffer())
        .then(data => fs.writeFile(path.join(targetPath, "..", "images", path.basename(url)), data));
    }))
    return Promise.all(paths.map(image => {
        return fs.copyFile(image, path.join(targetPath, "..", "images", path.basename(image)));
    }));
}

async function main(basePath, targetPath) {
    await mkdirp(path.join(targetPath));
    await mkdirp(path.join(targetPath, "..", "images"));
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
}, e => {
    console.error(e);
    process.exit(2);
})
