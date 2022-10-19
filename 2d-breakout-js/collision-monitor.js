let CollisionMonitor = {
    
    doesBallTouchVerticalWalls : function (ball, canvas) {
        let touchesLeftWall  = ball.x - ball.radius < 0;
        let touchesRightWall = ball.x + ball.radius > canvas.width - ball.radius;
        return touchesLeftWall || touchesRightWall;
    },
    
    doesBallTouchTopWall : function (ball, canvas) {
        return ball.y - ball.radius <= 0;
    },
    
    doesBallTouchBottomWall : function (ball, canvas) {
        return ball.y >= canvas.height - ball.radius;
    },
    
    doesBallTouchPaddle : function (ball, paddle) {
        return ball.x > paddle.x
            && ball.x < paddle.x + paddle.width
            && ball.y + ball.radius > paddle.y;
    },
    
    doesPaddleTouchLeftWall : function (paddle, canvas) {
        return paddle.x < 0;
    },
    
    doesPaddleTouchRightWall : function (paddle, canvas) {
        return paddle.x + paddle.width > canvas.width;
    },
    
    doesBallTouchBrick : function (ball, brick) {
        return ball.x > brick.x
            && ball.x < brick.x + brick.width
            && ball.y > brick.y
            && ball.y < brick.y + brick.height;
    },
    
    doesBallTouchAnyBrick : function (ball, bricks, filterCallback) {
        for (let colIndex = 0; colIndex < bricks.columnCount; colIndex++) {
            for (let rowIndex = 0; rowIndex < bricks.rowCount; rowIndex++) {
                const brick = bricks.bricks[colIndex][rowIndex];
                let isBrickValid = true;
                if (filterCallback) {
                    isBrickValid = filterCallback(brick);
                }
                if (
                    isBrickValid
                    && this.doesBallTouchBrick(ball, brick)
                ) {
                    return brick;
                }
            }
        }
        return null;
    },
    
    constrainPaddleMovementToCanvas : function (paddle, canvas) {
        if (this.doesPaddleTouchLeftWall(paddle, canvas)) {
            paddle.x = 0;
        }
        else if (this.doesPaddleTouchRightWall(paddle, canvas)) {
            paddle.x = canvas.width - paddle.width;
        }
    },
    
};