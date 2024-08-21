let gameCanvas = document.querySelector("#game-canvas");

let crab = new Character(document.querySelector("#crab"));
crab.container = new Rectangle(
    20,
    innerHeight - 20 - crab.height - crab.jumpHeight,
    innerWidth - 20 - 20,
    crab.height + crab.jumpHeight
);
crab.setPos(getWindowCenter().x, crab.container.bottom);
crab.render();

function makeBubble() {
    let bubble = new Bubble(100);
    bubble.setPos(0, random(getWindowSize().height * 0.1, getWindowSize().height * 0.5));
    setTimeout(() => {
        addWorldObject(bubble);
    });
}
for (let index = 0; index < 10; index++) {
    setTimeout(() => {
        makeBubble(); 
    }, index * random(500, 5000));
}

let keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = performance.now();
});
window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = 0;
});

let clicks = {};
window.addEventListener("mousedown", (e) => {
    if (e.target.closest("#debug")) {
        return;
    }
    if (e.button == 0 && e.buttons == 1) {
        clicks["left"] = performance.now();
    }
});
window.addEventListener("mouseup", (e) => {
    if (e.target.closest("#debug")) {
        return;
    }
    if (e.button == 0 && e.buttons == 0) {
        clicks["left"] = 0;
    }
});

let sounds = {
    jump: "sounds/jump.mp3",
    throw: "sounds/throw.mp3",
};
loadSounds(sounds);

toggleDebug();

let worldObjects = [crab];
function addWorldObject(obj) {
    worldObjects.push(obj);
    if (obj.el) {
        gameCanvas.append(obj.el);
    }
}
function removeWorldObject(obj) {
    for (let index = 0; index < worldObjects.length; index++) {
        const wobj = worldObjects[index];
        if (wobj === obj) {
            if (obj.el) {
                obj.el.remove();
                obj.el = null;
            }
            worldObjects.splice(index, 1);
            break;
        }
    }
}

let spinToggle = document.querySelector("#spin-toggle");

let gl = new GameLoop(function game(elapsedFrameTime) {
    for (const obj of worldObjects) {
        if ("handleInput" in obj) {
            obj.handleInput(keys, clicks);
        }
    }
    for (const obj of worldObjects) {
        if ("update" in obj) {
            obj.update(elapsedFrameTime);
        }
    }
    for (const obj of worldObjects) {
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
