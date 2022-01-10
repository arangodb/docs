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
    // NOTE globby >= 10 does not support backslashes anymore
    const searchPath = path.join(basePath, "**/*.md").replace(/\\/g, '/')
    const paths = (await globby([searchPath])).filter(filePath => {
        return path.relative(basePath, filePath).toLowerCase() !== 'summary.md';
    });

    const files = await Promise.all(paths.map(async (p) => {
        const absolute = await fs.realpath(p);
        const relative = path.relative(absoluteBasePath, absolute);
        
        const fileName = changeLink(relative);
        
        let book = path.basename(basePath);
        const version = targetPath.split("/")[0];
        let urlVersion = version;
        if (urlVersion == "3.6") {
            urlVersion = "devel";
        }

        if (book == "Users") {
            book = "";
        }

        const newUrl = "https://" + path.join("www.arangodb.com/docs/", targetPath, fileName.replace(/.md$/ig, ".html"));

        let oldUrl = relative.replace(/\/README.md$/ig, "/index.html");
        oldUrl = path.join("/", urlVersion, book, oldUrl.replace(/.md$/ig, ".html"));

        let oll = `/${urlVersion}`;
        if (book != "") {
            oll += `/${book}`;
        }
        oll += `/`;

        console.log(JSON.stringify({[oll]:  "https://" + path.join("www.arangodb.com/docs/", targetPath)}));
        console.log(JSON.stringify({[oll + "index.html"]:  "https://" + path.join("www.arangodb.com/docs/", targetPath)}));
        console.log(JSON.stringify({[oldUrl]: newUrl}));
        if (oldUrl.endsWith("/index.html")) {
            console.log(JSON.stringify({[oldUrl.substr(0, oldUrl.length - 10)]: newUrl}));
        }

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
                    .replace(/\n/g, ' ')
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
        
        // HACK: Fix cross-links
        content = content.replace(/\]\(https:\/\/docs\.arangodb\.com\/latest\/(.*?)\)/g, (fullMatch, link) => {
            link = path.relative(relative, link).replace(/\\/g, '/').replace(/\/index\.html/, '.html').replace(/\/README.md/, '.html');
            return `](${link})`;
        });
        content = content.replace(/\]\(https:\/\/www\.arangodb\.com\/docs\/stable\/(.*?)\)/g, (fullMatch, link) => {
            link = path.relative(relative, link).replace(/\\/g, '/').replace(/\/index\.html/, '.html').replace(/\/README.md/, '.html');
            console.dir({fullMatch, link});
            return `](${link})`;
        });

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
        content = content.replace(/^<!-- don't edit here.*?-->\s*$/msg, '');
        // replace all external links to open in a new tab (kramdown extension)
        content = content.replace(/\]\((https?:.*?)\)/g, '](\$1){:target="_blank"}');
        // fix crosslinks between documents (../AQL/Geil/Aql.md => -aql-geil-aql.md => ../aql/geil-aql.md)
        content = content.replace(/\]\(-([^-\/\.]+)-([^\.]+)\.html(#[^)]+)?\)/g, (x, manual, document, anchor) => {
            let link = "../"  + manual + "/";
            if (manual == "manual") {
                link = "../";
            }
            if (path.basename(basePath) == "Manual" || path.basename(basePath) == "Users") {
                link = link.substr(3);
            }
            link += `${document}.html`;
            if (anchor) {
                link += anchor;
            }

            return `](${link})`;
        });
        // replace all LOCAL images with images/IMAGEBASEPATH
        if (path.basename(basePath) == "Manual" || path.basename(basePath) == "Users") {
            content = content.replace(/\]\((?!https?:)[^\)]*?([^/)]+\.png)\)/g, '](images/\$1)');
        } else {
            content = content.replace(/\]\((?!https?:)[^\)]*?([^/)]+\.png)\)/g, '](../images/\$1)');
        }

        content = content.replace(/\]\((\.\.\/aql|-aql)\.html\)/g, '](aql/index.html)');
        content = content.replace(/\]\((\.\.\/http|-http)\.html\)/g, '](http/index.html)');
        content = content.replace(/\]\((\.\.\/drivers|-drivers)\.html\)/g, '](drivers/index.html)');
        content = content.replace(/\]\((\.\.\/cookbook|-cookbook)\.html\)/g, '](cookbook/index.html)');
        content = content.replace("(-aql-dataqueries.html)", "(../aql/dataqueries.html");
        content = content.replace("(appendix/errorcodes.html)", "(appendix-errorcodes.html");
        content = content.replace("(indexing/hash.html)", "indexing-hash.html");
        content = content.replace("(administration/arangosh.html)", "administration-arangosh.html");
        
        content = content.replace(/^\s*@startDocuBlockInline.*?@endDocuBlock[^\n$]+\n/msg, (block) => {
            if (block.match(/@EXAMPLE_ARANGOSH.*/s)) {
                return `{% arangoshexample examplevar=\"examplevar\" script=\"script\" result=\"result\" %}${block}{% endarangoshexample %}\n{% include arangoshexample.html id=examplevar script=script result=result %}`;
            } else if (block.match(/@EXAMPLE_AQL.*/s)) {
                return `{% aqlexample examplevar=\"examplevar\" type=\"type\" query=\"query\" bind=\"bind\" result=\"result\" %}${block}{% endaqlexample %}\n{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}`;
            }
            return block;
        });
        content = content.replace(/^\s*@startDocuBlock\s+program_options_(\w+).*$/mg, "{% assign options = site.data[\"" + version.replace('.', '') + "-program-options-\$1\"] %}{% include program-option.html options=options name=\"\$1\" %}");
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
    // NOTE globby >= 10 does not support backslashes anymore
    searchPath = path.join(basePath + "/**/*.png").replace(/\\/g, '/')
    const paths = await globby([searchPath]);
    let imagePath;
    if (path.basename(basePath) == "Manual" || path.basename(basePath) == "Users") {
        imagePath = path.join(targetPath, "images");
    } else {
        imagePath = path.join(targetPath, "..", "images");
    }

    await Promise.all(['https://docs.arangodb.com/3.0/Manual/Graphs/graph_user_in_group.png', 'https://docs.arangodb.com/3.0/Manual/Deployment/simple_cluster.png'].map(url => {
        return fetch(url)
        .then(result => result.buffer())
        .then(data => fs.writeFile(path.join(imagePath, path.basename(url)), data));
    }))
    return Promise.all(paths.map(image => {
        return fs.copyFile(image, path.join(imagePath, path.basename(image)));
    }));
}

async function main(basePath, targetPath) {
    await mkdirp(path.join(targetPath));
    if (path.basename(basePath) == "Manual" || path.basename(basePath) == "Users") {
        await mkdirp(path.join(targetPath, "images"));
    } else {
        await mkdirp(path.join(targetPath, "..", "images"));
    }

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
