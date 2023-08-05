let controls = {
    "preview" : {
        "background-color" : null,
    },
    "scrollbar" : {
        "width" : null,
        "height" : null,
    },
    "scrollbar-track" : {
        "background-color" : null,
        "border-radius" : null,
    },
    "scrollbar-corner" : {
        "background-color" : null,
    },
    "scrollbar-thumb" : {
        "background-color" : null,
        "border-radius" : null,
        "border" : {
            "width" : null,
            "style" : null,
            "color" : null,
        },
    },
    "scrollbar-thumb:hover" : {
        "background-color" : null,
    },
    "scrollbar-thumb:active" : {
        "background-color" : null,
    },
};

window.addEventListener("AllScriptsLoaded", () => {
    
    controls.preview["background-color"] = qs("#preview-background-input");
    
    controls.scrollbar.width  = qs("#scrollbar-width-input");
    controls.scrollbar.height = qs("#scrollbar-height-input");
    
    controls["scrollbar-track"]["background-color"] = qs("#track-background-input");
    controls["scrollbar-track"]["border-radius"]    = qs("#track-radius-input");
    
    controls["scrollbar-corner"]["background-color"] = qs("#corner-background-input");
    
    let trackBackgroundAlphaInput = qs("#track-background-alpha-input");
    let trackBackgroundAlphaRange = qs("#track-background-alpha-range");
    
    let cornerBackgroundAlphaInput = qs("#corner-background-alpha-input");
    let cornerBackgroundAlphaRange = qs("#corner-background-alpha-range");
    
    syncNumberInputAndRange(controls.scrollbar.width, qs("#scrollbar-width-range"));
    syncNumberInputAndRange(controls.scrollbar.height, qs("#scrollbar-height-range"));
    // syncColorAndTextInput(controls["scrollbar-track"]["background-color"], qs("#track-background-text"));
    syncNumberInputAndRange(trackBackgroundAlphaInput, trackBackgroundAlphaRange);
    syncNumberInputAndRange(cornerBackgroundAlphaInput, cornerBackgroundAlphaRange);
    syncNumberInputAndRange(controls["scrollbar-track"]["border-radius"], qs("#track-radius-range"));
    
    on([controls.scrollbar.width, qs("#scrollbar-width-range")], "input", function () {
        if (!["0", "", NaN].includes(this.value)) {
            css.scrollbar.width = this.value + "px";
        }
    });
    on([controls.scrollbar.height, qs("#scrollbar-height-range")], "input", function () {
        if (!["0", "", NaN].includes(this.value)) {
            css.scrollbar.height = this.value + "px";
        }
    });
    
    on(controls.preview["background-color"], "input", function () {
        qs("#preview-card").style.setProperty("--preview-bg", this.value);
    });
    
    on(controls["scrollbar-track"]["background-color"], "input", function () {
        css["scrollbar-track"]["background-color"] = getBackground(
            controls["scrollbar-track"]["background-color"],
            trackBackgroundAlphaInput,
        );
    });
    on([controls["scrollbar-track"]["border-radius"], qs("#track-radius-range")], "input", function () {
        if (!["0", "", NaN].includes(this.value)) {
            css["scrollbar-track"]["border-radius"] = this.value + "px";
        }
    });
    
    on(controls["scrollbar-corner"]["background-color"], "input", function () {
        let alpha = cornerBackgroundAlphaInput.valueAsNumber || 0;
        if (alpha != 0) {
            css["scrollbar-corner"]["background-color"] = getBackground(
                controls["scrollbar-corner"]["background-color"],
                cornerBackgroundAlphaInput,
            );
        }
    });
    
    function getBackgroundAlphaHex(input) {
        let alpha = parseFloat(input.value) || 0;
        let alphaScaled = Math.round(alpha * 255);
        let alphaHex = alphaScaled.toString(16);
        return alphaHex;
    }
    function getBackground(colorInput, alphaInput) {
        let colorHex = colorInput.value;
        let alphaHex = getBackgroundAlphaHex(alphaInput);
        if (alphaHex == 0) {
            alphaHex = "00";
        }
        if (alphaHex != "ff") {
            colorHex += alphaHex;
        }
        return colorHex;
    }
    
    on(trackBackgroundAlphaInput, "input", () => {
        css["scrollbar-track"]["background-color"] = getBackground(
            controls["scrollbar-track"]["background-color"],
            trackBackgroundAlphaInput,
        );
    });
    on(trackBackgroundAlphaRange, "input", () => {
        css["scrollbar-track"]["background-color"] = getBackground(
            controls["scrollbar-track"]["background-color"],
            trackBackgroundAlphaInput,
        );
    });
    
    on(cornerBackgroundAlphaInput, "input", () => {
        let alpha = cornerBackgroundAlphaInput.valueAsNumber || 0;
        if (alpha != 0) {
            css["scrollbar-corner"]["background-color"] = getBackground(
                controls["scrollbar-corner"]["background-color"],
                cornerBackgroundAlphaInput,
            );
        } else {
            css["scrollbar-corner"]["background-color"] = null;
        }
    });
    on(cornerBackgroundAlphaRange, "input", () => {
        let alpha = cornerBackgroundAlphaInput.valueAsNumber || 0;
        if (alpha != 0) {
            css["scrollbar-corner"]["background-color"] = getBackground(
                controls["scrollbar-corner"]["background-color"],
                cornerBackgroundAlphaInput,
            );
        } else {
            css["scrollbar-corner"]["background-color"] = null;
        }
    });
    
    on([
        controls.scrollbar.width,  qs("#scrollbar-width-range"),
        controls.scrollbar.height, qs("#scrollbar-height-range"),
        controls["scrollbar-track"]["background-color"],
        trackBackgroundAlphaInput, trackBackgroundAlphaRange,
        controls["scrollbar-corner"]["background-color"],
        cornerBackgroundAlphaInput, cornerBackgroundAlphaRange,
        controls["scrollbar-track"]["border-radius"], qs("#track-radius-range"),
    ], "input", function () {
        applyCSS();
        outputCSS();
    });
    
});

function syncColorAndTextInput(color, textInput) {
    color.addEventListener("input", () => {
        textInput.value = color.value;
    });
    textInput.addEventListener("input", () => {
        color.value = textInput.value;
    });
}

function syncNumberInputAndRange(numberInput, range) {
    numberInput.addEventListener("input", () => {
        range.value = numberInput.value || 0;
    });
    range.addEventListener("input", () => {
        numberInput.value = range.value;
    });
}

function outputCSS(selectorPrefix = ".scrollbar") {
    let cssOutput = qs("#css-output");
    cssOutput.textContent = generateCSSText(selectorPrefix);
    hljs.highlightAll();
}
