function on(elements, events, callback, options = {}) {
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
        events = undefined;
        callback = undefined;
        for (let events in eventCallbackMap) {
            let callback = eventCallbackMap[events];
            if (typeof callback == "function") {
                events = events.split(" ");
                elements.forEach(element => {
                    events.forEach(event => {
                        element.addEventListener(event, function (e) {
                            callback.call(this, e);
                        }, options);
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
            events.forEach(event => {
                element.addEventListener(event, function (e) {
                    callback.call(this, e);
                }, options);
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