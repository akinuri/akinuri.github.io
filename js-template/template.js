// #region ==================== TEMPLATE

/**
 * Gets the template elements that has non-empty "data-name" attribute.
 * @param {HTMLElement?} parentEl The parent element to search for the templates. Defaults to `document.body` if not provided.
 * @returns {Object.<string, HTMLTemplateElement>} The templates with the "data-name" attribute as the key.
 */
function getTemplates(parentEl) {
    parentEl ??= document.body;
    let templates = {};
    let elements = Array.from(parentEl.querySelectorAll("template[data-name]:not([data-name=''])"));
    for (const element of elements) {
        templates[element.dataset.name] = element;
    }
    return templates;
}

/**
 * Gets the template element with the specified name as the "data-name" attribute value.
 * @param {string} templateName The name of the template to search for.
 * @param {HTMLElement?} parentEl The parent element to search for the template.
 * @returns {HTMLTemplateElement|null} The template element with the specified name or `null` if not found.
 */
function getTemplateByName(templateName, parentEl) {
    if (!templateName) {
        return null;
    }
    parentEl ??= document.body;
    return parentEl.querySelector(`template[data-name="${templateName}"]`);
}

// #endregion

// #region ==================== PLACEHOLDER

/**
 * Gets the placeholder elements that reference a template via attributes.
 * @param {HTMLElement?} parentEl The parent element to search for the placeholders. Defaults to `document.body` if not provided.
 * @returns {HTMLElement[]} A list of custom elements with a template name as the tag,
 * or a normal element with a data-template="name" attribute.
 */
function getPlaceholders(parentEl) {
    parentEl ??= document.body;
    let placeholders = [];
    for (const templateName in getTemplates()) {
        placeholders.push(...getPlaceholdersByTemplateName(templateName, parentEl));
    }
    return placeholders;
}

/**
 * Gets the placeholder elements (by template name) that reference a template via attributes.
 * @param {string} templateName The name of the template to search for.
 * @param {HTMLElement?} parentEl The parent element to search for the placeholders. Defaults to `document.body` if not provided.
 * @returns {HTMLElement[]} A list of custom elements with a template name as the tag,
 * or a normal element with a data-template="name" attribute.
 */
function getPlaceholdersByTemplateName(templateName, parentEl) {
    parentEl ??= document.body;
    return Array.from(
        parentEl.querySelectorAll(
            `${templateName}, [data-template="${templateName}"], [data-template-name="${templateName}"]`
        )
    );
}

/**
 * Checks if the element is a placeholder element for a template.
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isPlaceholder(element) {
    const templateName = getPlaceholderTemplateName(element);
    if (!templateName) {
        return false;
    }
    let query = `[data-template="${templateName}"], [data-template-name="${templateName}"]`;
    if (element.matches(query)) {
        return true;
    }
    const templates = getTemplates();
    return templateName in templates;
}

/**
 * Gets the template name from the placeholder element.
 * @param {HTMLElement} placeholderEl
 * @returns {string} The template name or tag name of the placeholder element.
 */
function getPlaceholderTemplateName(placeholderEl) {
    return placeholderEl.dataset.templateName ?? placeholderEl.dataset.template ?? placeholderEl.tagName.toLowerCase();
}

// #endregion

// #region ==================== RENDER

class OutputBuffer {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    toString() {
        return this.items.join("");
    }
}

/**
 * Renders the expressions in the template string.
 * @param {string} templateString Raw HTML string with expressions.
 * @param {object} [data={}] Key-value pairs to be used in the expressions. The keys are the variable names and the values are their corresponding values.
 * @returns {*} The processed HTML string with expressions replaced.
 */
function replaceTemplateExpressions(templateString, data = {}) {
    let expressionPattern = /{{\s*(.*?)\s*}}/gs;
    return templateString.replace(expressionPattern, (match, expression) => {
        let ob = new OutputBuffer();
        data.write = (item) => ob.add(item);
        try {
            let text = evaluateExpression(expression, data);
            if (text == undefined) {
                text = "";
            }
            text += ob;
            return text;
        } catch (error) {
            console.warn(`Error evaluating the expression: ${expression}`, error);
            return "";
            return match;
        }
    });
}

/**
 * Evaluates the expression with the given context.
 * @param {string} expression The expression to evaluate.
 * @param {object} context The context object containing the variables used in the expression.
 * @returns {*} The result of the expression.
 */
function evaluateExpression(expression, context) {
    return new Function(...Object.keys(context), `return ${expression};`)(...Object.values(context));
}

// #endregion

// #region ==================== UTILS

/**
 * Converts an HTML string into an array of DOM elements.
 *
 * @param {string} htmlString - The HTML string to convert.
 * @returns {Array<Node|HTMLElement>} An array of child nodes/elements of the created DOM element.
 */
function htmlFromString(htmlString, onlyElements = false) {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    let nodes = Array.from(template.content.childNodes);
    if (onlyElements) {
        nodes = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
    }
    return nodes;
}

/**
 * Applies a set of attributes to a given DOM element, with an option to exclude specific attributes.
 *
 * @param {HTMLElement} element - The DOM element to which the attributes will be applied.
 * @param {NamedNodeMap} attributes - `attributes` object of an element.
 * @param {Array<string>} [except=[]] - An optional array of attribute names to be excluded from being applied.
 */
function applyAttributes(element, attributes, except = []) {
    for (const attr of attributes) {
        if (except.includes(attr.name)) {
            continue;
        }
        if (attr.name === "class") {
            element.classList.add(...attr.value.split(" "));
        } else {
            element.setAttribute(attr.name, attr.value);
        }
    }
}

/**
 * Replaces a target DOM element with a new set of DOM elements.
 *
 * @param {HTMLElement} targetEl - The target element to be replaced.
 * @param {Array<Element>|Element} newEls - An array of new elements to replace the target element.
 */
function replaceElement(targetEl, newEls) {
    // NOTE: used Element instead of HTMLElement to allow for svg elements
    // TODO: might need to switch to Element in other places as well
    if (!Array.isArray(newEls) && newEls instanceof Element) {
        newEls = [newEls];
    }
    if (newEls.length == 0) {
        return;
    }
    targetEl.replaceWith(newEls[0]);
    let lastEl = newEls[0];
    for (const element of newEls.slice(1)) {
        lastEl.after(element);
        lastEl = element;
    }
}

/**
 * Fetches HTML templates from the specified URL.
 *
 * @async
 * @param {string} url - The URL to fetch the templates from.
 * @returns {Promise<string>} A promise that resolves to the HTML content as a string.
 * @throws Throws an error if the HTTP response is not ok.
 */
async function fetchTemplatesFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return html;
}

/**
 * Loads HTML templates from a given URL and inserts them into the document.
 *
 * @param {string} url - The URL to fetch the templates from.
 * @param {boolean} [useNewContainer=true] - Whether to use a new container for the templates or append to an existing one.
 * @throws Will throw an error if no .template-container is found when useNewContainer is false.
 */
async function loadTemplatesFromUrl(url, useNewContainer = true) {
    const html = await fetchTemplatesFromUrl(url);
    if (useNewContainer) {
        const container = document.createElement("div");
        container.hidden = true;
        container.classList.add("template-container");
        container.innerHTML = html;
        document.body.append(container);
    } else {
        const container = document.querySelector(".template-container");
        if (!container) {
            throw new Error("No .template-container found.");
        }
        container.innerHTML += html;
    }
}

// #endregion

// #region ==================== BUILD

/**
 * Builds an instance from a template element.
 *
 * @param {HTMLElement} templateEl - The template element to build from.
 * @param {object} [data={}] - Key-value pairs to be used in the expressions. The keys are the variable names and the values are their corresponding values.
 * @param {NamedNodeMap} attributes - `attributes` object of an element.
 * @returns {HTMLElement|null} The built instance or null if templateEl is not provided.
 */
function buildInstanceFromTemplate(templateEl, data = {}, attributes = {}) {
    if (!templateEl) {
        return null;
    }
    let templateString = templateEl.content.firstElementChild.outerHTML;
    templateString = templateString.replaceAll("&gt;", ">");
    templateString = templateString.replaceAll("&lt;", "<");
    templateString = replaceTemplateExpressions(templateString, data);
    let instance = htmlFromString(templateString, true)[0];
    if (isPlaceholder(instance)) {
        instance = buildInstanceFromPlaceholder(instance);
    }
    applyAttributes(instance, attributes);
    renderTemplateInstances(instance);
    return instance;
}

/**
 * Builds an instance from a placeholder element.
 *
 * @param {HTMLElement} placeholderEl - The placeholder element to build from.
 * @returns {HTMLElement|null} The built instance or null if placeholderEl is not provided.
 */
function buildInstanceFromPlaceholder(placeholderEl) {
    if (!placeholderEl) {
        return null;
    }
    let data = {};
    if (placeholderEl.dataset.templateData) {
        try {
            data = JSON.parse(placeholderEl.dataset.templateData);
        } catch (e) {
            console.error("Error parsing JSON data:", e);
        }
    }
    let content = placeholderEl.innerHTML;
    let slot = getPlaceholderSlots(placeholderEl);
    data.content = content;
    data.slot = slot;
    let templateName = getPlaceholderTemplateName(placeholderEl);
    let instance = buildInstanceFromTemplateName(templateName, data, placeholderEl.attributes);
    return instance;
}

/**
 * Creates an instance from a template name.
 *
 * @param {string} templateName - The name of the template to use.
 * @param {object} [data={}] - Key-value pairs to be used in the expressions. The keys are the variable names and the values are their corresponding values.
 * @param {NamedNodeMap} attributes - `attributes` object of an element.
 * @returns {object} The instance created from the template.
 */
function buildInstanceFromTemplateName(templateName, data = {}, attributes = {}) {
    return buildInstanceFromTemplate(getTemplateByName(templateName), data, attributes);
}

/**
 * Extracts and returns the content of named slots from a given placeholder element.
 *
 * @param {HTMLElement} placeholderEl - The placeholder element containing the slots.
 * @returns {object} An object where the keys are the slot names and the values are the slot contents.
 */
function getPlaceholderSlots(placeholderEl) {
    let slots = {};
    let slotEls = placeholderEl.querySelectorAll(":scope > slot[data-name]:not([data-name=''])");
    for (const slotEl of slotEls) {
        let slot = {
            name: slotEl.dataset.name,
            content: slotEl.innerHTML.trim(),
        };
        slots[slot.name] = slot.content;
    }
    return slots;
}

// #endregion

// #region ==================== REPLACE

/**
 * Replaces a placeholder element with an instance created from the placeholder's template.
 * 
 * @param {HTMLElement} placeholder - The placeholder element to be replaced.
 */
function replacePlaceholderWithInstance(placeholder) {
    if (!placeholder) {
        return;
    }
    let instance = buildInstanceFromPlaceholder(placeholder);
    if (instance) {
        replaceElement(placeholder, instance);
    }
}

/**
 * Renders template instances within a given parent element.
 * If no parent element is provided, defaults to the document body.
 *
 * @param {HTMLElement?} parentEl - The parent element to search for placeholders.
 */
function renderTemplateInstances(parentEl) {
    parentEl ??= document.body;
    let placeholders = getPlaceholders(parentEl);
    for (const placeholder of placeholders) {
        replacePlaceholderWithInstance(placeholder);
    }
}

// #endregion