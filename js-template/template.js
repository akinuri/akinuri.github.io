// #region ==================== TEMPLATES

/**
 * Gets the template elements that has non-empty "data-name" attribute.
 * @param {Element?} parentEl
 * @returns {HTMLTemplateElement[]}
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
 * @param {Element?} parentEl
 * @returns {HTMLTemplateElement}
 */
function getTemplateByName(templateName, parentEl) {
    if (!templateName) {
        return null;
    }
    return (parentEl ?? document.body).querySelector(`template[data-name=${templateName}]`);
}

// #endregion

// #region ==================== PLACEHOLDERS

function getPlaceholders(parentEl) {
    parentEl ??= document.body;
    let placeholders = [];
    for (const templateName in getTemplates()) {
        placeholders = placeholders.concat(getPlaceholdersByTemplateName(templateName, parentEl));
    }
    return placeholders;
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
        parentEl.querySelectorAll(
            `${templateName}, [data-template=${templateName}], [data-template-name=${templateName}]`
        )
    );
}

function isPlaceholder(element) {
    let templateName = getPlaceholderTemplateName(element);
    let query = `[data-template=${templateName}], [data-template-name=${templateName}]`;
    if (element.matches(query)) {
        return true;
    }
    let templates = getTemplates();
    return templateName in templates;
}

function getPlaceholderTemplateName(placeholderEl) {
    return (
        placeholderEl.dataset.templateName ??
        placeholderEl.dataset.template ??
        placeholderEl.tagName.toLowerCase()
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

// #region ==================== HELPERS

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

function applyAttributes(element, attributes, except = []) {
    for (const attr of Array.from(attributes)) {
        if (except.includes(attr.name)) {
            continue;
        }
        if (attr.name == "class") {
            if (element.className.length) {
                element.className += " " + attr.value;
            } else {
                element.setAttribute(attr.name, attr.value);
            }
        } else {
            element.setAttribute(attr.name, attr.value);
        }
    }
}

// #endregion

// #region ==================== BUILD

function buildInstanceFromTemplate(template, data = {}, attrs = {}) {
    if (!template) {
        return null;
    }
    let templateString = template.content.firstElementChild.outerHTML;
    templateString = templateString.replace("&gt;", ">");
    templateString = templateString.replace("&lt;", "<");
    templateString = replaceTemplateExpressions(templateString, data);
    let instance = htmlFromString(templateString);
    if (isPlaceholder(instance)) {
        instance = buildInstanceFromPlaceholder(instance);
    }
    applyAttributes(instance, attrs);
    renderTemplateInstances(instance);
    return instance;
}

function buildInstanceFromPlaceholder(placeholderEl) {
    if (!placeholderEl) {
        return null;
    }
    let data = placeholderEl.dataset.templateData ?? {};
    if (typeof data == "string") {
        data = JSON.parse(data);
    }
    let content = placeholderEl.innerHTML;
    let slot = getPlaceholderSlots(placeholderEl);
    data.content = content;
    data.slot = slot;
    let templateName = getPlaceholderTemplateName(placeholderEl);
    return buildInstanceFromTemplateName(templateName, data, placeholderEl.attributes);
}

function buildInstanceFromTemplateName(templateName, data = {}, attrs = {}) {
    return buildInstanceFromTemplate(getTemplateByName(templateName), data, attrs);
}

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

function renderTemplateInstances(parentEl) {
    parentEl ??= document.body;
    let placeholders = getPlaceholders(parentEl);
    for (const placeholder of placeholders) {
        replacePlaceholderWithInstance(placeholder);
    }
}

// #endregion
