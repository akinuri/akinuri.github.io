function drawLinearClock(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    for (let i = 0; i < 24; i++) {
        let h = i + offsetHours;
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
