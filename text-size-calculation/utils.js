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

function calcTextSize(text, fontSize, charWidthRatios, maxWidth = null) {
    let size = {
        width   : 0,
        height  : 0,
        lines   : 0,
    };
    // TODO: detect word breaking, max width, lines
    let words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let chars = word.split("");
        for (let char of chars) {
            if (char in charWidthRatios) {
                size.width += charWidthRatios[char] * fontSize;
            } else {
                console.warn(`The character ${char} could not be found in the width ratios dictionary.`);
            }
        }
        if (words.length != 1 && i != words.length - 1) {
            size.width += charWidthRatios[" "] * fontSize;
        }
    }
    size.height = fontSize;
    size.lines = size.height / fontSize;
    return size;
}