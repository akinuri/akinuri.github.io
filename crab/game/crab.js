class Crab extends WorldObject {
    moveSpeed = getWindowSize().width * 0.25;
    gravity = getWindowSize().height * 2;
    jumpHeight = 0;
    isJumping = false;

    lastFiredAt = 0;
    fireCooldown = 200;
    fireSpeed = getWindowSize().height;

    constructor() {
        let img = el(`<img src="assets/crab.png" />`)[0];
        applyStyle(img, {
            position: "absolute",
            width: "100px",
            opacity: "0.75",
        });
        super(img, 100, 82);
        this.jumpHeight = this.height * 2;
    }

    update(elapsedFrameTime) {
        if (this.isJumping) {
            this.vel.y += getPixelInTime(this.gravity, elapsedFrameTime);
        }

        super.update(
            elapsedFrameTime,
            getPixelInTime(this.vel.x, elapsedFrameTime),
            getPixelInTime(this.vel.y, elapsedFrameTime)
        );

        let groundY = 0;
        if (this.container) {
            groundY = this.container.bottom - this.height / 2;
        } else {
            groundY = getWindowSize().height - this.height / 2;
        }
        if (this.pos.y >= groundY) {
            this.vel.y = 0;
            this.isJumping = false;
        }
    }

    handleInput(keys, clicks) {
        this.vel.x = 0;

        let leftMovement = keys["arrowleft"] || keys["a"] || 0;
        let rightMovement = keys["arrowright"] || keys["d"] || 0;
        if (leftMovement > rightMovement) {
            this.vel.x = -this.moveSpeed;
        }
        if (rightMovement > leftMovement) {
            this.vel.x = this.moveSpeed;
        }

        if ((keys["arrowup"] || keys["w"] || keys[" "]) && !this.isJumping) {
            playSound(sounds.jump, 0.5);
            const jumpSpeed = Math.sqrt(2 * this.gravity * this.jumpHeight);
            this.vel.y = -jumpSpeed;
            this.isJumping = true;
        }

        if (clicks["left"]) {
            let now = performance.now();
            let elapsed = now - this.lastFiredAt;
            if (elapsed >= this.fireCooldown) {
                this.lastFiredAt = now;
                this.fire();
            }
        }
    }

    fire() {
        let img = el(`<img src="assets/moustache.png" />`)[0];
        applyStyle(img, {
            position: "absolute",
            width: "50px",
            aspectRatio: "1",
            objectFit: "contain",
            opacity: "0.75",
        });
        if (spinToggle.checked) {
            applyStyle(img, {
                animation: "500ms infinite linear spin",
            });
        }
        let moustache = new Projectile(img, 50, 50);
        moustache.setPos(this.pos);
        moustache.vel = Vector.createFromAngle(-90, this.fireSpeed);
        world.add(moustache);
        playSound(sounds.throw, 0.5);
    }
}
