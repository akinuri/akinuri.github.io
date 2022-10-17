class Ball {
    
    constructor(radius, x, y, xSpeed, ySpeed, fillStyle) {
        this.init(...arguments);
    }
    
    init(radius, x, y, xSpeed, ySpeed, fillStyle) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.fillStyle = fillStyle || "hsl(120, 60%, 50%)";
    }
    
    move(elapsedFrameTime) {
        this.x += getPixelInTime(this.xSpeed, elapsedFrameTime);
        this.y += getPixelInTime(this.ySpeed, elapsedFrameTime);
    }
    
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
        ctx.restore();
    }
    
}