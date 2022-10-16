const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let paddle = new Paddle(
    70,
    10,
    (canvas.width - 70) / 2,
    10,
    4,
);

let ball = new Ball(
    10,
    canvas.width / 2,
    canvas.height - paddle.height - paddle.bottomMargin - 10,
    (10 * 10) * (Math.round(Math.random()) ? 1 : -1),
    (10 * 10) * -1,
);

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);

let bricks = new Bricks(
    3,
    5,
    75,
    20,
    10,
    40,
    30,
);

let score = 0;
let lives = 3;

let gameState = "idle"; // idle|running|paused|over ?

let fps = 60, lastFrameTime = Date.now(), fpsInterval = 1000 / fps;

function draw(force=false) {
    let currentFrameTime = Date.now();
    let elapsedFrameTime = currentFrameTime - lastFrameTime;
    if (force || elapsedFrameTime > fpsInterval ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        drawLives();
        bricks.draw();
        ball.draw();
        paddle.draw();
        if (gameState == "idle") {
            drawStartScreen();
            return;
        }
        if (gameState == "paused") {
            drawPauseScreen();
            return;
        }
        collisionDetection();
        if (score === bricks.rowCount * bricks.columnCount) {
            drawGameOverScreen("You win! :)");
            gameState = "over";
            return;
        }
        if (
            ball.x + ball.radius > canvas.width - ball.radius
            || ball.x - ball.radius < 0
        ) {
            ball.xSpeed *= -1;
        }
        if (ball.y - ball.radius < 0) {
            ball.ySpeed *= -1;
        }
        else if (ball.y + ball.radius > canvas.height - ball.radius) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                ball.ySpeed *= -1;
            } else {
                lives--;
                if (!lives) {
                    drawGameOverScreen("You lose :(");
                    gameState = "over";
                    return;
                }
                else {
                    ball.init(
                        10,
                        canvas.width / 2,
                        canvas.height - paddle.height - paddle.bottomMargin - 10,
                        (10 * 10) * (Math.round(Math.random()) ? 1 : -1),
                        (10 * 10) * -1,
                    );
                    paddle.x = (canvas.width - paddle.width) / 2;
                }
            }
        }
        if (rightPressed) {
            paddle.x += paddle.speed;
            if (paddle.x + paddle.width > canvas.width){
                paddle.x = canvas.width - paddle.width;
            }
        }
        else if (leftPressed) {
            paddle.x -= paddle.speed;
            if (paddle.x < 0){
                paddle.x = 0;
            }
        }
        ball.move(elapsedFrameTime);
        lastFrameTime = currentFrameTime - (elapsedFrameTime % fpsInterval);
    }
    raf = requestAnimationFrame(draw);
}
let raf = null;
draw(true);

window.addEventListener("keypress", (e) => {
    if (e.code == "Space") {
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
        else if (gameState == "over") {
            resetGame("running");
            lastFrameTime = Date.now();
            draw();
        }
    }
});