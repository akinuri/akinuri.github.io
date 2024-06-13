function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}

function getMagnitude(x, y) {
    return Math.hypot(x, y);
}

function calcRelAngleDegrees(originX, originY, targetX, targetY) {
    let deltaX = originX - targetX;
    let deltaY = originY - targetY;
    let angle = calcAngleDegrees(deltaX, deltaY);
    return angle;
}

function calcAngleDegrees(x, y) {
    let angle = rad2deg(Math.atan2(y, x));
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}

function rad2deg(angle) {
    return angle * 180 / Math.PI;
}
