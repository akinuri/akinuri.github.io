function getBackground(colorInput, alphaInput) {
    let colorHex = colorInput.value;
    let alphaHex = getBackgroundAlphaHex(alphaInput);
    if (alphaHex == 0) {
        alphaHex = "00";
    }
    if (alphaHex != "ff") {
        colorHex += alphaHex;
    }
    return colorHex;
}

function getBackgroundAlphaHex(input) {
    let alpha = parseFloat(input.value) || 0;
    let alphaScaled = Math.round(alpha * 255);
    let alphaHex = alphaScaled.toString(16);
    return alphaHex;
}

function syncNumberInputAndRange(numberInput, range) {
    numberInput.addEventListener("input", () => {
        range.value = numberInput.value || 0;
    });
    range.addEventListener("input", () => {
        numberInput.value = range.value;
    });
}

function syncColorAndTextInput(color, textInput) {
    color.addEventListener("input", () => {
        textInput.value = color.value;
    });
    textInput.addEventListener("input", () => {
        color.value = textInput.value;
    });
}
