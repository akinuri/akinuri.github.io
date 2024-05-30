function int(min = 0, max = Number.MAX_SAFE_INTEGER) {
    if (arguments.length === 1) {
        max = min;
        min = 0;
    }
    min = Math.ceil(Math.max(Number.MIN_SAFE_INTEGER, min));
    max = Math.floor(Math.min(Number.MAX_SAFE_INTEGER, max));
    if (min > max) {
        throw new Error("'max' must be greater than or equal to 'min'.");
    }
    const int = Math.floor(Math.random() * (max - min + 1)) + min;
    return int;
}