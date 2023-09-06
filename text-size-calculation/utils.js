async function getFontData() {
    try {
        let fonts = await window.queryLocalFonts();
        let fontFamilies = groupByProperty(fonts, "family");
        return fontFamilies;
    } catch (err) {
        console.error(err.name, err.message);
    }
    return {};
}

function groupByProperty(arr, property) {
    return arr.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

function calculateCharWidthRatios(charElems) {
    if (charElems instanceof HTMLElement) {
        charElems = Array.from(charElems.children);
    }
    let ratios = {};
    for (let charEl of charElems) {
        let char = charEl.textContent.trim();
        if (char == "") {
            char = " ";
        }
        let width  = getComputedStyle(charEl).width;
        let height = getComputedStyle(charEl).height;
        width  = parseFloat(width);
        height = parseFloat(height);
        let widthRatio = width / height;
        ratios[char] = widthRatio;
    }
    return ratios;
}

function getTextFromEditableEl(el) {
    let text = "";
    const paragraphs = el.querySelectorAll("div");
    if (paragraphs.length) {
        text = [];
        paragraphs.forEach(paragraph => {
            text.push(paragraph.textContent.trim());
        });
        text = text.join("\n");
    } else {
        text = el.textContent.trim();
    }
    return text;
}

function calcTextSize(text, fontSize, charWidthRatios, containerWidth = null) {
    containerWidth = containerWidth || Infinity;
    let size = {
        width   : 0,
        height  : 0,
        lines   : [],
        containerWidth : containerWidth,
    };
    let spacedParagraphs = text.split("\n\n");
    for (let spacedParagraph of spacedParagraphs) {
        let adjacentParagraphs = spacedParagraph.split("\n");
        for (let adjacenParagraph of adjacentParagraphs) {
            let words = adjacenParagraph.split(" ");
            let line = [];
            while (words.length != 0) {
                let word = words.shift();
                line.push(word);
                let lineWidth = calcSingleLineTextWidth(line.join(" "), fontSize, charWidthRatios);
                if (lineWidth >= containerWidth) {
                    words.unshift(line.pop());
                    size.lines.push(line);
                    line = [];
                }
                lineWidth = calcSingleLineTextWidth(line.join(" "), fontSize, charWidthRatios);
                size.width = Math.max(size.width, lineWidth);
                if (words.length == 0 && line.length != 0) {
                    size.lines.push(line);
                }
            }
            line.push("\n");
        }
        size.lines.push(["\n"]);
    }
    size.lines.pop();
    size.height = size.lines.length * fontSize;
    return size;
}

function calcSingleLineTextWidth(text, fontSize, charWidthRatios) {
    let width = 0;
    let chars = text.split("");
    for (let char of chars) {
        if (char in charWidthRatios) {
            width += charWidthRatios[char] * fontSize;
        } else {
            console.warn(`The character ${char} could not be found in the width ratios dictionary.`);
        }
    }
    return width;
}

function getElMaxWidth(el) {
    let maxWidth = getComputedStyle(el).maxWidth;
    maxWidth = maxWidth != "none" ? parseFloat(maxWidth) : Infinity;
    return maxWidth;
}

function isElMaxWidthReached(el) {
    return el.clientWidth >= getElMaxWidth(el);
}