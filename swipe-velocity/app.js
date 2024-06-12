let shape = {
    el : qs("#shape"),
    width: qs("#shape").clientWidth,
    height: qs("#shape").clientHeight,
};

let bounds = {
    width : innerWidth,
    height : innerHeight,
};
on(window, "resize", () => {
    bounds.width = innerWidth;
    bounds.height = innerHeight;
});

function onDragStart(event) {
    const isTouchEvent = event.type === "touchstart";
    const startX = isTouchEvent ? event.touches[0].clientX : event.clientX;
    const startY = isTouchEvent ? event.touches[0].clientY : event.clientY;
    const offsetX = startX - shape.el.getBoundingClientRect().left;
    const offsetY = startY - shape.el.getBoundingClientRect().top;
    function onMove(event) {
        const moveX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const moveY = isTouchEvent ? event.touches[0].clientY : event.clientY;
        let x = moveX - offsetX;
        let y = moveY - offsetY;
        x = clamp(x, 0, bounds.width - shape.width);
        y = clamp(y, 0, bounds.height - shape.height);
        shape.el.style.left = `${x}px`;
        shape.el.style.top = `${y}px`;
    }
    function onDragEnd() {
        off(document, isTouchEvent ? "touchmove" : "mousemove", onMove);
        off(document, isTouchEvent ? "touchend" : "mouseup", onDragEnd);
    }
    on(document, isTouchEvent ? "touchmove" : "mousemove", onMove);
    on(document, isTouchEvent ? "touchend" : "mouseup", onDragEnd, { once: true });
};

on(shape.el, "mousedown", onDragStart);
on(shape.el, "touchstart", onDragStart);
