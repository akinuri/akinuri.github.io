class Bubble extends WorldObject {
    driftNoise = {
        offset: random(1000), // Arbitrary starting point
        offsetSpeed: 1 / 60, // Updates noise offset each frame; 60 for fps
        amplitude: 2,
    };

    constructor(size = 50, angle = 0, magnitude = 0) {
        let elem = el(`<div class="bubble"></div>`)[0];
        applyStyle(elem, {
            width: size + "px",
            height: size + "px",
        });
        super(elem, size, size);
        this.vel = Vector.createFromAngle(angle, magnitude);
    }

    update(elapsedFrameTime) {
        let mag = this.vel.getMagnitude();

        let noiseValue = 0;
        if (mag) {
            this.driftNoise.offset += this.driftNoise.offsetSpeed;
            noiseValue = noise.perlin2(this.driftNoise.offset, 0);
            noiseValue *= this.driftNoise.amplitude;
        }

        super.update(
            elapsedFrameTime,
            getPixelInTime(this.vel.x, elapsedFrameTime),
            getPixelInTime(this.vel.y, elapsedFrameTime) + noiseValue
        );

        if (this.isOffScreen()) {
            world.remove(this);
            spawnBubble();
        }
    }
}
