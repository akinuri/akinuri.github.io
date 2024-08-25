function listenKeys() {
    let keys = {};
    window.addEventListener("keydown", (e) => {
        keys[e.key.toLowerCase()] = performance.now();
    });
    window.addEventListener("keyup", (e) => {
        keys[e.key.toLowerCase()] = 0;
    });
    return keys;
}

function listenClicks() {
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
    return clicks;
}
