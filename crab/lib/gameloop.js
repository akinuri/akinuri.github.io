class GameLoop {
    constructor(callback) {
        this.init(...arguments);
    }

    init(callback) {
        this.lastFrameTime = performance.now();
        this.frameRequestHandle = null;
        this.callback = callback;
        this.frameCounter = new TimeFrequencyCounter();
    }

    tick() {
        let currentFrameTime = performance.now();
        this.elapsedFrameTime = currentFrameTime - this.lastFrameTime;
        this.lastFrameTime = currentFrameTime;
        this.callback(this.elapsedFrameTime);
        this.frameCounter.count();
        this.fps = this.frameCounter.getSize();
        this.frameRequestHandle = requestAnimationFrame(this.tick.bind(this));
    }
}
