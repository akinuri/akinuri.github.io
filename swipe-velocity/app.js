let shape = new Circle(qs("#shape"));
let container = new Rectangle(0, 0, innerWidth, innerHeight);
shape.container = container;

shape.moveTo(innerWidth / 2 - shape.radius, innerHeight / 2 - shape.radius);

on(window, "resize", () => {
    container.width = innerWidth;
    container.height = innerHeight;
});

function onDragStart(event) {
    event.preventDefault();
    const isTouchEvent = event.type === "touchstart";
    const startX = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const startY = isTouchEvent ? event.touches[0].clientY : event.clientY;
    const offsetX = startX - shape.el.getBoundingClientRect().left;
    const offsetY = startY - shape.el.getBoundingClientRect().top;
    shape.logDragPos(startX, startY);
    function onMove(event) {
        const moveX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const moveY = isTouchEvent ? event.touches[0].clientY : event.clientY;
        let x = moveX - offsetX;
        let y = moveY - offsetY;
        shape.moveTo(x, y);
        shape.logDragPos(moveX, moveY);
        let dragVel = shape.calcDragVel();
        stats.pos.x.textContent = (shape.getCenterPos().x).toFixed(0);
        stats.pos.y.textContent = (shape.getCenterPos().y).toFixed(0);
        stats.vel.mag.textContent = dragVel.getMagnitude().toFixed(1);
        stats.vel.ang.textContent = dragVel.getAngle(-1).toFixed(1) + "°";
        stats.vel.angIcon.style.setProperty("--rotate", dragVel.getAngle(-1) + "deg");
    }
    function onDragEnd(event) {
        off(document, isTouchEvent ? "touchmove" : "mousemove", onMove);
        off(document, isTouchEvent ? "touchend" : "mouseup", onDragEnd);
        let moveDragVel = shape.calcDragVel();
        const moveX = isTouchEvent ? event.changedTouches[0].clientX : event.clientX;
        const moveY = isTouchEvent ? event.changedTouches[0].clientY : event.clientY;
        shape.logDragPos(moveX, moveY);
        let endDragVel = shape.calcDragVel();
        let moveElapsed = shape.dragPosLog.peek(0).time - shape.dragPosLog.peek(1).time;
        const ALLOWED_RELEASE_DELAY = 50;
        if (moveElapsed > ALLOWED_RELEASE_DELAY) {
            shape.logDragPos(moveX, moveY);
            shape.vel = Vector.createFromAngle(0, 0);
            stats.vel.mag.textContent = endDragVel.getMagnitude().toFixed(1);
            stats.vel.ang.textContent = endDragVel.getAngle().toFixed(1) + "°";
            stats.vel.angIcon.style.setProperty("--rotate", endDragVel.dir + "deg");
        } else {
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
function gameLoop() {
    let currentFrameTime = performance.now();
    if (lastFrameTime == 0) {
        lastFrameTime = currentFrameTime;
    }
    let elapsedFrameTime = (currentFrameTime - lastFrameTime) / 1000;
    lastFrameTime = currentFrameTime;
    if (elapsedFrameTime == 0) {
        requestAnimationFrame(gameLoop);
        return;
    }
    shape.vel.multiply(FRICTION);
    shape.move(elapsedFrameTime);
    if (shape.vel.getMagnitude() > 2) {
        requestAnimationFrame(gameLoop);
    } else {
        shape.vel = Vector.createFromAngle(0, 0);
        lastFrameTime = 0;
    }
}
