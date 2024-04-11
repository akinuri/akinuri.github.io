function DragArea(itemCount = 1) {

    this.element = document.createElement("div");
    this.element.classList.add("drag-area");

    this.elRect = null;
    this.resizable = false;

    for (const prop in DragArea.defaultStyle) {
        this.element.style[prop] = DragArea.defaultStyle[prop];
    }

    this.items = [];

    for (let index = 0; index < itemCount; index++) {
        let item = new DragItem(this);
        this.element.append(item.element);
        this.items.push(item);
    }

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            this.items.forEach(item => item.updatePosFromLog());
        }
    });
    resizeObserver.observe(this.element);

    this.element.addEventListener("mousedown", function (e) {
        if (e.button != DragAreaUtils.MOUSE_BUTTON_LEFT) {
            return false;
        }
        if (e.target != this.element) {
            return false;
        }
        if (this.resizable) {
            return false;
        }
        let item = this.getClosestItem(e);
        this.moveItemToClickedPos(item, e);
        item.startDragging(e);
    }.bind(this));
}

DragArea.defaultStyle = {
    width: "128px",
    height: "128px",
    backgroundColor: "hsl(0, 0%, 50%, 0.1)",
    position: "relative",
};

DragArea.prototype = {

    updateElRect: function (rect) {
        rect = typeof rect == "undefined"
            ? this.element.getBoundingClientRect()
            : rect;
        this.elRect = rect;
    },

    getClosestItem: function (e) {
        let distances = new Map();
        for (const item of this.items) {
            let itemPos = item.getPos(true);
            let distance = DragAreaUtils.calcDist(
                e.offsetX, e.offsetY,
                itemPos.x, itemPos.y,
            );
            distances.set(item, distance);
        }
        return DragAreaUtils.getMinValueKey(distances);
    },

    moveItemToClickedPos: function (item, e) {
        this.updateElRect();
        item.updateElRect();
        item.moveTo(e.offsetX, e.offsetY, true);
    },

    makeResizable: function makeResizable() {
        this.resizable = true;
        this.element.style.overflow = "auto";
        this.element.style.resize = "both";
    },

    makeNotResizable: function makeResizable() {
        this.resizable = false;
        this.element.style.overflow = "";
        this.element.style.resize = "";
    },

};
