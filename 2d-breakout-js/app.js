class App {
    
    constructor(fps=60, callback) {
        this.init(...arguments);
    }
    
    init(fps=60, callback) {
        this.fps = fps;
        this.fpsInterval = 1000 / this.fps;
        this.lastFrameTime = Date.now();
        this.frameRequestHandle = null;
        this.callback = callback;
    }
    
    main(ignoreTime=false) {
        let currentFrameTime = Date.now();
        let elapsedFrameTime = currentFrameTime - this.lastFrameTime;
        let shouldContinue = true;
        if (ignoreTime || elapsedFrameTime > this.fpsInterval) {
            this.lastFrameTime = currentFrameTime - (elapsedFrameTime % this.fpsInterval);
            if (this.callback) {
                shouldContinue = this.callback(elapsedFrameTime);
                if (shouldContinue == undefined) {
                    shouldContinue = true;
                }
            }
        }
        if (shouldContinue) {
            this.frameRequestHandle = requestAnimationFrame(this.main.bind(this));
        }
    }
    
}