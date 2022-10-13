
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

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 };
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    if (ballX + ballDeltaX > canvas.width-ballRadius || ballX + ballDeltaX < ballRadius) {
        ballDeltaX = -ballDeltaX;
    }
    if (ballY + ballDeltaY < ballRadius) {
        ballDeltaY = -ballDeltaY;
    } else if (ballY + ballDeltaY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDeltaY = -ballDeltaY;
        } else {
            clearTimeout(timeout);
            alert("GAME OVER");
            document.location.reload();
            return;
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
    timeout = setTimeout(draw, 10);
}
let timeout = null;
draw();