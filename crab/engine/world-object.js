class WorldObject {
    el = null;
    width = 0;
    height = 0;
    vel = new Vector();
    pos = new Position();

    container = null;

    constructor(el, width = 0, height = 0) {
        this.el = el;
        this.width = width || el.clientWidth;
        this.height = height || el.clientHeight;
    }

    setPos(x, y) {
        if (typeof x == "object") {
            y = x.y;
            x = x.x;
        }
        if (this.container) {
            x = clamp(
                x,
                this.container.pos.x + this.width / 2,
                this.container.right - this.width / 2
            );
            y = clamp(
                y,
                this.container.pos.y + this.height / 2,
                this.container.bottom - this.height / 2
            );
        }
        this.pos.set(x, y);
    }

    adjPos(x, y) {
        if (typeof x == "object") {
            y = x.y;
            x = x.x;
        }
        this.setPos(this.pos.x + x, this.pos.y + y);
    }

    render(isCenterOffset = false) {
        let { x, y } = this.pos;
        if (!isCenterOffset) {
            x -= this.width / 2;
            y -= this.height / 2;
        }
        this.el.style.left = x + "px";
        this.el.style.top = y + "px";
    }

    update(elapsedFrameTime, offsetX, offsetY) {
        this.adjPos(
            offsetX || getPixelInTime(this.vel.x, elapsedFrameTime),
            offsetY || getPixelInTime(this.vel.y, elapsedFrameTime)
        );
        if (isDebugging()) {
            this.el.classList.add("bounding-box");
        } else {
            this.el.classList.remove("bounding-box");
        }
    }

    isOffScreen() {
        return (
            this.pos.x + this.width / 2 < 0 ||
            this.pos.x - this.width / 2 > innerWidth ||
            this.pos.y + this.height / 2 < 0 ||
            this.pos.y - this.height / 2 > innerHeight
        );
    }
}
