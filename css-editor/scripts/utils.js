String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

RegExp.global = function (re) {
    var pattern	= re.source;
    var flags	= re.global ? re.flags : re.flags += "g";
    return new RegExp(pattern, flags);
};

String.prototype.matches = function (regex) {
    var results = [];
    var match	= null;
    var regex	= RegExp.global(regex);
    while (match = regex.exec(this)) {
        var result = {
            match  : match.shift(),
            index  : match.index,
            input  : match.input,
        };
        if (match.length > 1) {
            result.groups = [];
            match.forEach(function (g) {
                result.groups.push(g);
            });
        }
        results.push(result);
    }
    return results;
};