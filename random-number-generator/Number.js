Number.isInteger = function isInteger(value, isString) {
    if (typeof value === "string" && isString) {
        if (value.match(/^[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?$/)) {
            return Number.isInteger(parseFloat(value, 10));
        }
    }
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

Number.isFloat = function isFloat(value, isString) {
    if (typeof value === "string" && isString) {
        if (value.match(/^[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?$/)) {
            return Number.isFloat(parseFloat(value));
        }
    }
    return typeof value === "number" && isFinite(value) && value % 1 !== 0;
};

Number.isNumeric = function isNumeric(value, isString) {
    if (typeof value === "string" && isString) {
        return Number.isInteger(value, true) || Number.isFloat(value, true);
    }
    return Number.isInteger(value) || Number.isFloat(value);
};

Number.prototype.getDecimal = function getDecimal() {
    return parseInt(this, 10);
};

Number.prototype.getFraction = function getFraction() {
    var value = parseFloat(this);
    if (Number.isFloat(value)) {
        var decimal  = value.getDecimal();
        var fraction = value - decimal;
        var length   = value.toString().split(".")[1].length;
        return fraction.toPrecision(length);
    }
    return 0;
};

Number.prototype.getPrecision = function getPrecision(length) {
    var value = parseFloat(this);
    if (Number.isFloat(value)) {
        return value.toString().split(".")[1].length;
    }
    return 0;
};

Number.prototype.toPrecision = function toPrecision(length) {
    return parseFloat(this.toFixed(length));
};