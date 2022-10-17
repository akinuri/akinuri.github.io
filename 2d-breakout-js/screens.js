function drawScore() {
    ctx.save();
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 24*0.66, 24*1.5);
    ctx.restore();
}

function drawLives() {
    ctx.save();
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    let textMeasure = ctx.measureText("Lives: _");
    ctx.fillText(`Lives: ${lives}`, canvas.width - textMeasure.width - 24*0.66, 25*1.5);
    ctx.restore();
}

function drawStartScreen() {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "hsl(0, 0%, 0%, 0.5)";
    ctx.fill();
    ctx.font = "32px Arial";
    ctx.fillStyle = "white";
    let text = "Press space key to start";
    let textMeasure = ctx.measureText(text);
    ctx.strokeStyle = "hsl(0, 0%, 0%, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeText(text, (canvas.width - textMeasure.width) / 2, canvas.height / 2);
    ctx.fillText(text, (canvas.width - textMeasure.width) / 2, canvas.height / 2);
    ctx.restore();
}

function drawPauseScreen() {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "hsl(0, 0%, 0%, 0.5)";
    ctx.fill();
    ctx.font = "32px Arial";
    ctx.fillStyle = "hsl(0, 0%, 100%)";
    ctx.strokeStyle = "hsl(0, 0%, 0%, 0.5)";
    ctx.lineWidth = 2;
    let textOffset = 24;
    let text1 = "Game is paused";
    let text1_measure = ctx.measureText(text1);
    let text1_x = (canvas.width - text1_measure.width) / 2;
    let text1_y = canvas.height / 2;
    ctx.strokeText(text1, text1_x, text1_y - textOffset);
    ctx.fillText(text1, text1_x, text1_y - textOffset);
    ctx.font = "24px Arial";
    let text2 = "Press space key to continue";
    let text2_measure = ctx.measureText(text2);
    let text2_x = (canvas.width - text2_measure.width) / 2;
    let text2_y = canvas.height / 2;
    ctx.fillStyle = "hsl(0, 0%, 90%)";
    ctx.strokeText(text2, text2_x, text2_y + textOffset);
    ctx.fillText(text2, text2_x, text2_y + textOffset);
    ctx.restore();
}

function drawGameOverScreen(text1) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "hsl(0, 0%, 0%, 0.5)";
    ctx.fill();
    ctx.font = "32px Arial";
    ctx.fillStyle = "hsl(0, 0%, 100%)";
    let textOffset = 24;
    let text1_measure = ctx.measureText(text1);
    let text1_x = (canvas.width - text1_measure.width) / 2;
    let text1_y = canvas.height / 2;
    ctx.strokeText(text1, text1_x, text1_y - textOffset);
    ctx.fillText(text1, text1_x, text1_y - textOffset);
    ctx.font = "24px Arial";
    let text2 = "Press space key to play again";
    let text2_measure = ctx.measureText(text2);
    let text2_x = (canvas.width - text2_measure.width) / 2;
    let text2_y = canvas.height / 2;
    ctx.fillStyle = "hsl(0, 0%, 90%)";
    ctx.strokeText(text2, text2_x, text2_y + textOffset);
    ctx.fillText(text2, text2_x, text2_y + textOffset);
    ctx.restore();
}