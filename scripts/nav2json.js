const jsdom = require("jsdom");
const fs = require('fs');
const showdown  = require('showdown');
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
        const xpathResultIterator = window.document.evaluate('ul/li', node, null, window.XPathResult.ANY_TYPE);
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

const converter = new showdown.Converter({disableForced4SpacesIndentedSublists: true});
const content = fs.readFileSync(filename);

const html = converter.makeHtml(content.toString());

const { JSDOM } = jsdom;
const dom = new JSDOM(html);

// console.log(html);

const result = Array.from(dom.window.document.body.childNodes).reduce((result, node) => {
    if (node.tagName == "H2") {
        result.push(
            {
                "subtitle": node.textContent,
            }
        );
    } else if (node.tagName == "HR") {
        result.push({
            divider: true,
        });
    } else if (node.tagName == "UL") {
        // ignore first UL...just take children directly
        result = result.concat(Array.from(node.childNodes).map(node => parseNode(dom.window, node))).filter(node => node);
    }
    return result;
}, []);

console.log(JSON.stringify(result, undefined, "  "));

// console.log(JSON.stringify(parseNode(dom.window, dom.window.document.body.querySelectorAll(":scope > ul")), undefined, '  '));