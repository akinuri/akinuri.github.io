function random(a, b) {
    switch (arguments.length) {
        case 1:
            if (Number.isNumeric(a)) {
                var max = a;
                if (Number.isFloat(max)) {
                    return (Math.random() * max).toPrecision(max.getPrecision());
                }
                return Math.round(Math.random() * max);
            }
            break;
        case 2:
            if (Number.isNumeric(a) && Number.isNumeric(b)) {
                var min  = Math.min(a, b),
                    max  = Math.max(a, b),
                    dist = max - min;
                if (Number.isFloat(min) || Number.isFloat(max)) {
                    var length = Math.max(min.getPrecision(), max.getPrecision());
                    return (Math.random() * dist + min).toPrecision(length);
                }
                return Math.round(min + Math.random() * (max - min));
            }
            break;
    }
    return Math.random();
}

Array.prototype.random = function fillWithRandomNumbers(a, b, c, d) {
    var array = [];
    switch (arguments.length) {
        case 1:
            if (Number.isInteger(a)) {
                var count = a;
                for (var i = 0; i < count; i++) {
                    array.push(random());
                }
            }
            break;
        case 2:
            if (Number.isInteger(a)) {
                var count = a, unique, max;
                if (Number.isNumeric(b)) {
                    max = b;
                    for (var i = 0; i < count; i++) {
                        array.push(random(max));
                    }
                }
                else if (typeof b == "boolean") {
                    unique = b;
                    for (var i = 0; i < count; i++) {
                        var rand = random();
                        if (unique) {
                            while (array.includes(rand)) {
                                rand = random();
                            }
                        }
                        array.push(rand);
                    }
                }
            }
            break;
        case 3:
            if (Number.isInteger(a)) {
                var count = a, min, max, dist, unique;
                if (Number.isNumeric(b) && Number.isNumeric(c)) {
                    min  = b;
                    max  = c;
                    for (var i = 0; i < count; i++) {
                        array.push(random(min, max));
                    }
                }
                else if (Number.isNumeric(b) && typeof c == "boolean") {
                    min     = 0,
                    max     = b,
                    dist    = (max - min) + 1;
                    unique  = c;
                    if (unique && dist < count) {
                        console.warn("Cannot generate " + count + " unique numbers between " + min + " and " + max + ".");
                        break;
                    }
                    for (var i = 0; i < count; i++) {
                        var rand = random(min, max);
                        if (unique) {
                            while (array.includes(rand)) {
                                rand = random(min, max);
                            }
                        }
                        array.push(rand);
                    }
                }
            }
            break;
        case 4:
            if (Number.isInteger(a) && Number.isNumeric(b) && Number.isNumeric(c) && typeof d == "boolean") {
                var count   = a,
                    min     = Math.min(b, c),
                    max     = Math.max(b, c),
                    dist    = (max - min) + 1,
                    unique  = d;
                if (unique && dist < count) {
                    console.warn("Cannot generate " + count + " unique numbers between " + min + " and " + max + ".");
                    break;
                }
                for (var i = 0; i < count; i++) {
                    var rand = random(min, max);
                    if (unique) {
                        while (array.includes(rand)) {
                            rand = random(min, max);
                        }
                    }
                    array.push(rand);
                }
            }
            break;
    }
    return array;
};

Array.prototype.random2d = function random2d(a, b, c, d, e) {
    var array = [];
    switch (arguments.length) {
        case 2:
            if (Number.isInteger(a) && Number.isInteger(b)) {
                var rows = a,
                    cols = b;
                for (var i = 0; i < rows; i++) {
                    array.push([].random(cols).sortNumeric());
                }
            }
            break;
        case 3:
            if (Number.isInteger(a) && Number.isInteger(b)) {
                var rows = a,
                    cols = b,
                    max, unique;
                if (Number.isNumeric(c)) {
                    max = c;
                    for (var i = 0; i < rows; i++) {
                        array.push([].random(cols, max).sortNumeric());
                    }
                }
                else if (typeof c === "boolean" && c) {
                    unique = c;
                    for (var i = 0; i < rows; i++) {
                        array.push([].random(cols, unique).sortNumeric());
                    }
                }
            }
            break;
        case 4:
            if (Number.isInteger(a) && Number.isInteger(b)) {
                var rows = a,
                    cols = b,
                    max, unique;
                if (Number.isNumeric(c) && Number.isNumeric(d)) {
                    min = Math.min(c, d);
                    max = Math.max(c, d);
                    for (var i = 0; i < rows; i++) {
                        array.push([].random(cols, min, max).sortNumeric());
                    }
                }
                else if (Number.isNumeric(c) && typeof d === "boolean") {
                    max = c;
                    unique = d;
                    for (var i = 0; i < rows; i++) {
                        array.push([].random(cols, max, unique).sortNumeric());
                    }
                }
            }
            break;
        case 5:
            if (Number.isInteger(a) && Number.isInteger(b) && Number.isNumeric(c) && Number.isNumeric(d) && typeof e === "boolean") {
                var rows = a,
                    cols = b,
                    min  = Math.min(c, d),
                    max  = Math.max(c, d),
                    unique = e;
                for (var i = 0; i < rows; i++) {
                    array.push([].random(cols, min, max, unique).sortNumeric());
                }
            }
            break;
    }
    return array;
};

Array.prototype.sortNumeric = function sortNumericallyAscending() {
    return this.sort(function (a, b) {
        return a - b;
    });
};