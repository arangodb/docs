module.exports = function changeLink(relative) {
    let fileName = relative.toLowerCase().replace(/\/readme\.md$/, '.md').replace(/\.md$/, '').replace(/[^a-z0-9]+/g, '-') + '.md';
                
    // root level index
    if (fileName == 'readme.md') {
        fileName = 'index.md'
    }
    return fileName;
}