function showAxes() {
    let axes = document.querySelector("#axes");
    if (axes) {
        return;
    }
    axes = el(`
        <div id="axes">
            <div id="x-axis"></div>
            <div id="y-axis"></div>
        </div>`)[0];
    applyStyle(axes.children[0], {
        borderTop: "1px dashed hsl(0, 100%, 25%)",
        width: "100vw",
        position: "absolute",
        left: "0",
        top: "50%",
        opacity: "0.45",
    });
    applyStyle(axes.children[1], {
        borderLeft: "1px dashed hsl(120, 100%, 25%)",
        height: "100vh",
        position: "absolute",
        left: "50%",
        top: "0",
        opacity: "0.5",
    });
    gameCanvas.prepend(axes);
}

function hideAxes() {
    document.querySelector("#axes")?.remove();
}

let lastSoundPlayTime = Date.now();
let soundPlayOffset = 50;
function playSound(sound, ignoreTime = false) {
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

function loadSounds(sounds) {
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
}

let fpsDisplayEl = document.querySelector("#fps-display");
let fpsStack = new Stack(100, true);
function updateFPS() {
    fpsStack.push(parseInt(gl.fps));
    let avgFps = Math.avg(fpsStack.getItems());
    fpsDisplayEl.textContent = parseInt(avgFps);
}

let deltaTimeDisplayEl = document.querySelector("#delta-time-display");
let deltaTimeStack = new Stack(100, true);
function updateDeltaTime() {
    deltaTimeStack.push(parseInt(gl.elapsedFrameTime));
    let avgDeltaTime = Math.avg(deltaTimeStack.getItems());
    deltaTimeDisplayEl.textContent = parseInt(avgDeltaTime);
}

let debugToggleEl = document.querySelector("#debug-toggle");
function isDebugging() {
    return debugToggleEl.checked;
}

function toggleDebug() {
    if (isDebugging()) {
        showAxes();
        crab.container.show();
        document.querySelectorAll(".stat").forEach(el => el.hidden = false);
    } else {
        hideAxes();
        crab.container.hide();
        document.querySelectorAll(".stat").forEach(el => el.hidden = true);
    }
}
