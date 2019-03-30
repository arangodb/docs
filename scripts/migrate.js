const fs = require('fs').promises;
const path = require('path');
const globby = require('globby');
const changeLink = require('./changeLink');

(async () => {
    try {
        const basePath = "../arangodb/Documentation/Books/Manual";
        const absoluteBasePath = await fs.realpath(basePath);
        const paths = await globby([basePath + "/**/*.md"]);
        const files = await Promise.all(paths.map(async (p) => {
            const absolute = await fs.realpath(p);
            const relative = path.relative(absoluteBasePath, absolute);
            
            const fileName = changeLink(relative);

            let content = (await fs.readFile(p)).toString();
            if (!content.startsWith("---\n")) {
                content = "---\nlayout: default\n---\n" + content;
            }
            return {
                name: fileName,
                content,
            };
        }));
        // console.log(files);
        await Promise.all(files.map(async (file) => {
            return await fs.writeFile('3.4/' + file.name, file.content);
        }));
    } catch (e) {
        console.error(e);
    }
})();
