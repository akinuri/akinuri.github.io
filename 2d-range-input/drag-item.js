function DragItem(area) {

    this.area = area;

    this.element = document.createElement("div");
    this.element.classList.add("drag-item");

    this.elRect = null;
    this.posRatios = [0, 0];

    for (const prop in DragItem.defaultStyle) {
        this.element.style[prop] = DragItem.defaultStyle[prop];
    }

    this.element.addEventListener("mousedown", this.startDragging.bind(this));

    document.addEventListener("mouseup", this.stopDragging.bind(this));
}

DragItem.defaultStyle = {
    width: "16px",
    height: "16px",
    backgroundColor: "hsl(0, 0%, 50%, 0.2)",
    position: "absolute",
};

DragItem.prototype = {

    updateElRect: function (rect) {
        rect = typeof rect == "undefined"
            ? this.element.getBoundingClientRect()
            : rect;
        this.elRect = rect;
    },

    startDragging: function startDragging(e) {
        if (e.button != DragAreaUtils.MOUSE_BUTTON_LEFT) {
            return;
        }
        e.preventDefault();
        this.updateElRect();
        this.area.updateElRect();
        if (!this.dragBound) {
            this.dragBound = this.drag.bind(this);
        }
        document.addEventListener("mousemove", this.dragBound);
    },

    stopDragging: function stopDragging(e) {
        if (
            e.button != DragAreaUtils.MOUSE_BUTTON_LEFT
            && e.button != DragAreaUtils.MOUSE_BUTTON_RIGHT
        ) {
            return;
        }
        document.removeEventListener("mousemove", this.dragBound);
        this.updateElRect(null);
        this.area.updateElRect(null);
    },

    drag: function drag(e) {
        let x = e.clientX - this.area.elRect.left;
        let y = e.clientY - this.area.elRect.top;
        this.moveTo(x, y, true);
    },

    moveTo: function (x, y, refCenter = false) {
        ({ x, y } = this.calcPos(x, y, refCenter));
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    },

    calcPos: function (x, y, refCenter = false) {
        let maxX = this.area.elRect.width - this.elRect.width;
        let maxY = this.area.elRect.height - this.elRect.height;
        if (refCenter) {
            let halfWidth = this.elRect.width / 2;
            x -= halfWidth;
            y -= halfWidth;
        }
        x = DragAreaUtils.clamp(x, 0, maxX);
        y = DragAreaUtils.clamp(y, 0, maxY);
        logPos: {
            this.posRatios = [x / maxX, y / maxY];
        }
        return { x, y };
    },

    updatePosFromLog: function () {
        this.updateElRect();
        this.area.updateElRect();
        let maxX = this.area.elRect.width - this.elRect.width;
        let maxY = this.area.elRect.height - this.elRect.height;
        let x = this.posRatios[0] * maxX;
        let y = this.posRatios[1] * maxY;
        this.moveTo(x, y);
    },

    getPos: function (refCenter = false) {
        let computedStyle = getComputedStyle(this.element);
        let x = parseFloat(computedStyle.left);
        let y = parseFloat(computedStyle.top);
        this.updateElRect();
        if (refCenter) {
            let halfWidth = this.elRect.width / 2;
            x += halfWidth;
            y += halfWidth;
        }
        return { x, y };
    },

};
