function DragArea(itemCount = 1) {

    this.element = document.createElement("div");
    this.element.classList.add("drag-area");

    this.rect = null;
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
            this.items.forEach(item => item.updatePos());
        }
    });
    resizeObserver.observe(this.element);
    
    // TODO: snap the closest item to the click
    // this.element.addEventListener("mousedown", function (e) {
    //     let isMoved = this.moveItemToClickedPos(e);
    //     if (isMoved) {
    //         this.item.startDragging(e);
    //     }
    // }.bind(this));
}

DragArea.defaultStyle = {
    width: "128px",
    height: "128px",
    backgroundColor: "hsl(0, 0%, 50%, 0.1)",
    position: "relative",
};

DragArea.prototype = {

    updateRect: function (rect) {
        rect = typeof rect == "undefined"
            ? this.element.getBoundingClientRect()
            : rect;
        this.rect = rect;
    },

    // moveItemToClickedPos: function (e) {
    //     if (e.button != DragAreaUtils.MOUSE_BUTTON_LEFT) {
    //         return false;
    //     }
    //     if (e.target == this.item.element) {
    //         return false;
    //     }
    //     if (this.resizable) {
    //         return false;
    //     }
    //     this.updateRect();
    //     this.item.updateRect();
    //     this.item.move(e.offsetX, e.offsetY);
    //     return true;
    // },

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
