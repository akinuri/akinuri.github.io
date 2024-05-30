function rgbColor(rgbVals = null) {
    rgbVals = rgbVals || rgbValues();
    return `rgb(${rgbVals[0]}, ${rgbVals[1]}, ${rgbVals[2]})`;
}