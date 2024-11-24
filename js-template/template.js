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
    return (parentEl ?? document.body).querySelector(`template[data-name=${templateName}]`);
}

/**
 * Gets the placeholder elements that reference a template via attributes.
 * @param {string} templateName
 * @param {Element?} parentEl
 * @returns {Element[]} A list of custom elements with a template name as the tag,
 * or a normal element with a data-template="name" attribute.
 */
function getTemplateInstancePlaceholders(templateName, parentEl) {
    parentEl ??= document.body;
    let placeholders = Array.from(parentEl.querySelectorAll(templateName));
    placeholders = placeholders.concat(
        Array.from(parentEl.querySelectorAll(`[data-template-name=${templateName}]`))
    );
    return placeholders;
}

// #endregion

// #region ==================== RENDER

/**
 * Renders the expressions in the template string.
 * @param {string} templateString Raw HTML string with expressions.
 * @param {object} [data={}] Key-value pairs to be used in the expressions.
 * @returns {*} The processed HTML string with expressions replaced.
 */
function replaceTemplateExpressions(templateString, data = {}) {
    let expressionPattern = /{{\s*(.*?)\s*}}/gs;
    return templateString.replace(expressionPattern, (match, expression) => {
        try {
            return evaluateExpression(expression, data);
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
function htmlStringToElement(htmlString) {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}

// #endregion

// #region ==================== SWAP

/**
 * Creates an instance from the template and replaces the placeholder with the instance.
 * @param {Element} placeholder
 * @param {HTMLTemplateElement} template
 */
function replacePlaceholderWithInstance(placeholder, template) {
    let data = placeholder.dataset.templateData ?? {};
    if (typeof data == "string") {
        data = JSON.parse(data);
    }
    let templateHTML = template.content.firstElementChild.outerHTML;
    templateHTML = replaceTemplateExpressions(templateHTML, data);
    let instance = htmlStringToElement(templateHTML);
    placeholder.replaceWith(instance);
}

function renderTemplateInstances(parent) {
    parent ??= document.body;
    let templates = getTemplates(parent);
    for (const [templateName, template] of Object.entries(templates)) {
        let placeholders = getTemplateInstancePlaceholders(templateName, parent);
        for (const placeholder of placeholders) {
            replacePlaceholderWithInstance(placeholder, template);
        }
    }
}

// #endregion
