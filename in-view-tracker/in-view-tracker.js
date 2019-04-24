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
    
    this.events = {
        callbacks : callbacks,
        handlers  : {
            enter : function () {
                if (self._prevVisibility == null) {
                    if (self.visibility.visible == "whole") {
                        self.events.callbacks.enter();
                    }
                } else {
                    if (self.visibility.visible == "whole" && self._prevVisibility.visible != "whole") {
                        self.events.callbacks.enter();
                    }
                }
            },
            exit : function () {
                if (self._prevVisibility != null) {
                    if (self.visibility.visible != "whole" && self._prevVisibility.visible == "whole") {
                        self.events.callbacks.exit();
                    }
                }
            },
        },
    };
    
    if (this.events.callbacks) {
        window.addEventListener("scroll", throttle(function () {
            self.trackVisibility(el);
            if (self.events.callbacks.enter) {
                self.events.handlers.enter();
            }
            if (self.events.callbacks.exit) {
                self.events.handlers.exit();
            }
            self._prevVisibility = self.visibility;
        }, throttleDelay || 200));
    }
    
}

ViewTracker.prototype.trackVisibility = function trackVisibility(el) {
    var iv = inView(el);
    this.element = iv.element;
    this.viewport = iv.viewport;
    this.visibility = iv.visibility;
};



