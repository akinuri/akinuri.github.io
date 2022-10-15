const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 70;
const paddleHeight = 10;
const paddleMargin = paddleHeight;
const paddleSpeed = paddleWidth * 0.1;
const paddleSensitivity = 0.5;
let paddleX = (canvas.width - paddleWidth) / 2;

let ball = new Ball(
    10,
    canvas.width / 2,
    canvas.height - paddleHeight - paddleMargin - 10,
    (10 * 10) * (Math.round(Math.random()) ? 1 : -1),
    (10 * 10) * -1,
);

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 40;
let brickOffsetLeft = 30;

let bricks = [];
for (let columnIndex = 0; columnIndex < brickColumnCount; columnIndex++) {
    bricks[columnIndex] = [];
    for (let rowIndex = 0; rowIndex < brickRowCount; rowIndex++) {
        bricks[columnIndex][rowIndex] = { x: 0, y: 0, intact: true };
    }
}

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
        drawBricks();
        ball.draw();
        drawPaddle();
        if (gameState == "idle") {
            drawStartScreen();
            return;
        }
        if (gameState == "paused") {
            drawPauseScreen();
            return;
        }
        collisionDetection();
        if (score === brickRowCount * brickColumnCount) {
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
            if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
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
                        canvas.height - paddleHeight - paddleMargin - 10,
                        (10 * 10) * (Math.round(Math.random()) ? 1 : -1),
                        (10 * 10) * -1,
                    );
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        if (rightPressed) {
            paddleX += paddleSpeed * paddleSensitivity;
            if (paddleX + paddleWidth > canvas.width){
                paddleX = canvas.width - paddleWidth;
            }
        }
        else if (leftPressed) {
            paddleX -= paddleSpeed * paddleSensitivity;
            if (paddleX < 0){
                paddleX = 0;
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