class Bubble {
    el = null;
    width = 0;
    height = 0;
    vel = new Vector();
    pos = new Position();

    // TODO: refactor the perlin noise
    noiseOffset = Math.random() * 1000;
    noiseSpeed = 0.0075;
    noiseAmplitude = 2;

    constructor(size) {
        this.el = el(`<div class="bubble"></div>`)[0];
        applyStyle(this.el, {
            width: size + "px",
            height: size + "px",
        });
        this.width = size;
        this.height = size;
        this.vel = Vector.createFromAngle(0, getWindowSize().width * 0.1);
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
        this.noiseOffset += this.noiseSpeed;

        const noiseValue = noise.simplex2(this.noiseOffset, 0);

        this.adjPos(
            getPixelInTime(this.vel.x, elapsedFrameTime),
            getPixelInTime(this.vel.y, elapsedFrameTime) + this.noiseAmplitude * noiseValue
        );

        if (this.isOffScreen()) {
            removeWorldObject(this);
            makeBubble();
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
