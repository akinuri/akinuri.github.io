function ints(min = 0, max = Number.MAX_SAFE_INTEGER, minCount = 2, maxCount = null) {
    let ints = [];
    let count = maxCount
        ? int(minCount, maxCount)
        : minCount;
    for (let i = 0; i < count; i++) {
        ints.push(int(min, max));
    }
    return ints;
}