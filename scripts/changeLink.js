const camelCaseToSnakeCase = function(str) {
    let converted = "";
    for (let i=0;i<str.length;i++) {
        if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
            if (i == 0 || str[i] == '/') {
                converted += str[i].toLowerCase();
            } else {
                converted += "-" + str[i].toLowerCase();
            }
        } else {
            converted += str[i];
        }
    }
    return converted;
}

const uppercases = ["AQL", "MacOS", "CLI", "README", "DC2DC", "DCOS", "AWS", "DB", "WAL", "OS"];

module.exports = function changeLink(relative) {
    relative = uppercases.reduce((relative, current) => {
        return relative.replace(current, current[0] + current.substr(1).toLowerCase());
    }, relative);
    
    relative = camelCaseToSnakeCase(relative);
    let fileName = relative.replace(/\/readme\.md$/, '.md').replace(/\.md$/, '').replace(/[^a-z0-9]+/g, '-') + '.md';
                
    // root level index
    if (fileName == 'readme.md') {
        fileName = 'index.md'
    }
    return fileName;
}