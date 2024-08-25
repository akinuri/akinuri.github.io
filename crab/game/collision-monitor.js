let CollisionMonitor = {
    doObjectsTouch(objA, objB) {
        let rectA = {
            left: objA.pos.x - objA.width / 2,
            right: objA.pos.x + objA.width / 2,
            top: objA.pos.y - objA.height / 2,
            bottom: objA.pos.y + objA.height / 2,
        };
        let rectB = {
            left: objB.pos.x - objB.width / 2,
            right: objB.pos.x + objB.width / 2,
            top: objB.pos.y - objB.height / 2,
            bottom: objB.pos.y + objB.height / 2,
        };
        if (
            rectA.left < rectB.right &&
            rectA.right > rectB.left &&
            rectA.top < rectB.bottom &&
            rectA.bottom > rectB.top
        ) {
            return true;
        }
        return false;
    },
};
