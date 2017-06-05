function getElementBG(elm) {
    var rgb = getComputedStyle(elm).backgroundColor.match(/(\d?\.?\d+)/g).map(function(value) {
        return parseInt(value, 10);
    });
    return {
        "r" : rgb[0],
        "g" : rgb[1],
        "b" : rgb[2],
    };
}

function random(min, max) {
    return Math.round( min + Math.random() * (max - min) );
}

function randomColor() {
    return {
        "r" : random(0, 255),
        "g" : random(0, 255),
        "b" : random(0, 255),
    };
}