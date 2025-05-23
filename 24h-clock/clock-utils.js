function drawLinearClock(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();

    dayBg: {
        let dayGradientCanvas = buildDayGradient(context.canvas.width, context.canvas.height);
        dayGradientCanvas = loopCanvas(dayGradientCanvas, offsetPx * -1);
        context.drawImage(dayGradientCanvas, 0, 0, context.canvas.width, context.canvas.height);
    }

    hourMarks: {
        for (let hour = 0; hour < 24; hour++) {
            let x = hour * oneHourWidthPx;
            x += offsetPx;
            x = loop(x, 0, context.canvas.width, "close");

            const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height / 2);
            gradient.addColorStop(0, "hsl(0, 0%, 50%, 0.5)");
            gradient.addColorStop(1, "hsl(0, 0%, 50%, 0)");

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
            context.fillStyle = "hsl(0, 0%, 0%, 0.5)";
            if (hour == 0) {
                context.fillStyle = "hsl(0, 0%, 0%)";
            }
            context.fillText(hour, x + 5, 20);
        }
    }

    minuteMarks: {
        for (let minute = 0; minute < 60; minute++) {
            let x = minute * oneMinuteWidthPx;
            x += offsetPx;
            x = loop(x, 0, context.canvas.width, "close");

            const gradient = context.createLinearGradient(0, context.canvas.height * 0.9, 0, context.canvas.height);
            gradient.addColorStop(0, "hsl(0, 0%, 50%, 0)");
            gradient.addColorStop(1, "hsl(0, 0%, 50%, 0.5)");

            context.save();
            context.beginPath();
            context.moveTo(x + 0.5, context.canvas.height * 0.9);
            context.lineTo(x + 0.5, context.canvas.height);
            context.strokeStyle = gradient;
            context.lineWidth = 1;
            context.stroke();
            context.restore();

            if (minute % 5 == 0) {
                const gradient = context.createLinearGradient(
                    0,
                    context.canvas.height * 0.66,
                    0,
                    context.canvas.height
                );
                gradient.addColorStop(0, "hsl(0, 0%, 50%, 0)");
                gradient.addColorStop(1, "hsl(0, 0%, 50%, 0.5)");
                context.save();
                context.beginPath();
                context.moveTo(x + 0.5, context.canvas.height * 0.66);
                context.lineTo(x + 0.5, context.canvas.height);
                context.strokeStyle = gradient;
                context.lineWidth = 1;
                context.stroke();
                context.restore();

                context.font = "12px Arial";
                context.fontWeight = "bold";
                context.fillStyle = "hsl(0, 0%, 0%, 0.4)";
                context.fillText(minute, x + 5, context.canvas.height * 0.85);
            }
        }
    }

    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    hourHand: {
        let hourX = (context.canvas.width / 24) * (hour + minute / 60 + second / 3600);
        hourX += offsetPx;
        hourX = loop(hourX, 0, context.canvas.width, "close");

        context.save();
        const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height * 0.66);
        gradient.addColorStop(0, "hsl(240, 100%, 50%, 0.5)");
        gradient.addColorStop(1, "hsl(240, 100%, 50%, 0)");

        context.beginPath();
        context.moveTo(hourX + 0.5, 0);
        context.lineTo(hourX + 0.5, context.canvas.height * 0.66);
        context.strokeStyle = gradient;
        context.lineWidth = 4;
        context.stroke();
        context.restore();
    }

    minuteHand: {
        let minuteX = (context.canvas.width / 60) * (minute + second / 60);
        minuteX += offsetPx;
        minuteX = loop(minuteX, 0, context.canvas.width, "close");

        context.save();
        const gradient = context.createLinearGradient(0, context.canvas.height * 0.5, 0, context.canvas.height);
        gradient.addColorStop(0, "hsl(120, 90%, 40%, 0)");
        gradient.addColorStop(1, "hsl(120, 90%, 40%, 0.75)");

        context.beginPath();
        context.moveTo(minuteX + 0.5, context.canvas.height * 0.5);
        context.lineTo(minuteX + 0.5, context.canvas.height);
        context.strokeStyle = gradient;
        context.lineWidth = 3;
        context.stroke();
        context.restore();
    }

    secondHand: {
        let secondX = (context.canvas.width / 60) * second;
        secondX += offsetPx;
        secondX = loop(secondX, 0, context.canvas.width, "close");

        context.save();
        const gradient = context.createLinearGradient(0, context.canvas.height * 0.33, 0, context.canvas.height);
        gradient.addColorStop(0, "hsl(0, 100%, 50%, 0)");
        gradient.addColorStop(1, "hsl(0, 100%, 50%, 0.5)");

        context.beginPath();
        context.moveTo(secondX + 0.5, context.canvas.height * 0.33);
        context.lineTo(secondX + 0.5, context.canvas.height);
        context.strokeStyle = gradient;
        context.lineWidth = 1.5;
        context.stroke();
        context.restore();
    }

    context.restore();
}

function buildDayGradient(width, height) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    let context = canvas.getContext("2d");

    const gradient = context.createLinearGradient(0, 0, context.canvas.width, 0);
    gradient.addColorStop(0.0, "hsl(240, 50%, 50%, 0.2)");
    gradient.addColorStop(0.4, "hsl( 60, 50%, 50%, 0.2)");
    gradient.addColorStop(0.5, "hsl( 60, 50%, 50%, 0.2)");
    gradient.addColorStop(0.75, "hsl( 60, 50%, 50%, 0.2)");
    gradient.addColorStop(1.0, "hsl(240, 50%, 50%, 0.2)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    return canvas;
}

function loopCanvas(canvas, offsetX) {
    const width = canvas.width;
    const height = canvas.height;

    const loopedCanvas = document.createElement("canvas");
    loopedCanvas.width = width;
    loopedCanvas.height = height;

    const ctx = loopedCanvas.getContext("2d");

    offsetX = ((offsetX % width) + width) % width;
    const rightWidth = width - offsetX;
    ctx.drawImage(canvas, offsetX, 0, rightWidth, height, 0, 0, rightWidth, height);
    ctx.drawImage(canvas, 0, 0, offsetX, height, rightWidth, 0, offsetX, height);

    return loopedCanvas;
}
