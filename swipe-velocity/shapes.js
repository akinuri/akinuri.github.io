class Circle {
    el = null;
    radius = 0;
    pos = new Point();
    vel = new Vector();
    container = null;
    dragPosLog = new Stack(2, true);
    constructor(el) {
        this.el = el;
        this.radius = el.clientWidth / 2;
    }
    move(deltaTime) {
        this.pos.x += this.vel.x * deltaTime;
        this.pos.y += this.vel.y * deltaTime;
        this.checkBounds();
        this.moveTo(this.pos.x, this.pos.y);
    }
    moveTo(x, y) {
        if (this.container) {
            x = clamp(
                x,
                this.container.pos.x,
                this.container.pos.x + this.container.width - this.radius * 2,
            );
            y = clamp(
                y,
                this.container.pos.y,
                this.container.pos.y + this.container.height - this.radius * 2,
            );
        }
        this.pos.x = x;
        this.pos.y = y;
        this.el.style.left = x + "px";
        this.el.style.top = y + "px";
    }
    getCenterPos() {
        return {
            x: this.pos.x + this.radius,
            y: this.pos.y + this.radius,
        }
    }
    logDragPos(x, y, time) {
        time = time || performance.now();
        this.dragPosLog.push(
            {x, y, time}
        );
    }
    getDragPosDelta() {
        let prev = this.dragPosLog.peek(1);
        let current = this.dragPosLog.peek(0);
        let delta = {
            x : 0,
            y : 0,
            time : 0,
        };
        if (prev && current) {
            delta.time = (current.time - prev.time) / 1000;
            delta.x = current.x - prev.x;
            delta.y = current.y - prev.y;
        }
        return delta;
    }
    calcDragVel() {
        let vel = new Vector();
        let delta = this.getDragPosDelta();
        if (delta.time != 0) {
            vel.x = delta.x / delta.time;
            vel.y = delta.y / delta.time;
        }
        return vel;
    }
    checkBounds() {
        if (!this.container) return;
        const leftBound = this.container.pos.x;
        const rightBound = this.container.pos.x + this.container.width - this.radius * 2;
        const topBound = this.container.pos.y;
        const bottomBound = this.container.pos.y + this.container.height - this.radius * 2;
        if (this.pos.x <= leftBound) {
            this.pos.x = leftBound;
            this.vel.x *= -1;
        } else if (this.pos.x >= rightBound) {
            this.pos.x = rightBound;
            this.vel.x *= -1;
        }
        if (this.pos.y <= topBound) {
            this.pos.y = topBound;
            this.vel.y *= -1;
        } else if (this.pos.y >= bottomBound) {
            this.pos.y = bottomBound;
            this.vel.y *= -1;
        }
    }
}

class Rectangle {
    pos = new Point();
    width = 0;
    height = 0;
    constructor(x, y, width, height) {
        this.pos.x = x;
        this.pos.y = y;
        this.width = width;
        this.height = height;
    }
}