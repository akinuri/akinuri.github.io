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

function getRelWindowRect(xPad = 0, yPad = 0) {
    let rect = {
        x: 0,
        y: 0,
        width: innerWidth,
        height: innerHeight,
    };
    if (xPad) {
        rect.x = xPad;
        rect.width -= xPad * 2;
    }
    if (yPad) {
        rect.y = yPad;
        rect.height -= yPad * 2;
    }
    return rect;
}
