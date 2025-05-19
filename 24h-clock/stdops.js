/**
 * Loops a numeric value within a specified range, either open or closed.
 *
 * @param {number} number - The value to loop within the range.
 * @param {number} min - The minimum bound of the range.
 * @param {number} max - The maximum bound of the range.
 * @param {"open"|"close"} [loopType="open"] - Determines if the range is open (excludes max) or closed (includes max).
 * - open  : first and the last values are NOT the same, e.g. 1-7 (days of week)
 * - close : first and the last values are the same, e.g. 0-360 degrees
 * @returns {number} The value wrapped within the specified range.
 * @throws {Error} If an invalid loopType is provided.
 */
function loop(number, min, max, loopType = "open") {
    if (!["open", "close"].includes(loopType)) {
        throw new Error("Invalid loop type. Use 'open' or 'close'.");
    }
    let loopTypeOffset = loopType == "open" ? 1 : 0;
    let rangeSize = max - min + loopTypeOffset;
    number = ((number - min) % rangeSize) + min;
    if (number < min) {
        number += rangeSize;
    }
    return number;
}
