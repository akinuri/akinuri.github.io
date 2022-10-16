class Bricks {
    
    bricks = [];
    
    constructor(
        rowCount,
        columnCount,
        brickWidth,
        brickHeight,
        brickGap,
        x,
        y,
        fillStyle,
    ) {
        this.init(...arguments);
        this.build();
    }
    
    init(
        rowCount,
        columnCount,
        brickWidth,
        brickHeight,
        brickGap,
        x,
        y,
        fillStyle,
    ) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.brickWidth = brickWidth;
        this.brickHeight = brickHeight;
        this.brickGap = brickGap;
        this.x = x;
        this.y = y;
        this.fillStyle = fillStyle || "hsl(0, 60%, 50%)";
    }
    
    build() {
        this.bricks = [];
        for (let colIndex = 0; colIndex < this.columnCount; colIndex++) {
            this.bricks[colIndex] = [];
            for (let rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
                let brickX = (colIndex * (this.brickWidth + this.brickGap)) + this.x;
                let brickY = (rowIndex * (this.brickHeight +this.brickGap)) + this.y;
                this.bricks[colIndex][rowIndex] = new Brick(
                    brickX,
                    brickY,
                    this.brickWidth,
                    this.brickHeight,
                    true,
                );
            }
        }
    }
    
    draw() {
        ctx.save();
        for (let colIndex = 0; colIndex < this.columnCount; colIndex++) {
            for (let rowIndex = 0; rowIndex < this.rowCount; rowIndex++) {
                const brick = bricks.bricks[colIndex][rowIndex];
                if (brick.isIntact) {
                    this.bricks[colIndex][rowIndex].draw();
                }
            }
        }
        ctx.restore();
    }
    
}