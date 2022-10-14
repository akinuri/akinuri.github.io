const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 70;
const paddleHeight = 10;
const paddleMargin = paddleHeight;
const paddleSpeed = paddleWidth * 0.1;
const paddleSensitivity = 0.5;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - paddleHeight - paddleMargin - ballRadius;
let ballDeltaX = (ballRadius * 10) * (Math.round(Math.random()) ? 1 : -1);
let ballDeltaY = (ballRadius * 10) * -1;

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
        drawBall();
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
        if (ballX + ballRadius > canvas.width - ballRadius || ballX - ballRadius < 0) {
            ballDeltaX *= -1;
        }
        if (ballY - ballRadius < 0) {
            ballDeltaY *= -1;
        }
        else if (ballY + ballRadius > canvas.height - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                ballDeltaY *= -1;
            } else {
                lives--;
                if (!lives) {
                    drawGameOverScreen("You lose :(");
                    gameState = "over";
                    return;
                }
                else {
                    ballX = canvas.width / 2;
                    ballY = canvas.height - paddleHeight - paddleMargin - ballRadius;
                    ballDeltaX = (ballRadius * 10) * (Math.round(Math.random()) ? 1 : -1);
                    ballDeltaY = (ballRadius * 10) * -1;
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
        ballX += getPixelInTime(ballDeltaX, elapsedFrameTime);
        ballY += getPixelInTime(ballDeltaY, elapsedFrameTime);
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