class Character {
    el = null;
    width = 0;
    height = 0;
    vel = new Vector();
    pos = new Position();

    moveSpeed = getWindowSize().width * 0.25;
    gravity = getWindowSize().height * 2;
    jumpHeight = 0;
    isJumping = false;

    lastFiredAt = 0;

    container = null;

    constructor(el) {
        this.el = el;
        this.width = el.clientWidth;
        this.height = el.clientHeight;
        this.jumpHeight = this.height * 2;
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

    update(elapsedFrameTime) {
        if (this.isJumping) {
            this.vel.y += getPixelInTime(this.gravity, elapsedFrameTime);
        }

        this.adjPos(
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
            playSound(sounds.jump, true);
            const jumpSpeed = Math.sqrt(2 * this.gravity * this.jumpHeight);
            this.vel.y = -jumpSpeed;
            this.isJumping = true;
        }

        let fireCooldown = 200;
        if (clicks["left"]) {
            let now = performance.now();
            let elapsed = now - this.lastFiredAt;
            if (elapsed >= fireCooldown) {
                this.lastFiredAt = now;
                this.fire();
            }
        }
    }

    fire() {
        let img = el(`<img src="moustache.png" />`)[0];
        applyStyle(img, {
            src: "moustache.png",
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
        moustache.vel = Vector.createFromAngle(-90, getWindowSize().height);
        addWorldObject(moustache);
        playSound(sounds.throw);
    }
}
