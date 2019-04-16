const fs = require('fs');
const changeLink = require('./changeLink');

const filename = process.argv[2];

if (!filename) {
    console.error('Need a filename');
    process.exit(1);
}

const visited = [];

function parseNode(window, node) {
    if (node.tagName == "UL") {
        return {
            children: Array.from(node.childNodes).map(child => parseNode(window, child)).filter(result => result),
        }
    } else if (node.tagName == "LI") {
        const a = node.querySelector(':scope >a');
        const link = changeLink(a.href.replace('http://127.0.0.1:4000/3.4/', '')).replace(/\.md$/,'.html');

        // css selectors fail here because it is apparently? impossible to fetch only immediate children :S
        const xpathResultIterator = window.document.evaluate('ul', node, null, window.XPathResult.ANY_TYPE);
        let children = [];
        var thisNode = xpathResultIterator.iterateNext();
        
        while (thisNode) {
            children.push(thisNode);
            thisNode = xpathResultIterator.iterateNext();
        }

        return {
            href: link,
            text: a.textContent,
            children: children.map(child => parseNode(window, child)),
        }
    }
    // }
    // if (node.tagName == "LI") {
    //     const a = current.querySelector('a');
    //     const link = changeLink(a.href.replace('http://127.0.0.1:4000/3.4/', ''));

    //     return {
    //         href: link,
    //         text: a.textContent,
    //         children: ,
    //     }
    // } else if (node.tagName == "UL") {
    //     return {

    //     }
    // }node
    // return [...node.querySelectonoderAll(':scope > *')].reduce((obj, current) => {
    //   if (current.tagName == "ULnode") {
    //     obj.children = Array.from(current.children).map(child => parseNode(child));
    //   } else if (current.tagName == "LI") {
    //     const a = current.querySelector('a');
    //     const link = changeLink(a.href.replace('http://127.0.0.1:4000/3.4/', ''));

    //     obj.href = link;
  
    //     obj.children.push({
    //       href: link,
    //       text: a.textContent,
    //       children: parseNode(current).children,
    //     });
    //   }
    //   return obj;
    // }, {children: []});
}

const content = fs.readFileSync(filename).toString().split('\n').filter(line => !line.match(/^\s*<!--\s*SYNC.*$/g));

const parse = (lines) => {
    let stack = [];

    let current = [];
    let currentIndent = 0;
    while (lines.length > 0) {
        const line = lines.shift();
        if (line.match(/^\s*$/)) {
            continue;
        }
        const [_, spaces, item] = line.match(/^(\s*)(.*)/);
        let localIndent = spaces.length;
        if (localIndent > currentIndent) {
            let newItem = [];

            current[current.length - 1].children = newItem;
            stack.push({
                item: current,
                indent: localIndent - currentIndent,
            });
            current = newItem;

            currentIndent = localIndent;
        } else if (localIndent < currentIndent) {
            while (localIndent < currentIndent) {
                const stackItem = stack.pop();
                
                current = stackItem.item;
                currentIndent -= stackItem.indent;
            }
        }
        let result;
        if (result = item.match(/^#\s*Summary(.*)/)) {
            continue;
        } else if (item.match(/^#\s*/)) {
            continue;
        } else if (result = item.match(/^##\s*(.*)/)) {
            const [_, subtitle] = result;
            current.push({
                subtitle,
            });
        } else if (item.match(/^---$/)) {
            current.push({
                "divider": true,
            })
        } else if (result = item.match(/^\*\s*\[([^\]]+)\]\((.*)\)/)) {
            const [_, text, href] = result;
            current.push({
                href: changeLink(href.replace('http://127.0.0.1:4000/3.4/', '')).replace(/\.md$/,'.html'),
                text,
                children: [],
            })
        
        } else {
            throw new Error("Unexpected line " + line);
        }
    }

    while (stack.length > 0) {
        let stackItem = stack.pop();
        current = stackItem.item;
    }
    return current;
};

console.log(JSON.stringify(parse(content), null, 2));