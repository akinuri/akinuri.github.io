let linearClockCanvas = document.getElementById("linear-clock");
let linearClockContext = linearClockCanvas.getContext("2d");

let oneHourWidthPx = 50;
let offsetHours = 0;

linearClockCanvas.width = oneHourWidthPx * 24;
linearClockCanvas.height = 200;

drawLinearClock(linearClockContext, offsetHours);

let rafHandle = null;
function draw() {
    drawLinearClock(linearClockContext, offsetHours);
    rafHandle = requestAnimationFrame(draw);
}

linearClockCanvas.addEventListener("mouseenter", draw);

linearClockCanvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    let dir = event.deltaY > 0 ? 1 : -1;
    offsetHours += dir;
    offsetHours = loop(offsetHours, -24, 24, "close");
});

linearClockCanvas.addEventListener("mouseleave", () => {
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
});
