class Lobster extends WorldObject {
    constructor() {
        let img = el(`<img src="assets/lobster.png" />`)[0];
        applyStyle(img, {
            position: "absolute",
            width: "120px",
            opacity: "0.9",
            scale: "-1 1",
        });
        super(img, 120, 120 * (556 / 780));
    }
}
