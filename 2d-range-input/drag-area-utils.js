let DragAreaUtils = {

    MOUSE_BUTTON_LEFT: 0,
    MOUSE_BUTTON_RIGHT: 2,

    clamp: function clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    },

    calcDist: function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    getMinValueKey: function (map) {
        const [key, value] = Array.from(map).reduce((prevEntry, currEntry) => {
            return currEntry[1] < prevEntry[1] ? currEntry : prevEntry;
        });
        return key;
    },

};
