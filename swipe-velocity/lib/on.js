function on(elements, events, callback, options = {}) {
    if (typeof elements == "string") {
        elements = Array.from(document.querySelectorAll(elements));
    }
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    let hasEventCallbackMap = (
        typeof events == "object"
        && !Array.isArray(events)
        && events !== null
        && typeof callback == "undefined"
    );
    if (hasEventCallbackMap) {
        let eventCallbackMap = events;
        options = callback;
        events = undefined;
        callback = undefined;
        for (let events in eventCallbackMap) {
            let callback = eventCallbackMap[events];
            if (typeof callback == "function") {
                events = events.split(" ");
                elements.forEach(element => {
                    events.forEach(event => {
                        // WIP
                        element.addEventListener(event, callback, options);
                    });
                });
            }
        }
    }
    else if (callback && typeof callback == "function") {
        if (typeof events == "string") {
            events = events.split(" ");
        }
        elements.forEach(element => {
            if (!element) {
                return;
            }
            events.forEach(event => {
                // WIP
                element.addEventListener(event, callback, options);
            });
        });
    }
}

function ondomload(callback) {
    on(window, "DOMContentLoaded", callback);
}

function onwindowload(callback) {
    on(window, "load", callback);
}

function trigger(element, eventName, isCustomEvent = false, options = {}) {
    let event = isCustomEvent
        ? new CustomEvent(eventName, options)
        : new Event(eventName, options);
    element.dispatchEvent(event);
}

// WIP
function off(elements, events, callback) {
    if (typeof elements == "string") {
        elements = Array.from(document.querySelectorAll(elements));
    }
    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    if (typeof events == "string") {
        events = events.split(" ");
    }
    elements.forEach(element => {
        if (!element) {
            return;
        }
        events.forEach(event => {
            element.removeEventListener(event, callback);
        });
    });
}