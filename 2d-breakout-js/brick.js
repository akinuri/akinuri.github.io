class Brick {
    
    constructor(x, y, width, height, isIntact, fillStyle) {
        this.init(...arguments);
    }
    
    init(x, y, width, height, isIntact, fillStyle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isIntact = isIntact;
        this.fillStyle = fillStyle || "hsl(120, 60%, 50%)";
    }
    
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "hsl(0, 60%, 50%)";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    
}