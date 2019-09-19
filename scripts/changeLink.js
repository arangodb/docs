module.exports = function changeLink(relative) {
    // replace segment camelcase
    // /Wurst/WALHasenPengPuff => /Wurst/WALHasen-peng-puff
    relative = relative.replace(/(?<![A-Z\/])([A-Z])/g, function(x, char) {
        return "-" + char.toLowerCase();
    });
    if (relative.startsWith("-")) {
        relative = relative.substr(1);
    }
    relative = relative.toLowerCase();
    let fileName = relative
        .replace(/\/(readme\.md|index\.html)$/, '')
        .replace(/\.(md|html)/, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace('-readme', '') + '.md';
    
    // root level index
    if (fileName == 'readme.md') {
        fileName = 'index.md'
    }

    return fileName;
}