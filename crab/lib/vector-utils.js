function getMagnitude(x, y) {
    return Math.hypot(x, y);
}

function rad2deg(angleInRadians) {
    const RAD_IN_DEG = 360 / (2 * Math.PI);
    return angleInRadians * RAD_IN_DEG;
}

function deg2rad(angleInDegrees) {
    const DEG_IN_RAD = (2 * Math.PI) / 360;
    return angleInDegrees * DEG_IN_RAD;
}

function angleFromCoords(x, y) {
    let rad = Math.atan2(y, x);
    if (rad < 0) rad += 2 * Math.PI;
    return rad2deg(rad);
}

function coordsFromVector(angle, magnitude = 1) {
    let { x, y } = coordsFromAngle(angle);
    return {
        x: x * magnitude,
        y: y * magnitude,
    };
}

function coordsFromAngle(angle) {
    angle = deg2rad(angle);
    return {
        x: Math.cos(angle),
        y: Math.sin(angle),
    };
}

function posOffset(pos1, pos2, dir = 1) {
    return {
        x: pos1.x + pos2.x * dir,
        y: pos1.y + pos2.y * dir,
    };
}

function posDiff(pos1, pos2) {
    return {
        x: pos2.x - pos1.x,
        y: pos2.y - pos1.y,
    };
}

function posDist(pos1, pos2) {
    return getMagnitude(...Object.values(posDiff(pos1, pos2)));
}

function getPixelInTime(pixelsPerSecond, elapsedFrameTime) {
    return (elapsedFrameTime / 1000) * pixelsPerSecond;
}

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}