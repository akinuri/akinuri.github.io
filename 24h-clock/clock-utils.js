function drawLinearClock(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    
    let hourStart = Math.floor(offsetPx / oneHourWidthPx) * -1;
    hourStart = loop(hourStart, 0, 24, "close");
    let realOffsetPx = offsetPx % oneHourWidthPx;
    if (realOffsetPx < 0) {
        realOffsetPx += oneHourWidthPx;
    }
    
    context.translate(realOffsetPx, 0);
    
    for (let i = 0; i < 24; i++) {
        let h = i + hourStart;
        h = loop(h, 0, 24, "close");

        context.beginPath();
        context.moveTo(i * oneHourWidthPx + 0.5, 0);
        context.lineTo(i * oneHourWidthPx + 0.5, context.canvas.height);
        context.strokeStyle = "silver";
        if (h == 0) {
            context.strokeStyle = "black";
        }
        context.lineWidth = 1;
        context.stroke();

        context.font = "14px Arial";
        context.fontWeight = "bold";
        context.fillStyle = "dimgray";
        if (h == 0) {
            context.fillStyle = "black";
        }
        context.fillText(h, i * oneHourWidthPx + 5, 20);
    }
    context.restore();
}
