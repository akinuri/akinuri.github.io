let world = new World(document.querySelector("#game-canvas"));


let crab = new Crab();
crab.container = new Rectangle(
    20,
    innerHeight - 20 - ((crab.height + crab.jumpHeight) * 1.5),
    innerWidth - 20 - 20,
    (crab.height + crab.jumpHeight) * 1.5
);
crab.setPos(getWindowCenter().x * 0.8, crab.container.bottom);
world.add(crab);


let lobster = new Lobster();
lobster.setPos(getWindowSize().width * 0.7, crab.container.bottom - lobster.height / 2);
world.add(lobster);


function spawnBubble(delay) {
    delay = delay || random(500, 1000);
    setTimeout(() => {
        let bubble = new Bubble(
            random(50, 100),
            0,
            random(getWindowSize().width * 0.05, getWindowSize().width * 0.15)
        );
        bubble.setPos(0, random(getWindowSize().height * 0.1, getWindowSize().height * 0.5));
        world.add(bubble);
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
    fail: "assets/sounds/fail.wav",
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
    
    if (CollisionMonitor.doObjectsTouch(crab, lobster)) {
        let collisionSide = crab.pos.x < lobster.pos.x ? "left" : "right";
        let isOnTop = crab.pos.y < lobster.pos.y;
        if (isOnTop) {
            crab.pos.y = lobster.pos.y - lobster.height / 2 - crab.height / 2 - 1;
        } else {
            if (collisionSide == "left") {
                crab.pos.x = lobster.pos.x - lobster.width / 2 - crab.width / 2;
            } else {
                crab.pos.x = lobster.pos.x + lobster.width / 2 + crab.width / 2;
            }
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
