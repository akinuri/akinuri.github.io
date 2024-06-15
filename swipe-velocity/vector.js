class Vector {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    normalize() {
        const mag = this.getMagnitude();
        if (mag != 0) this.divide(mag);
        return this;
    }

    getMagnitude() {
        return getMagnitude(this.x, this.y);
    }

    setMagnitude(value) {
        return this.normalize().multiply(value);
    }

    getAngle(yDir = 1) {
        return angleFromCoords(this.x, this.y * yDir);
    }

    setAngle(value) {
        let { x, y } = coordsFromVector(deg2rad(value), this.getMagnitude());
        this.x = x;
        this.y = y;
        return this;
    }

    static dot(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    static createCopy(vector) {
        return new Vector(vector.x, vector.y);
    }

    static createFromAngle(angle, magnitude) {
        let { x, y } = coordsFromVector(angle, magnitude);
        return new Vector(x, y);
    }

}