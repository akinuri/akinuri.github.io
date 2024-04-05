class Random {

    static pick(list, count = 1) {
        let picks = [];
        for (let i = 0; i < count; i++) {
            let randomIndex = Math.round(Math.random() * (list.length - 1));
            picks.push(list[randomIndex]);
        }
        if (count == 1) {
            picks = picks[0];
        }
        return picks;
    }

    static color() {
        return "#" + Random.pick("0123456789ABCDEF", 6).join("");
    }

    static letter(alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
        return Random.pick(alphabet);
    }

    static int(min = 0, max = Number.MAX_SAFE_INTEGER) {
        if (arguments.length === 1) {
            max = min;
            min = 0;
        }
        min = Math.ceil(Math.max(Number.MIN_SAFE_INTEGER, min));
        max = Math.floor(Math.min(Number.MAX_SAFE_INTEGER, max));
        if (min > max) {
            throw new Error("'max' must be greater than or equal to 'min'.");
        }
        const int = Math.floor(Math.random() * (max - min + 1)) + min;
        return int;
    }

}