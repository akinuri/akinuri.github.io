async function loadLocalFonts(callerBtn) {
    let fonts = await getFontData();
    if (fonts.length == 0) {
        return;
    }
    localFontSelect.lastElementChild.remove();
    Object.keys(fonts).forEach(family => {
        let selected = "";
        if (family == defaultFontFamily) {
            selected = " selected";
        }
        localFontSelect.innerHTML += `
            <option${selected} style="font-family: '${family}'">${family}</option>
        `;
    });
    callerBtn.remove();
}

function changeFontFamily() {
    let value = localFontSelect.value;
    if (value == localFontSelect.dataset.placeholder) {
        value = defaultFontFamily;
    }
    document.body.style.setProperty("--font-family", value);
    updateCharWidthRatiosDict();
    printTextSize();
}

function printUppercaseLetters() {
    uppercaseContainer.innerHTML = "";
    uppercaseLettersBox.value.split("").forEach(letter => {
        uppercaseContainer.innerHTML += `<div class="bg-white shadow">${letter}</div>`;
    });
    updateCharWidthRatiosDict(uppercaseContainer);
}
function printLowercaseLetters() {
    lowercaseContainer.innerHTML = "";
    lowercaseLettersBox.value.split("").forEach(letter => {
        lowercaseContainer.innerHTML += `<div class="bg-white shadow">${letter}</div>`;
    });
    updateCharWidthRatiosDict(lowercaseContainer);
}
function printDigits() {
    digitsContainer.innerHTML = "";
    digitsBox.value.split("").forEach(digit => {
        digitsContainer.innerHTML += `<div class="bg-white shadow">${digit}</div>`;
    });
    updateCharWidthRatiosDict(digitsContainer);
}
function printOtherCharacters() {
    otherContainer.innerHTML = "";
    otherCharsBox.value.split("").forEach(letter => {
        otherContainer.innerHTML += `<div class="bg-white shadow">${letter}</div>`;
    });
    updateCharWidthRatiosDict(otherContainer);
}

function getCharContainers() {
    return {
        uppercase : uppercaseContainer,
        lowercase : lowercaseContainer,
        digit     : digitsContainer,
        other     : otherContainer,
    };
}

function updateCharWidthRatiosDict(containers) {
    if (containers instanceof HTMLElement) {
        containers = [containers];
    }
    containers = containers || Object.values(getCharContainers());
    for (const container of containers) {
        let containerRatios = calculateCharWidthRatios(container);
        charWidthRatiosDict = Object.assign(charWidthRatiosDict, containerRatios);
    }
}

function printTextSize() {
    let textEl     = document.querySelector("div[contentEditable]");
    let text       = getTextFromEditableEl(textEl);
    let htmlWidth  = parseFloat(getComputedStyle(textEl).width);
    let htmlHeight = parseFloat(getComputedStyle(textEl).height);
    let htmlLines  = htmlHeight / 16;
    output.htmlWidth.textContent  = toFixed(htmlWidth, 3);
    output.htmlHeight.textContent = toFixed(htmlHeight, 3);
    output.htmlLines.textContent  = toFixed(htmlLines, 3);
    let maxWidth = Infinity;
    if (isElMaxWidthReached(textEl)) {
        maxWidth = getElMaxWidth(textEl);
    }
    let size = calcTextSize(text, 16, charWidthRatiosDict, maxWidth);
    output.calcWidth.textContent   = toFixed(size.width, 3);
    output.calcHeight.textContent  = toFixed(size.height, 3);
    output.calcLines.textContent   = toFixed(size.lines.length, 3);
    output.matchWidth.textContent  = toFixed(size.width / htmlWidth, 3);
    output.matchHeight.textContent = toFixed(size.height / htmlHeight, 3);
    output.matchLines.textContent  = toFixed(size.lines.length / htmlLines, 3);
}

function toFixed(number, precision) {
    number = number.toFixed(precision);
    let [int, fraction] = number.split(".");
    number = int;
    if (fraction && fraction != "0".repeat(fraction.length)) {
        number = `${int}.${fraction}`;
    }
    return number;
}

function downloadCharWidthRatiosDict() {
    downloadViaAnchor(
        createJSONObjURL(charWidthRatiosDict),
        localFontSelect.value.toLowerCase() + "-width-ratio-dict.json",
    );
}

function createJSONObjURL(obj) {
    const str = JSON.stringify(obj);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    return url;
}

function downloadViaAnchor(url, filename) {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}