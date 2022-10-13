
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
let ballDeltaX = 2 * Math.round(Math.random()) ? 1 : -1;
let ballDeltaY = -2;

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    if (ballX + ballDeltaX > canvas.width-ballRadius || ballX + ballDeltaX < ballRadius) {
        ballDeltaX = -ballDeltaX;
    }
    if (ballY + ballDeltaY < ballRadius) {
        ballDeltaY = -ballDeltaY;
    } else if (ballY + ballDeltaY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDeltaY = -ballDeltaY;
        } else {
            lives--;
            if (!lives) {
                cancelAnimationFrame(raf);
                alert("GAME OVER");
                document.location.reload();
                return;
            }
            else {
                ballX = canvas.width / 2;
                ballY = canvas.height - paddleHeight - paddleMargin - ballRadius;
                ballDeltaX = 2 * Math.round(Math.random()) ? 1 : -1;
                ballDeltaY = -2;
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
    ballX += ballDeltaX;
    ballY += ballDeltaY;
    raf = requestAnimationFrame(draw);
}
let raf = null;
draw();