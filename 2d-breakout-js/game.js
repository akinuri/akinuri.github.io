const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

let paddle = new Paddle(
    100,
    15,
    (canvas.width - 100) / 2,
    canvas.height - 15 - 15,
    canvas.width,
);

let ball = new Ball(
    15,
    canvas.width / 2,
    paddle.y - 15,
    canvas.width / 3 * (Math.round(Math.random()) ? 1 : -1),
    canvas.width / 3 * -1,
);

let bricks = new Bricks(
    3,
    6,
    80,
    23,
    15,
    42,
    60,
);

let game = {
    score: 0,
    lives: 3,
    state: "idle", // idle|running|paused|over-win|over-lose
};

let paddleDirKeyPresses = [];
document.addEventListener("keydown", paddleKeyDownHandler, false);
document.addEventListener("keyup", paddleKUpHandler, false);
canvas.addEventListener("mousemove", paddleMouseMoveHandler, false);
window.addEventListener("keypress", (e) => {
    if (e.code == "Space") gameStateHandler();
});
window.addEventListener("auxclick", (e) => {
    if (e.button == 1) gameStateHandler();
});

let app = new App(60, function draw(elapsedFrameTime) {
    resetCanvas();
    drawScore();
    drawLives();
    bricks.draw();
    ball.draw();
    paddle.draw();
    if (game.state == "idle") {
        drawStartScreen();
        return false;
    }
    if (game.state == "paused") {
        drawPauseScreen();
        return false;
    }
    if (game.state == "over-win") {
        drawGameOverScreen("You win! :)");
        return false;
    }
    if (game.state == "over-lose") {
        drawGameOverScreen("You lose :(");
        return false;
    }
    let touchedBrick = CollisionMonitor.doesBallTouchAnyBrick(
        ball,
        bricks,
        (brick) => brick.isIntact,
    );
    if (touchedBrick) {
        touchedBrick.isIntact = false;
        ball.ySpeed *= -1;
        game.score++;
    }
    if (game.score === bricks.rowCount * bricks.columnCount) {
        game.state = "over-win";
        app.main(true);
        return false;
    }
    if (CollisionMonitor.doesBallTouchVerticalWalls(ball, canvas)) {
        ball.xSpeed *= -1;
    }
    if (
        CollisionMonitor.doesBallTouchTopWall(ball, canvas)
        || CollisionMonitor.doesBallTouchPaddle(ball, paddle)
    ) {
        ball.ySpeed *= -1;
    }
    else if (CollisionMonitor.doesBallTouchBottomWall(ball, canvas)) {
        game.lives--;
        if (game.lives == 0) {
            game.state = "over-lose";
            app.main(true);
            return false;
        } else {
            resetBallAndPaddle();
        }
    }
    paddle.dir = 0;
    switch (paddleDirKeyPresses[0] ?? null) {
        case "right": paddle.dir = 1; break;
        case "left": paddle.dir = -1; break;
    }
    paddle.move(elapsedFrameTime);
    CollisionMonitor.constrainPaddleMovementToCanvas(paddle, canvas);
    ball.move(elapsedFrameTime);
});

app.main(true);