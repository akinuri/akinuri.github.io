const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

let spikes = new Spikes(0, canvas.height, 15, 30, canvas.width);

let paddle = new Paddle(
    100,
    15,
    (canvas.width - 100) / 2,
    canvas.height - spikes.height - 5 - 15,
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
    state: "idle", // idle|running|paused|over-win|over-lose|ball-popped
};
let ballPopBeforeDelay = 500;
let ballPopAfterDelay = 500;
let ballLastPopTime = null;

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

let sounds = {
    hit: "sounds/mixkit-wood-hard-hit-2182-trimmed.wav",
    pop: "sounds/bang-03-clean-89273.mp3",
    overLose: "sounds/mixkit-arcade-retro-game-over-213.wav",
    overWin: "sounds/mixkit-arcade-game-complete-or-approved-mission-205.wav",
};
for (let soundName in sounds) {
    let soundPath = sounds[soundName];
    let audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", () => {
        console.log("canplaythrough " + soundPath);
    });
    audio.src = soundPath;
    sounds[soundName] = audio;
}

let lastSoundPlayTime = Date.now();
let soundPlayOffset = 50;
function playSound(sound, ignoreTime=false) {
    let currentSoundTime = Date.now();
    let elapsedSoundTime = currentSoundTime - lastSoundPlayTime;
    if (ignoreTime || elapsedSoundTime > soundPlayOffset) {
        lastSoundPlayTime = currentSoundTime;
        if (sound instanceof Audio) {
            sound = sound.cloneNode(true);
        } else if (typeof sound == "string") {
            sound = new Audio(sound);
        }
        sound.play();
    }
}

let app = new App(60, function draw(elapsedFrameTime) {
    resetCanvas();
    drawScore();
    drawLives();
    bricks.draw();
    ball.draw();
    paddle.draw();
    spikes.draw();
    if (game.state == "ball-popped") {
        let currentFrameTime = Date.now();
        if (currentFrameTime - ballLastPopTime >= ballPopAfterDelay) {
            game.state == "running";
        } else {
            return false;
        }
    }
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
        playSound(sounds.overWin, true);
        return false;
    }
    if (game.state == "over-lose") {
        drawGameOverScreen("You lose :(");
        playSound(sounds.overLose, true);
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
        playSound(sounds.hit);
    }
    if (game.score === bricks.rowCount * bricks.columnCount) {
        game.state = "over-win";
        app.main(true);
        return false;
    }
    if (CollisionMonitor.doesBallTouchVerticalWalls(ball, canvas)) {
        ball.xSpeed *= -1;
        playSound(sounds.hit);
    }
    if (
        CollisionMonitor.doesBallTouchTopWall(ball, canvas)
        || CollisionMonitor.doesBallTouchPaddle(ball, paddle)
    ) {
        ball.ySpeed *= -1;
        playSound(sounds.hit);
    }
    else if (CollisionMonitor.doesBallTouchSpikes(ball, spikes)) {
        playSound(sounds.pop, true);
        game.lives--;
        if (game.lives == 0) {
            game.state = "over-lose";
            app.main(true);
            return false;
        } else {
            game.state = "ball-popped";
            setTimeout(() => {
                resetBallAndPaddle();
                ballLastPopTime = Date.now();
                app.main(true);
                setTimeout(() => {
                    game.state = "running";
                    app.main(true, true);
                }, ballPopAfterDelay);
            }, ballPopBeforeDelay);
            return false;
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