class Rectangle {
    width = 0;
    height = 0;
    pos = new Position();

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.pos.x = x;
        this.pos.y = y;
        this.width = width;
        this.height = height;
        this.right = this.pos.x + this.width;
        this.bottom = this.pos.y + this.height;
    }

    show() {
        if (!this.el) {
            this.el = document.createElement("div");
            applyStyle(this.el, {
                position: "absolute",
                left: this.pos.x + "px",
                top: this.pos.y + "px",
                width: this.width + "px",
                height: this.height + "px",
                border: "1px dashed black",
                opacity: "0.5",
            });
            gameCanvas.prepend(this.el);
        }
    }

    hide() {
        this.el?.remove();
        this.el = null;
    }
}
