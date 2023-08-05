let css = {
    "scrollbar": {
        "width" : "10px",
        "height" : "10px",
    },
    "scrollbar-track" : {
        "background-color" : "hsla(0, 0%, 95%, 0.9)",
        "border-radius" : "4px",
    },
    "scrollbar-corner" : {
        "background-color" : null,
    },
    "scrollbar-thumb" : {
        "background-color" : "hsla(0, 0%, 75%, 0.95)",
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
                        // TODO: if there's only one decleration, the rule should be skipped
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
            ruleText = sprintf(ruleText, selectorPrefix, selector, declerationsText);
            rulesText.push(ruleText);
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
