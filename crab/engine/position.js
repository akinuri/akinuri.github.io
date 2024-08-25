class Position {
    constructor(x = 0, y = 0) {
        this.set(x, y);
    }

    set(x, y) {
        if (typeof x == "object") {
            y = x.y;
            x = x.x;
        }
        this.x = x;
        this.y = y;
    }

    offset(pos, dir = 1) {
        return posOffset(this, pos, dir);
    }

    diff(pos) {
        return posDiff(this, pos);
    }

    dist(pos) {
        return posDist(this, pos);
    }
}
