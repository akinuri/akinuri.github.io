function qs(query, parent) {
    if (query instanceof HTMLElement) return query;
    if (parent === null) {
        return null;
    }
    if (parent === undefined) {
        parent = document;
    }
    return parent.querySelector(query);
}

function qsa(query, parent) {
    if (query instanceof HTMLElement) return query;
    if (parent === null) {
        return [];
    }
    if (parent === undefined) {
        parent = document;
    }
    return Array.from(parent.querySelectorAll(query));
}

function range(start, end, step = 1) {
    const result = [];
    if (step === 0) {
        throw new Error("Step cannot be zero.");
    }
    if (start <= end && step < 0) {
        throw new Error("Step must be positive when start is less than or equal to end.");
    }
    if (start >= end && step > 0) {
        throw new Error("Step must be negative when start is greater than or equal to end.");
    }
    for (let i = start; start < end ? i <= end : i >= end; i += step) {
        result.push(i);
    }
    return result;
}

function downloadViaAnchor(url, filename) {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

function throttle(callback, delay = 1000) {
    var timeoutHandle = null;
    let throttleInner = function throttleInner() {
        let passedArgs = Array.from(arguments);
        if (timeoutHandle == null) {
            // NOTE: should the first call wait for the delay?
            timeoutHandle = setTimeout(function () {
                callback.apply(this, passedArgs);
                timeoutHandle = null;
            }.bind(this), delay || 1000);
        }
    };
    if (!(this instanceof Window)) {
        throttleInner = throttleInner.bind(this);
    }
    return throttleInner;
}

