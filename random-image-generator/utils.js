class Utils {

    static canvas(width = 100, height = 100, fill = "white") {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        Utils.fill(context, fill);
        return canvas;
    }

    static fill(canvasOrContext, color) {
        let context = Utils.getContext(canvasOrContext);
        context.save();
        context.fillStyle = color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();
    }

    static toData(canvasOrContext, { type = "image/png", quality = 1, asRaw = false } = {}) {
        let context = Utils.getContext(canvasOrContext);
        let base64 = context.canvas.toDataURL(type, quality);
        if (asRaw) {
            base64 = base64.split(';base64,')[1];
        }
        return base64;
    }

    static getContext(canvasOrContext) {
        return canvasOrContext instanceof HTMLCanvasElement
            ? canvasOrContext.getContext("2d")
            : canvasOrContext;
    }

    static drawChar(canvasOrContext, char, contextOptions = {}) {
        let context = Utils.getContext(canvasOrContext);
        context.save();
        for (const key in contextOptions) {
            context[key] = contextOptions[key];
        }
        let fontSize = contextOptions.font?.match(/\d+/)?.[0] || 50;
        let xMin = 0;
        let xMax = context.canvas.width - fontSize;
        let yMin = fontSize;
        let yMax = context.canvas.height;
        context.fillText(char, Random.int(xMin, xMax), Random.int(yMin, yMax));
        context.restore();
    }

}