Math.avg = function avg() {
    let numbers = Array.from(arguments).flat(Infinity);
    return Math.sum(numbers) / numbers.length;
};

Math.sum = function sum() {
    let numbers = Array.from(arguments).flat(Infinity);
    return numbers.reduce(function (sum, currentValue) {
        return sum + (parseFloat(currentValue) || 0);
    }, 0);
};

function random(min, max) {
    if (typeof min == "undefined") {
        min = 0;
        max = 1;
    }
    if (typeof max == "undefined") {
        max = min;
        min = 0;
    }
    return min + Math.random() * (max - min);
}

function playSound(sound, volume = 1) {
    if (sound instanceof Audio) {
        sound = sound.cloneNode(true);
    } else if (typeof sound == "string") {
        sound = new Audio(sound);
    }
    sound.volume = volume;
    sound.play();
}

function loadSounds(sounds) {
    for (let soundName in sounds) {
        let soundPath = sounds[soundName];
        let audio = new Audio();
        audio.preload = "auto";
        audio.src = soundPath;
        sounds[soundName] = audio;
    }
    return sounds;
}
