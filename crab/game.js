let crab = new Character(document.querySelector("#crab"));

crab.setPos(innerWidth / 2 - crab.width / 2, innerHeight / 2 - crab.height / 2);

let mousePos = {
    x: 0,
    y: 0,
};

window.addEventListener("mousemove", (e) => {
    mousePos = {
        x: e.clientX,
        y: e.clientY,
    };
});

mousePos.x = innerWidth / 2 - crab.width / 2;
mousePos.y = innerHeight / 2 - crab.height / 2;

let gl = new GameLoop(60, function game(elapsedFrameTime) {
    // crab.setPos(mousePos.x - crab.width / 2, mousePos.y - crab.height / 2);
    crab.update(mousePos.x - crab.width / 2, mousePos.y - crab.height / 2);
});

gl.tick(true);
