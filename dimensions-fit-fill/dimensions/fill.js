function fill(
    width,
    height,
    maxWidth,
    maxHeight,
    alignment = "center"
) {
    let validAlignmentValues = [
        "left top",
        "left center",
        "left bottom",
        "center top",
        "center center",
        "center",
        "center bottom",
        "right top",
        "right center",
        "right bottom",
    ];
    if (!validAlignmentValues.includes(alignment)) {
        throw new Error("Invalid alignment value.");
    }
    if (alignment == "center") {
        alignment = "center center";
    }
    const [horizontalAlign, verticalAlign] = alignment.split(" ");
    const result = {
        width   : 0,
        height  : 0,
        top     : null,
        left    : null,
        right   : null,
        bottom  : null,
        alignment : alignment,
    };
    if (width <= maxWidth && height <= maxHeight) {
        result.width = width;
        result.height = height;
    } else {
        const ratioWidth = maxWidth / width;
        const ratioHeight = maxHeight / height;
        const ratio = Math.max(ratioWidth, ratioHeight);
        result.width = width * ratio;
        result.height = height * ratio;
    }
    if (horizontalAlign === "left") {
        result.left = 0;
    } else if (horizontalAlign === "center") {
        result.left = (maxWidth - result.width) / 2;
        result.right = result.left;
    } else if (horizontalAlign === "right") {
        result.right = 0;
    }
    if (verticalAlign === "top") {
        result.top = 0;
    } else if (verticalAlign === "center") {
        result.top = (maxHeight - result.height) / 2;
        result.bottom = result.top;
    } else if (verticalAlign === "bottom") {
        result.bottom = 0;
    }
    return result;
}