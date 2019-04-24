function inView(el) {
    var elemRect = el.getBoundingClientRect();
    var element = {
        height  : elemRect.height,
        top     : elemRect.top + scrollY,
        bottom  : elemRect.top + scrollY + elemRect.height,
    };
    var viewport = {
        height : innerHeight,
        top    : scrollY,
        bottom : scrollY + innerHeight,
    };
    var visibility = {
        visible : "none",
        amount  : 0,
        overflow : element.height > viewport.height ? true : false,
    };
    if (viewport.top < element.top && element.top < viewport.bottom) {
        if (element.bottom < viewport.bottom) {
            visibility.visible = "whole";
            visibility.amount = 1;
        } else {
            visibility.visible = "top";
            visibility.amount = parseFloat( ((viewport.bottom - element.top) / element.height).toFixed(2) );
        }
    }
    else if (viewport.top < element.bottom && element.bottom < viewport.bottom) {
        if (element.top > viewport.top) {
            visibility.visible = "whole";
            visibility.amount = 1;
        } else {
            visibility.visible = "bottom";
            visibility.amount = parseFloat( ((element.bottom - viewport.top) / element.height).toFixed(2) );
        }
    }
    return {element, viewport, visibility};
}


function throttle(callback, delay) {
    var timeoutHandler = null;
    return function () {
        if (timeoutHandler == null) {
            timeoutHandler = setTimeout(function () {
                callback();
                clearInterval(timeoutHandler);
                timeoutHandler = null;
            }, delay);
        }
    }
}


function ViewTracker(el, callbacks, throttleDelay) {
    
    var self = this;
    
    this.trackVisibility(el);
    
    this._prevVisibility = null;
    
    this.stateStack = [];
    
    // [peek, left]
    // [peek, enter, leave, left]
    // [enter, leave, left]
    
    this.events = {
        callbacks : callbacks,
        handlers  : {
            enter : function () {
                if (self._prevVisibility == null) {
                    if (self.visibility.visible == "whole") {
                        self.stateStack.push("enter");
                        self.events.callbacks.enter();
                    }
                } else {
                    if (self._prevVisibility.visible != "whole" && self.visibility.visible == "whole") {
                        if (self.stateStack.includes("enter")) {
                            self.stateStack.push("reenter");
                            if (self.events.callbacks.reenter) {
                                self.events.callbacks.reenter();
                            }
                        } else {
                            self.stateStack.push("enter");
                            self.events.callbacks.enter();
                        }
                    }
                }
            },
            left : function () {
                if (self._prevVisibility && self._prevVisibility.visible != "none" && self.visibility.visible == "none") {
                    self.stateStack.push("left");
                    self.events.callbacks.left();
                    self.stateStack = [];
                }
            },
            peek : function () {
                if (self._prevVisibility == null) {
                    if (["top", "bottom"].includes(self.visibility.visible)) {
                        self.stateStack.push("peek");
                        self.events.callbacks.peek();
                    }
                } else {
                    if (["top", "bottom"].includes(self.visibility.visible) && !["top", "bottom"].includes(self._prevVisibility.visible)) {
                        if (self.stateStack.includes("peek") || self.stateStack.includes("enter")) {
                            self.stateStack.push("leave");
                            if (self.events.callbacks.leave) {
                                self.events.callbacks.leave();
                            }
                        } else {
                            self.stateStack.push("peek");
                            self.events.callbacks.peek();
                        }
                    }
                }
            },
        },
    };
    
    if (this.events.callbacks) {
        window.addEventListener("scroll", throttle(function () {
            self.trackVisibility(el);
            if (self.events.callbacks.enter || self.events.callbacks.reenter) {
                self.events.handlers.enter();
            }
            if (self.events.callbacks.peek) {
                self.events.handlers.peek();
            }
            if (self.events.callbacks.left) {
                self.events.handlers.left();
            }
            self._prevVisibility = self.visibility;
        }, throttleDelay || 200));
        window.addEventListener("resize", throttle(function () {
            self.trackVisibility(el);
            self._prevVisibility = self.visibility;
        }, throttleDelay * 2 || 500));
    }
    
}

ViewTracker.prototype.trackVisibility = function trackVisibility(el) {
    var iv = inView(el);
    this.element = iv.element;
    this.viewport = iv.viewport;
    this.visibility = iv.visibility;
};



