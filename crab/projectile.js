class Projectile {
    el = null;
    width = 0;
    height = 0;
    vel = new Vector();
    pos = new Position();

    lastFiredAt = 0;

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

    update(elapsedFrameTime) {
        this.adjPos(
            getPixelInTime(this.vel.x, elapsedFrameTime),
            getPixelInTime(this.vel.y, elapsedFrameTime)
        );
        if (this.isOffScreen()) {
            removeWorldObject(this);
        }
    }

    isOffScreen() {
        return this.pos.y + this.height / 2 < 0;
    }
}
