let DragAreaUtils = {

    MOUSE_BUTTON_LEFT : 0,
    MOUSE_BUTTON_RIGHT : 2,

    clamp: function clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    },

};
