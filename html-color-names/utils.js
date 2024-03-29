function convertRgbToHex(rgb) {
    const { red, green, blue, alpha } = rgb;
    const hexRed = red.toString(16).padStart(2, '0');
    const hexGreen = green.toString(16).padStart(2, '0');
    const hexBlue = blue.toString(16).padStart(2, '0');
    const hexAlpha = Math.round(alpha * 255).toString(16).padStart(2, '0');
    const hex = {
        red: hexRed,
        green: hexGreen,
        blue: hexBlue,
        alpha: hexAlpha,
    };
    return hex;
}

function buildRgbFrom(red, green, blue, alpha = 1) {
    return { red, green, blue, alpha };
}

function convertHexToString(
    hex,
    includeHash = true,
    includeAlpha = false,
    alphaPos = "right",
) {
    let string = hex.red + hex.green + hex.blue;
    if (includeAlpha) {
        if (alphaPos === "left") {
            string = hex.alpha + string;
        } else {
            string = string + hex.alpha;
        }
    }
    if (includeHash) {
        string = "#" + string;
    }
    return string;
}
