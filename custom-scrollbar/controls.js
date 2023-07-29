let controls = {
    "scrollbar" : {
        "width" : null,
        "height" : null,
    },
    "scrollbar-track" : {
        "background-color" : null,
        "border-radius" : null,
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
    controls.scrollbar.width = qs("#scrollbar-width-input");
    controls.scrollbar.height = qs("#scrollbar-height-input");
    
    on([
        controls.scrollbar.width,
        qs("#scrollbar-width-range"),
    ], "input", function () {
        if (!["0", "", NaN].includes(this.value)) {
            css.scrollbar.width = this.value + "px";
        }
    });
    on([
        controls.scrollbar.height,
        qs("#scrollbar-height-range"),
    ], "input", function () {
        if (!["0", "", NaN].includes(this.value)) {
            css.scrollbar.height = this.value + "px";
        }
    });
    
    on([
        controls.scrollbar.width,
        qs("#scrollbar-width-range"),
        controls.scrollbar.height,
        qs("#scrollbar-height-range"),
    ], "input", function () {
        applyCSS();
        outputCSS();
    });
    
    syncNumberInputAndRange(controls.scrollbar.width, qs("#scrollbar-width-range"));
    syncNumberInputAndRange(controls.scrollbar.height, qs("#scrollbar-height-range"));
});

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
