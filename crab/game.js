let world = new World(document.querySelector("#game-canvas"));

let crab = new Crab();
crab.container = new Rectangle(
    20,
    innerHeight - 20 - crab.height - crab.jumpHeight,
    innerWidth - 20 - 20,
    crab.height + crab.jumpHeight
);
crab.setPos(getWindowCenter().x, crab.container.bottom);
world.add(crab);

function makeBubble(size = 50) {
    let bubble = new Bubble(
        size,
        0,
        random(getWindowSize().width * 0.05, getWindowSize().width * 0.15)
    );
    bubble.setPos(0, random(getWindowSize().height * 0.1, getWindowSize().height * 0.5));
    return bubble;
}
function spawnBubble(delay) {
    delay = delay || random(500, 1000);
    setTimeout(() => {
        world.add(makeBubble(random(50, 100)));
    }, delay);
}

for (let index = 0; index < 11; index++) {
    spawnBubble(index * random(index * 100, index * 500));
}

let keys = listenKeys();
let clicks = listenClicks();

let sounds = loadSounds({
    jump: "assets/sounds/jump.mp3",
    throw: "assets/sounds/throw.mp3",
    pop: "assets/sounds/pop.mp3",
});

toggleDebug();

let spinToggle = document.querySelector("#spin-toggle");

let gl = new GameLoop(function game(elapsedFrameTime) {
    for (const obj of world.objects) {
        if ("handleInput" in obj) {
            obj.handleInput(keys, clicks);
        }
    }

    let toRemove = [];
    let projectiles = world.objects.filter((obj) => obj instanceof Projectile);
    let bubbles = world.objects.filter((obj) => obj instanceof Bubble);
    for (const projectile of projectiles) {
        for (const bubble of bubbles) {
            if (CollisionMonitor.doObjectsTouch(projectile, bubble)) {
                toRemove.push(projectile);
                toRemove.push(bubble);
                playSound(sounds.pop);
                spawnBubble();
                break;
            }
        }
    }
    for (const obj of toRemove) {
        world.remove(obj);
    }

    for (const obj of world.objects) {
        if ("update" in obj) {
            obj.update(elapsedFrameTime);
        }
    }
    for (const obj of world.objects) {
        if ("render" in obj) {
            obj.render();
        }
    }

    if (isDebugging()) {
        updateFPS();
        updateDeltaTime();
    }
});
gl.tick(true);
