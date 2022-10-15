class Paddle {
    
    constructor(width, height, bottomMargin, speed, fillStyle) {
        this.init(...arguments);
    }
    
    init(width, height, x, bottomMargin, speed, fillStyle) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.bottomMargin = bottomMargin;
        this.speed = speed;
        this.fillStyle = fillStyle || "hsl(210, 60%, 50%)";
    }
    
    move(elapsedFrameTime) {
        // FIXME: unlike ball, paddle is still using ppf instead of pps
        this.x += getPixelInTime(this.speed, elapsedFrameTime);
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
        ctx.closePath();
        ctx.restore();
    }
    
}