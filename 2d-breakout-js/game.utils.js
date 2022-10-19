function keyDownHandler(e) {
    let targetKeys = ["Right", "ArrowRight", "Left", "ArrowLeft"];
    if (!targetKeys.includes(e.key)) {
        return;
    }
    let dir = null;
    if (e.key == "Right" || e.key == "ArrowRight") {
        if (
            paddleDirKeyPresses.length == 0
            || paddleDirKeyPresses[0] != "right"
        ) {
            dir = "right";
        }
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        if (
            paddleDirKeyPresses.length == 0
            || paddleDirKeyPresses[0] != "left"
        ) {
            dir = "left";
        }
    }
    if (dir) {
        paddleDirKeyPresses.unshift(dir);
        if (paddleDirKeyPresses.length > 2) {
            paddleDirKeyPresses = paddleDirKeyPresses.slice(0, 2);
        }
    }
}

function keyUpHandler(e) {
    let targetKeys = ["Right", "ArrowRight", "Left", "ArrowLeft"];
    if (!targetKeys.includes(e.key)) {
        return;
    }
    let dir = null;
    if (e.key == "Right" || e.key == "ArrowRight") {
        if (
            (paddleDirKeyPresses.length == 1 && paddleDirKeyPresses[0] == "right")
            || (paddleDirKeyPresses.length == 2 && paddleDirKeyPresses.includes("right"))
        ) {
            dir = "right";
        }
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        if (
            (paddleDirKeyPresses.length == 1 && paddleDirKeyPresses[0] == "left")
            || (paddleDirKeyPresses.length == 2 && paddleDirKeyPresses.includes("left"))
        ) {
            dir = "left";
        }
    }
    if (dir) {
        let dirIndex = paddleDirKeyPresses.indexOf(dir);
        if (dirIndex !== -1) {
            paddleDirKeyPresses.splice(paddleDirKeyPresses.indexOf(dir), 1);
        }
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.offsetX;
    paddle.x = relativeX - paddle.width / 2;
    paddle.x = Math.max(paddle.x, 0);
    paddle.x = Math.min(paddle.x, canvas.width - paddle.width);
}

function getPixelInTime(pixelsPerSecond, elapsedFrameTime) {
    return elapsedFrameTime / 1000 * pixelsPerSecond;
}

function resetBallAndPaddle() {
    ball.init(
        15,
        canvas.width / 2,
        paddle.y - 15,
        canvas.width / 3 * (Math.round(Math.random()) ? 1 : -1),
        canvas.width / 3 * -1,
    );
    paddle.x = (canvas.width - paddle.width) / 2;
    paddle.dir = 0;
}

function resetGame(state) {
    bricks.build();
    resetBallAndPaddle();
    score = 0;
    lives = 3;
    gameState = state || "idle";
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "hsl(0, 0%, 95%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function gameStateHandler() {
    if (gameState == "idle") {
        gameState = "running";
        lastFrameTime = Date.now();
        draw();
    }
    else if (gameState == "running") {
        gameState = "paused";
    }
    else if (gameState == "paused") {
        gameState = "running";
        lastFrameTime = Date.now();
        draw();
    }
    else if (["over-win", "over-lose"].includes(gameState)) {
        resetGame("running");
        lastFrameTime = Date.now();
        draw();
    }
}