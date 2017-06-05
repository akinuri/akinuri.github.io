function resetTransition() {
    targetColor	= randomColor();
    transDist   = calculateDistance(currentColor, targetColor);
    increment = {
        "r" : 1,
        "g" : 1,
        "b" : 1,
    };
    graph.update.targetLines();
    graph.update.stats();
}

function transition() {
    if (currentColor.r > targetColor.r) {
        currentColor.r -= increment.r;
        if (currentColor.r <= targetColor.r) {
            increment.r = 0;
        }
    } else if (currentColor.r < targetColor.r) {
        currentColor.r += increment.r;
        if (currentColor.r >= targetColor.r) {
            increment.r = 0;
        }
    } else if (currentColor.b == targetColor.b) {
        increment.r = 0;
    }
    
    if (currentColor.g > targetColor.g) {
        currentColor.g -= increment.g;
        if (currentColor.g <= targetColor.g) {
            increment.g = 0;
        }
    } else if (currentColor.g < targetColor.g) {
        currentColor.g += increment.g;
        if (currentColor.g >= targetColor.g) {
            increment.g = 0;
        }
    } else if (currentColor.b == targetColor.b) {
        increment.g = 0;
    }
    
    if (currentColor.b > targetColor.b) {
        currentColor.b -= increment.b;
        if (currentColor.b <= targetColor.b) {
            increment.b = 0;
        }
    } else if (currentColor.b < targetColor.b) {
        currentColor.b += increment.b;
        if (currentColor.b >= targetColor.b) {
            increment.b = 0;
        }
    } else if (currentColor.b == targetColor.b) {
        increment.b = 0;
    }
    
    transElement.style.background = "rgb(" + Object.values(currentColor).join(", ") + ")";

    graph.update.fills();
    graph.update.currentColor();
    
    if (increment.r == 0 && increment.g == 0 && increment.b == 0) {
        resetTransition();
    }
}