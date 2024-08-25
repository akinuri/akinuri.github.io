class Projectile extends WorldObject {
    constructor(el, width = 0, height = 0) {
        super(el, width, height);
    }

    update(elapsedFrameTime) {
        super.update(elapsedFrameTime);
        if (this.isOffScreen()) {
            world.remove(this);
        }
    }
}
