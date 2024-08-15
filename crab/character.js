class Character {
    el = null;
    width = 0;
    height = 0;
    vel = new Vector();
    maxSpeed = 50;
    minSpeed = 2;
    constructor(el) {
        this.el = el;
        this.width = el.clientWidth;
        this.height = el.clientHeight;
    }
    setPos(x, y) {
        this.el.style.left = x + "px";
        this.el.style.top = y + "px";
    }
    getPos() {
        return {
            x: parseInt(this.el.style.left),
            y: parseInt(this.el.style.top),
        };
    }
    update(targetX, targetY) {
        // TODO: dive deeper, switch to vectors, base on time
        const pos = this.getPos();
        const dx = targetX - pos.x;
        const dy = targetY - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.min(this.maxSpeed, Math.max(this.minSpeed, distance * 0.05));
        if (distance < speed) {
            this.setPos(targetX, targetY);
            this.vel.x = 0;
            this.vel.y = 0;
        } else {
            const angle = Math.atan2(dy, dx);
            this.vel.x = Math.cos(angle) * speed;
            this.vel.y = Math.sin(angle) * speed;
            this.setPos(pos.x + this.vel.x, pos.y + this.vel.y);
        }
    }
}
