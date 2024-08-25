function getWindowSize() {
    return {
        width: innerWidth,
        height: innerHeight,
    };
}

function getWindowCenter() {
    let ws = getWindowSize();
    return {
        x: ws.width / 2,
        y: ws.height / 2,
    };
}

function el(html) {
    let tempEl = document.createElement("div");
    tempEl.innerHTML = html;
    return Array.from(tempEl.children);
}

function applyStyle(el, styles) {
    for (const prop in styles) {
        if (Object.prototype.hasOwnProperty.call(styles, prop)) {
            const value = styles[prop];
            el.style[prop] = value;
        }
    }
}
