function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function drawBricks() {
    ctx.save();
    for (let columnIndex = 0; columnIndex < brickColumnCount; columnIndex++) {
        for (let rowIndex = 0; rowIndex < brickRowCount; rowIndex++) {
            if (bricks[columnIndex][rowIndex].intact) {
                let brickX = (columnIndex * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (rowIndex * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[columnIndex][rowIndex].x = brickX;
                bricks[columnIndex][rowIndex].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "hsl(0, 60%, 50%)";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    ctx.restore();
}

function drawPaddle() {
    ctx.save();
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - paddleMargin, paddleWidth, paddleHeight);
    ctx.fillStyle = "hsl(210, 60%, 50%)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function collisionDetection() {
    for (let columnIndex = 0; columnIndex < brickColumnCount; columnIndex++) {
        for (let rowIndex = 0; rowIndex < brickRowCount; rowIndex++) {
            const brick = bricks[columnIndex][rowIndex];
            if (brick.intact) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y > brick.y &&
                    ball.y < brick.y + brickHeight
                ) {
                    ball.ySpeed *= -1;
                    brick.intact = false;
                    score++;
                }
            }
        }
    }
}

function drawScore() {
    ctx.save();
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 8, 22);
    ctx.restore();
}

function drawLives() {
    ctx.save();
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 22);
    ctx.restore();
}

function getPixelInTime(pixelsPerSecond, elapsedFrameTime) {
    return elapsedFrameTime / 1000 * pixelsPerSecond;
}

function drawStartScreen() {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "hsl(0, 0%, 0%, 0.5)";
    ctx.fill();
    ctx.closePath();
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
    ctx.closePath();
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
    ctx.closePath();
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

function resetGame(state) {
    bricks = [];
    for (let columnIndex = 0; columnIndex < brickColumnCount; columnIndex++) {
        bricks[columnIndex] = [];
        for (let rowIndex = 0; rowIndex < brickRowCount; rowIndex++) {
            bricks[columnIndex][rowIndex] = { x: 0, y: 0, intact: true };
        }
    }
    ball.init(
        10,
        canvas.width / 2,
        canvas.height - paddleHeight - paddleMargin - 10,
        (10 * 10) * (Math.round(Math.random()) ? 1 : -1),
        (10 * 10) * -1,
    );
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    lives = 3;
    gameState = state || "idle";
}