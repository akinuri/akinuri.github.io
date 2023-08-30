let css = {
    "scrollbar": {
        "width" : "10px",
        "height" : "10px",
    },
    "scrollbar-track" : {
        "background-color" : "#f2f2f2",
        "border-radius" : "4px",
    },
    "scrollbar-corner" : {
        "background-color" : "#ffffff",
        "border-radius" : "0",
    },
    "scrollbar-thumb" : {
        "background-color" : "#bfbfbf",
        "border-radius" : "4px",
        "border" : {
            "width" : "2px",
            "style" : "solid",
            "color" : "transparent",
        },
        "background-clip" : "content-box",
    },
    "scrollbar-thumb:hover" : {
        "background-color" : "hsla(0, 0%, 70%, 0.95)",
    },
    "scrollbar-thumb:active" : {
        "background-color" : "hsla(0, 0%, 65%, 0.95)",
    },
};

// TODO: add option for output color format

function generateCSSText(selectorPrefix = "") {
    let rulesText = [];
    for (const selector in css) {
        if (Object.hasOwnProperty.call(css, selector)) {
            const declerations = css[selector];
            let ruleText = "%s::-webkit-%s {\n%s\n}";
            let declerationsText = [];
            for (const property in declerations) {
                if (Object.hasOwnProperty.call(declerations, property)) {
                    const value = declerations[property];
                    if (!value) {
                        continue;
                    }
                    let declerationText = "";
                    if (typeof value == "object") {
                        let values = [];
                        for (const subProperty in value) {
                            if (Object.hasOwnProperty.call(value, subProperty)) {
                                const subValue = value[subProperty];
                                values.push(subValue);
                            }
                        }
                        values = values.join(" ");
                        declerationText = sprintf("    %s: %s;", property, values);
                    } else {
                        declerationText = sprintf("    %s: %s;", property, value);
                    }
                    declerationsText.push(declerationText);
                }
            }
            declerationsText = declerationsText.join("\n");
            if (declerationsText.length) {
                ruleText = sprintf(ruleText, selectorPrefix, selector, declerationsText);
                rulesText.push(ruleText);
            }
        }
    }
    rulesText = rulesText.join("\n");
    return rulesText;
}

function applyCSS(selectorPrefix = ".preview") {
    let cssText = generateCSSText(selectorPrefix);
    let scrollbarStyleElement = document.querySelector("#scrollbar-style");
    if (!scrollbarStyleElement) {
        scrollbarStyleElement = document.createElement("style");
        scrollbarStyleElement.id = "scrollbar-style";
        document.body.append(scrollbarStyleElement);
    }
    scrollbarStyleElement.textContent = cssText;
}
