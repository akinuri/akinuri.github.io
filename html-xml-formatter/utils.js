function parseXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const root = xmlDoc.documentElement;
    return root;
}

function formatXML(element) {
    return formatAttributes(element).trim();
}

function formatAttributes(element, level = 0) {
    const indent = '    ';
    const newline = '\n';
    let result = `${newline}${indent.repeat(level)}<${element.tagName}`;
    for (let attr of element.attributes) {
        result += `${newline}${indent.repeat(level + 1)}${attr.name}="${attr.value}"`;
    }
    result += `${newline}${indent.repeat(level + 1)}>`;
    if (element.children.length > 0 || element.textContent.trim()) {
        if (element.textContent.trim()) {
            result += `${newline}${indent.repeat(level + 1)}${element.textContent.trim()}`;
        }
        for (let child of element.children) {
            result += formatAttributes(child, level + 1);
        }
        result += `${newline}${indent.repeat(level)}</${element.tagName}>`;
    } else {
        result = result.slice(0, -1);
        result += `/>`;
    }
    return result;
}