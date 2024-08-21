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

Math.avg = function avg() {
    let numbers = Array.from(arguments).flat(Infinity);
    return Math.sum(numbers) / numbers.length;
};

Math.sum = function sum() {
    let numbers = Array.from(arguments).flat(Infinity);
    return numbers.reduce(function (sum, currentValue) {
        return sum + (parseFloat(currentValue) || 0);
    }, 0);
};

function random(min, max) {
    return min + Math.random() * (max - min);
}
