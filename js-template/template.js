// #region ==================== GETTERS

/**
 * Gets the template elements that has non-empty "data-name" attribute.
 * @param {Element?} parentEl
 * @returns {HTMLTemplateElement[]}
 */
function getTemplates(parentEl) {
    parentEl ??= document.body;
    let templates = {};
    let elements = Array.from(parentEl.querySelectorAll("template[data-name]"));
    for (const element of elements) {
        if (element.dataset.name.length) {
            templates[element.dataset.name] = element;
        }
    }
    return templates;
}

/**
 * Gets the template element with the specified name as the "data-name" attribute value.
 * @param {Element?} parentEl
 * @returns {HTMLTemplateElement}
 */
function getTemplate(templateName, parentEl) {
    if (!templateName) {
        return null;
    }
    return (parentEl ?? document.body).querySelector(`template[data-name=${templateName}]`);
}

function getPlaceholders(parentEl) {
    parentEl ??= document.body;
    return Array.from(parentEl.querySelectorAll(`[data-template-name], [data-template-data]`));
}

/**
 * Gets the placeholder elements that reference a template via attributes.
 * @param {string} templateName
 * @param {Element?} parentEl
 * @returns {Element[]} A list of custom elements with a template name as the tag,
 * or a normal element with a data-template="name" attribute.
 */
function getPlaceholdersByTemplateName(templateName, parentEl) {
    parentEl ??= document.body;
    return Array.from(
        parentEl.querySelectorAll(`${templateName}, [data-template-name=${templateName}]`)
    );
}

function getPlaceholderTemplateName(placeholderEl) {
    return (
        placeholderEl.dataset.templateName ??
        (placeholderEl instanceof HTMLUnknownElement ? placeholderEl.tagName.toLowerCase() : null)
    );
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
 * @param {object} [data={}] Key-value pairs to be used in the expressions.
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
            console.warn(`Error evaluating expression: ${expression}`, error);
            return "";
            return match;
        }
    });
}

/**
 * @param {string} expression A JS expression.
 * @param {object} context Key-value pairs.
 * @returns {*} The expression result.
 */
function evaluateExpression(expression, context) {
    return new Function(...Object.keys(context), `return ${expression};`)(
        ...Object.values(context)
    );
}

// #endregion

// #region ==================== HELPER

/**
 * Converts a raw HTML string into an element.
 * @param {string} htmlString The processed HTML string.
 * @returns {Element} The resulting DOM element.
 */
function htmlFromString(htmlString) {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}

// #endregion

// #region ==================== SWAP

function buildInstanceFromPlaceholder(placeholderEl) {
    let instance = null;
    if (!placeholderEl) {
        return instance;
    }
    let template = getTemplate(getPlaceholderTemplateName(placeholderEl));
    if (!template) {
        return instance;
    }
    let data = placeholderEl.dataset.templateData ?? {};
    if (typeof data == "string") {
        data = JSON.parse(data);
    }
    let templateString = template.content.firstElementChild.outerHTML;
    templateString = templateString.replace("&gt;", ">");
    templateString = templateString.replace("&lt;", "<");
    templateString = replaceTemplateExpressions(templateString, data);
    instance = htmlFromString(templateString);
    return instance;
}

/**
 * Creates an instance from the template and replaces the placeholder with the instance.
 * @param {Element} placeholder
 * @param {HTMLTemplateElement} template
 */
function replacePlaceholderWithInstance(placeholder) {
    let instance = buildInstanceFromPlaceholder(placeholder);
    if (placeholder && instance) {
        placeholder.replaceWith(instance);
    }
}

function renderTemplateInstances(parent) {
    parent ??= document.body;
    let placeholders = getPlaceholders(parent);
    for (const placeholder of placeholders) {
        replacePlaceholderWithInstance(placeholder);
    }
}

// #endregion
