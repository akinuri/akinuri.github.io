let shape = new Circle(qs("#shape"));

let container = new Rectangle(innerWidth, innerHeight);

on(window, "resize", () => {
    container.width = innerWidth;
    container.height = innerHeight;
});

function onDragStart(event) {
    event.preventDefault();
    const isTouchEvent = event.type === "touchstart";
    const startX = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const startY = isTouchEvent ? event.touches[0].clientY : event.clientY;
    let lastX = startX;
    let lastY = startY;
    let lastTime = performance.now();
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    function onMove(event) {
        const moveX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const moveY = isTouchEvent ? event.touches[0].clientY : event.clientY;
        let x = moveX - offsetX;
        let y = moveY - offsetY;
        x = clamp(x, 0, container.width - shape.radius);
        y = clamp(y, 0, container.height - shape.radius);
        shape.el.style.left = `${x}px`;
        shape.el.style.top = `${y}px`;
        stats.pos.x.textContent = x + shape.radius;
        stats.pos.y.textContent = y + shape.radius;

        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000;
        const deltaX = moveX - lastX;
        const deltaY = moveY - lastY;
        
        const velX = deltaX / deltaTime;
        const velY = deltaY / deltaTime;
        
        let angle = calcRelAngleDegrees(-lastX, lastY, -moveX, moveY);
        stats.vel.mag.textContent = getMagnitude(velX, velY).toFixed(1);
        stats.vel.ang.textContent = angle.toFixed(1) + "°";
        stats.vel.angIcon.style.setProperty("--rotate", angle + "deg");
        
        lastX = moveX;
        lastY = moveY;
        lastTime = currentTime;
    }
    function onDragEnd() {
        off(document, isTouchEvent ? "touchmove" : "mousemove", onMove);
        off(document, isTouchEvent ? "touchend" : "mouseup", onDragEnd);
    }
    on(document, isTouchEvent ? "touchmove" : "mousemove", onMove);
    on(document, isTouchEvent ? "touchend" : "mouseup", onDragEnd, { once: true });
};

on(shape.el, "mousedown", onDragStart, { passive: false });
on(shape.el, "touchstart", onDragStart, { passive: false });
