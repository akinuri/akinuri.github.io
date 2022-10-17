class Paddle {
    
    constructor(width, height, x, bottomMargin, speed, dir, fillStyle) {
        this.init(...arguments);
    }
    
    init(width, height, x, bottomMargin, speed, dir, fillStyle) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.bottomMargin = bottomMargin;
        this.speed = speed;
        this.dir = dir || 0;
        this.fillStyle = fillStyle || "hsl(210, 60%, 50%)";
    }
    
    move(elapsedFrameTime) {
        this.x += getPixelInTime(this.speed * this.dir, elapsedFrameTime);
    }
    
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.rect(
            this.x,
            canvas.height - this.height - this.bottomMargin,
            this.width,
            this.height,
        );
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
        ctx.restore();
    }
    
}