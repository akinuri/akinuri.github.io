function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

function getMagnitude(x, y) {
    return Math.hypot(x, y);
}

function calcRelAngleDegrees(originX, originY, targetX, targetY) {
    return calcAngleDegrees(
        targetX - originX,
        targetY - originY,
    );
}

function calcAngleDegrees(x, y) {
    let rad = Math.atan2(y, x);
    if (rad < 0) rad += 2 * Math.PI;
    return rad2deg(rad);
}

function rad2deg(angleInRadians) {
    const RAD_IN_DEG = 360 / (2 * Math.PI);
    return angleInRadians * RAD_IN_DEG;
}
