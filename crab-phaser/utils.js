function hsl2hex(h, s, l, a = 1) {
    // Convert hue to a value between 0 and 1
    h /= 360;
    // Convert saturation and lightness from percentage to a value between 0 and 1
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        // Achromatic (gray)
        r = g = b = l; // All colors are the same in gray (no saturation)
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    // Convert RGB values from 0-1 range to 0-255 range and round to integers
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    // Convert alpha to a value between 0 and 255 and round to integer
    const alpha = Math.round(a * 255);

    // Combine RGB and alpha into a single hexadecimal value
    const hex = (alpha << 24) + (r << 16) + (g << 8) + b;

    // Use >>> 0 to ensure the result is treated as an unsigned 32-bit integer
    return (alpha === 255) ? (hex & 0xFFFFFF) : (hex >>> 0);
}
