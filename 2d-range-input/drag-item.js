function DragItem(area) {

    this.element = document.createElement("div");
    this.element.classList.add("drag-item");
    this.area = area;

    this.rect = null;
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

    updateRect: function () {
        rect = typeof rect == "undefined"
            ? this.element.getBoundingClientRect()
            : rect;
        this.rect = rect;
    },

    startDragging: function startDragging(e) {
        if (e.button != DragAreaUtils.MOUSE_BUTTON_LEFT) {
            return;
        }
        e.preventDefault();
        this.updateRect();
        this.area.updateRect();
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
        this.updateRect(null);
        this.area.updateRect(null);
    },

    drag: function drag(e) {
        let x = e.clientX - this.area.rect.left;
        let y = e.clientY - this.area.rect.top;
        this.move(x, y);
    },

    move: function (x, y, skip = false) {
        let maxX = this.area.rect.width - this.rect.width;
        let maxY = this.area.rect.height - this.rect.height;
        if (!skip) {
            let halfWidth = this.rect.width / 2;
            x -= halfWidth;
            y -= halfWidth;
        }
        x = DragAreaUtils.clamp(x, 0, maxX);
        y = DragAreaUtils.clamp(y, 0, maxY);
        this.posRatios = [x / maxX, y / maxY];
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    },

    updatePos: function () {
        this.updateRect();
        this.area.updateRect();
        let maxX = this.area.rect.width - this.rect.width;
        let maxY = this.area.rect.height - this.rect.height;
        let x = this.posRatios[0] * maxX;
        let y = this.posRatios[1] * maxY;
        this.move(x, y, true);
    },

};
