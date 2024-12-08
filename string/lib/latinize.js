(function () {
    /**
     * @see https://en.wikipedia.org/wiki/Transliteration
     * @see https://en.wikipedia.org/wiki/Romanization
     * @see https://stackoverflow.com/a/34867642/2202732
     */

    let LATINIZATION_MAP = {
        a: "à á â ã ä å æ",
        c: "ç",
        d: "ð",
        e: "è é ê ë",
        g: "ğ",
        i: "ì í î ï i̇ ı",
        m: "μ",
        n: "ñ",
        o: "ò ó ô õ ö ø",
        oe: "œ",
        s: "ş",
        sh: "š",
        th: "þ",
        u: "ù ú û ü",
        y: "ý ÿ",

        A: "À Á Â Ä Å Æ Ã Ā",
        C: "Ç",
        D: "Ð",
        E: "È É Ê Ë",
        G: "Ğ",
        I: "Ì Í Î Ï İ",
        N: "Ñ",
        O: "Ò Ó Ô Õ Ö Ø",
        OE: "Œ",
        S: "ß Ş",
        SH: "Š",
        TH: "Þ",
        U: "Ù Ú Û Ü",
        Y: "Ý Ÿ",
    };

    LATINIZATION_MAP = regexifyLatinizationMap(LATINIZATION_MAP);

    function regexifyLatinizationMap(letterMap) {
        let result = {};
        for (let targetChar in letterMap) {
            let cases = letterMap[targetChar];
            cases = cases.replaceAll(" ", "|");
            cases = new RegExp(cases, "g");
            result[targetChar] = cases;
        }
        return result;
    }

    function latinize(text) {
        for (let targetChar in LATINIZATION_MAP) {
            let cases = LATINIZATION_MAP[targetChar];
            text = text.replaceAll(cases, targetChar);
        }
        return text;
    }

    window.latinize = latinize;
    // window.LATINIZATION_MAP = LATINIZATION_MAP;
})(window);
