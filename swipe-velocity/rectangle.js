class Rectangle {

    el = null;

    constructor(el) {
        this.el = el;
    }

    center(circle) {
        circle.moveTo(
            this.el.clientWidth / 2 - circle.radius,
            this.el.clientHeight / 2 - circle.radius,
        );
    }

}