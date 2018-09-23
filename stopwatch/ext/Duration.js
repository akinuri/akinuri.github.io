function Duration(num) {
    this.ms = 0;
    this.s  = 0;
    this.m  = 0;
    this.h  = 0;
    this.d  = 0;
    this.parse(num);
}

Duration.constants = {
    ms : 1,
    s  : 1000,
    m  : 1000 * 60,
    h  : 1000 * 60 * 60,
    d  : 1000 * 60 * 60 * 24,
};

Duration.prototype.parse = function num2duration(num) {
    var remainder = num;
    
    if (remainder >= Duration.constants.d) {
        this.d = Math.floor(remainder / Duration.constants.d);
        remainder = remainder % Duration.constants.d;
    }
    
    if (remainder >= Duration.constants.h) {
        this.h = Math.floor(remainder / Duration.constants.h);
        remainder = remainder % Duration.constants.h;
    }
    
    if (remainder >= Duration.constants.m) {
        this.m = Math.floor(remainder / Duration.constants.m);
        remainder = remainder % Duration.constants.m;
    }
    
    if (remainder >= Duration.constants.s) {
        this.s = Math.floor(remainder / Duration.constants.s);
        remainder = remainder % Duration.constants.s;
    }
    
    this.ms = remainder;
};

Duration.prototype.toString = function () {
    return this.h.toString().padStart(2, "0") +":"+ this.m.toString().padStart(2, "0") +":"+ this.s.toString().padStart(2, "0") +"."+ this.ms.toString().padStart(3, "0");
};