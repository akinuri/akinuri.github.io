var elem = function (tagName, attributes, children) {
    let parent;
    if (typeof tagName == "string") {
        parent = document.createElement(tagName);
    } else if (tagName instanceof HTMLElement) {
        parent = tagName;
    }
    if (attributes) {
        for (let attribute in attributes) {
            parent.setAttribute(attribute, attributes[attribute]);
        }
    }
    if (children) {
        elem.append(parent, children);
    }
    return parent;
};

elem.append = function (parent, children) {
    if (children instanceof Array) {
        children.forEach(function (child) {
            elem.append(parent, child);
        });
    }
    else if (children instanceof HTMLElement || children instanceof Text) {
        parent.appendChild(children);
    }
    else if (typeof children == "string" || typeof children == "number") {
        parent.appendChild(document.createTextNode(children));
    }
    else if (typeof children == "function") {
        elem.append(parent, children());
    }
};