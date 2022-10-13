
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 70;
const paddleHeight = 10;
const paddleSpeed = paddleWidth * 0.1;
const paddleSensitivity = 0.5;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - paddleHeight - ballRadius;
let ballDeltaX = 2 * Math.round(Math.random()) ? 1 : -1;
let ballDeltaY = -2;

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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