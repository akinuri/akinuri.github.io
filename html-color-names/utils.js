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

function convertRgbToHsl(rgb) {
    let { red, green, blue, alpha } = rgb;
    red /= 255;
    green /= 255;
    blue /= 255;
    let max = Math.max(red, green, blue);
    let min = Math.min(red, green, blue);
    let lightness = (max + min) / 2;
    let hue;
    let saturation;
    if (max == min) {
        hue = 0;
        saturation = 0;
    } else {
        let chroma = max - min;
        saturation = chroma / (1 - Math.abs(2 * lightness - 1));
        switch (max) {
            case red:
                hue = (green - blue) / chroma + (green < blue ? 6 : 0);
                break;
            case green:
                hue = (blue - red) / chroma + 2;
                break;
            case blue:
                hue = (red - green) / chroma + 4;
                break;
        }
    }
    hue = Math.round(hue * 60);
    saturation = Math.round(saturation * 100);
    lightness = Math.round(lightness * 100);
    return { hue, saturation, lightness, alpha };
}

function convertHslToString(hsl) {
    let { hue, saturation, lightness, alpha } = hsl;
    let string = "";
    if (alpha !== undefined && alpha !== 1) {
        string = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    } else {
        string = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    return string;
}

