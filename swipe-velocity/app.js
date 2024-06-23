let shape = new Circle(qs("#shape"));
let container = new Rectangle(qs("#container"));
shape.container = container;

container.center(shape);

function onDragStart(event) {
    event.preventDefault();
    const isTouchEvent = event.type === "touchstart";
    let containerRect = container.el.getBoundingClientRect();
    const startX = isTouchEvent
        ? event.touches[0].clientX - containerRect.left
        : event.clientX - containerRect.left;
    const startY = isTouchEvent
        ? event.touches[0].clientY - containerRect.top
        : event.clientY - containerRect.top;
    const offsetX = startX - shape.pos.x;
    const offsetY = startY - shape.pos.y;
    shape.logDragPos(startX, startY);
    let moveTimeoutHandle = null;
    const ALLOWED_RELEASE_DELAY = 50;
    let isDragEnded = false;
    let lastMoveTime = 0;
    let moveTimes = new Stack(100, true);
    function onMove(event) {
        let currentMoveTime = performance.now();
        if (lastMoveTime == 0) {
            lastMoveTime = currentMoveTime;
        }
        let elapsedMoveTime = currentMoveTime - lastMoveTime;
        moveTimes.push(elapsedMoveTime);
        lastMoveTime = currentMoveTime;
        const moveX = isTouchEvent
            ? event.touches[0].clientX - containerRect.left
            : event.clientX - containerRect.left;
        const moveY = isTouchEvent
            ? event.touches[0].clientY - containerRect.top
            : event.clientY - containerRect.top;
        let x = moveX - offsetX;
        let y = moveY - offsetY;
        shape.moveTo(x, y);
        shape.logDragPos(moveX, moveY);
        stats.updateDrag(shape, shape.calcDragVel(), moveTimes);
        clearTimeout(moveTimeoutHandle);
        moveTimeoutHandle = setTimeout(() => {
            if (isDragEnded) return;
            shape.logDragPos(moveX, moveY);
            shape.vel = Vector.createFromAngle(0, 0);
            stats.updateDrag(shape, shape.calcDragVel());
        }, ALLOWED_RELEASE_DELAY);
    }
    function onDragEnd(event) {
        isDragEnded = true;
        off(document, isTouchEvent ? "touchmove" : "mousemove", onMove);
        off(document, isTouchEvent ? "touchend" : "mouseup", onDragEnd);
        let moveDragVel = shape.calcDragVel();
        if (moveDragVel.getMagnitude() > 0) {
            shape.vel = moveDragVel;
            gameLoop();
        }
    }
    on(document, isTouchEvent ? "touchmove" : "mousemove", onMove);
    on(document, isTouchEvent ? "touchend" : "mouseup", onDragEnd, { once: true });
};

on(document, "touchstart", (e) => e.preventDefault(), { passive: false });

on(shape.el, "mousedown", onDragStart, { passive: false });
on(shape.el, "touchstart", onDragStart, { passive: false });

const FRICTION = 0.98;
let lastFrameTime = 0;
let rafId = 0;
let frameTimes = new Stack(100, true);
function gameLoop() {
    let currentFrameTime = performance.now();
    if (lastFrameTime == 0) {
        lastFrameTime = currentFrameTime;
    }
    let elapsedFrameTime = (currentFrameTime - lastFrameTime) / 1000;
    frameTimes.push(elapsedFrameTime);
    lastFrameTime = currentFrameTime;
    if (elapsedFrameTime == 0) {
        rafId = requestAnimationFrame(gameLoop);
        return;
    }
    shape.vel.multiply(FRICTION);
    stats.updateInertia(shape, shape.vel, frameTimes);
    shape.move(elapsedFrameTime);
    if (shape.vel.getMagnitude() > 2) {
        rafId = requestAnimationFrame(gameLoop);
    } else {
        shape.vel = Vector.createFromAngle(0, 0);
        stats.updateInertia(shape, shape.vel);
        lastFrameTime = 0;
    }
}
