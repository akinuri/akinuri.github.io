function drawLinearClock(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();

    for (let hour = 0; hour < 24; hour++) {
        let x = hour * oneHourWidthPx;
        x += offsetPx;
        x = loop(x, 0, context.canvas.width, "close");

        const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
        gradient.addColorStop(0, "hsla(0, 0%, 50%, 0.5)");
        gradient.addColorStop(1, "hsla(0, 0%, 50%, 0)");

        context.beginPath();
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, context.canvas.height);
        context.strokeStyle = gradient;
        if (hour == 0) {
            context.strokeStyle = "hsl(0, 0%, 0%, 0.33)";
        }
        context.lineWidth = 1;
        context.stroke();

        context.font = "14px Arial";
        context.fontWeight = "bold";
        context.fillStyle = "dimgray";
        if (hour == 0) {
            context.fillStyle = "black";
        }
        context.fillText(hour, x + 5, 20);
    }

    let date = new Date();
    let second = date.getSeconds();
    let secondX = (context.canvas.width / 60) * second;
    secondX += offsetPx;
    secondX = loop(secondX, 0, context.canvas.width, "close");

    const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
    gradient.addColorStop(0, "hsla(0, 100%, 50%, 0)");
    gradient.addColorStop(1, "hsla(0, 100%, 50%, 0.5)");

    context.beginPath();
    context.moveTo(secondX + 0.5, 0);
    context.lineTo(secondX + 0.5, context.canvas.height);
    context.strokeStyle = gradient;
    context.lineWidth = 2;
    context.stroke();

    context.restore();
}
