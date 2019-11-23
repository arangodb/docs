module.exports = function changeLink(relative) {
    let origLink = relative;

    // replace segment camel case
    // /Wurst/WALHasenPengPuff => /Wurst/WALHasen-Peng-Puff
    relative = relative.replace(/(?<![A-Z\/\\])([A-Z])/g, function(x, char) {
        return "-" + char;
    });
    if (relative.startsWith("-")) {
        relative = relative.substr(1);
    }
    relative = relative.toLowerCase();

    let fileName = relative
        .replace(/[\/\\](?:readme\.md|index\.html)$/, '')
        .replace(/\.(?:md|html)/, '')
        .replace(/[^a-z0-9]+/g, '-') + '.md';
    
    // root level index
    if (fileName == 'readme.md') {
        fileName = 'index.md'
    }

    //console.log(`${origLink} => ${fileName}`)

    return fileName;
}