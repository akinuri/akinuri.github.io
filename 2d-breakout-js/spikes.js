class Spikes {
    
    constructor(x, y, width, height, spikePathEnd, fillStyle) {
        this.init(...arguments);
    }
    
    init(x, y, width, height, spikePathEnd, fillStyle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spikePathEnd = spikePathEnd;
        this.fillStyle = fillStyle || "hsl(0, 0%, 50%)";
    }
    
    draw() {
        ctx.save();
        let currentPos = this.x;
        while (currentPos < this.spikePathEnd) {
            this.drawTriangle(
                currentPos,
                this.y,
                this.width,
                this.height,
                this.fillStyle,
            );
            currentPos += this.width;
        }
        ctx.restore();
    }
    
    drawTriangle(x, y, width, height, fillStyle) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + (width / 2), y - height);
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    
}