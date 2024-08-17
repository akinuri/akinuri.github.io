let crab = new Character(document.querySelector("#crab"));

crab.container = new Rectangle(
    20,
    innerHeight - 20 - crab.height - crab.jumpHeight,
    innerWidth - 20 - 20,
    crab.height + crab.jumpHeight
);

crab.setPos(getWindowCenter().x, crab.container.pos.y + crab.container.height);
crab.render();

let keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = performance.now();
});
window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = 0;
});

let sounds = {
    jump: "sounds/jump.mp3",
};
loadSounds(sounds);

let gl = new GameLoop(60, function game(elapsedFrameTime) {
    crab.handleInput(keys);
    crab.update(elapsedFrameTime);
    crab.render();
});

gl.tick(true);
