module.exports = function changeLink(relative) {
    relative = relative.toLowerCase();
    let fileName = relative.replace(/\/readme\.md$/, '.md').replace(/\.(md|html)$/, '').replace(/[^a-z0-9]+/g, '-') + '.md';
                
    // root level index
    if (fileName == 'readme.md') {
        fileName = 'index.md'
    }
    return fileName;
}