/* Get an approximate word count for each documentation section

1. Delete target files and cache to avoid any issues
   rm -rf _site_minimal/ .jekyll-cache/ .jekyll-metadata
2. Build docs with minimal layout for content only
   bundle exec jekyll build --layouts _layout_minimal --destination _site_minimal
3. Install Node.js dependency
   npm install word-counting
4. Adjust root paths if necessary
5. Run the script
   node wordCount.js

*/

const path = require("path");
const fs = require("fs");
const wc = require("word-counting");

const roots = [
    "./_site_minimal/3.8/",
    "./_site_minimal/3.8/aql/",
    "./_site_minimal/3.8/http/",
    "./_site_minimal/3.8/drivers/",
    "./_site_minimal/3.8/oasis/",
];

let totals = new Map();

for (let root of roots) {
    let total = 0;
    const files = fs.readdirSync(root, { withFileTypes: true });
    for(let file of files) {
        if (!file.isFile()) continue;
        if (!file.name.endsWith(".html")) continue;
        const filepath = path.join(root, file.name);
        const data = fs.readFileSync(filepath, "utf8")
        const count = wc(data, { isHtml: true });
        if (!count) throw count;
        total += count.wordsCount;
        console.log(`${String(count.wordsCount).padStart(8)}  ${filepath}`);
    }
    totals.set(root, total);
}

console.log("Totals:");
for (let [k,v] of totals.entries()) {
    console.log(`${path.basename(k).includes(".") ? "manual" : path.basename(k)} = ${v}`);
}
