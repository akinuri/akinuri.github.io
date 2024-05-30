function hexColors(minCount = 1, maxCount = 2) {
    if (arguments.length === 1) {
        maxCount = minCount;
        minCount = 1;
    }
    let colors = [];
    let count = int(minCount, maxCount);
    for (let i = 0; i < count; i++) {
        colors.push(hexColor());
    }
    return colors;
}