let stats = {
    fps: qs("#fps"),
    pos: {
        x: qs("#posX"),
        y: qs("#posY"),
    },
    dragVel: {
        mag: qs("#dragVelMag"),
        ang: qs("#dragVelAng"),
        angIcon: qs("svg", qs("#dragVelAng").nextElementSibling),
    },
    inVel: {
        mag: qs("#inVelMag"),
        ang: qs("#inVelAng"),
        angIcon: qs("svg", qs("#inVelAng").nextElementSibling),
    },
    updateDrag: function (shape, vel, moveTimes) {
        let fps = 0;
        if (moveTimes) {
            fps = 1000 / Math.avg(moveTimes.getItems());
        }
        stats.fps.textContent = (fps).toFixed(0);
        stats.pos.x.textContent = (shape.getCenterPos().x).toFixed(0);
        stats.pos.y.textContent = (shape.getCenterPos().y).toFixed(0);
        stats.dragVel.mag.textContent = vel.getMagnitude().toFixed(1);
        stats.dragVel.ang.textContent = vel.getAngle(-1).toFixed(1) + "°";
        stats.dragVel.angIcon.style.setProperty("--rotate", vel.getAngle(-1) + "deg");
    },
    updateInertia: function (shape, vel, frameTimes) {
        let fps = 0;
        if (frameTimes) {
            fps = 1000 / (Math.avg(frameTimes.getItems()) * 1000);
        }
        stats.fps.textContent = (fps).toFixed(0);
        stats.pos.x.textContent = (shape.getCenterPos().x).toFixed(0);
        stats.pos.y.textContent = (shape.getCenterPos().y).toFixed(0);
        stats.inVel.mag.textContent = vel.getMagnitude().toFixed(1);
        stats.inVel.ang.textContent = vel.getAngle(-1).toFixed(1) + "°";
        stats.inVel.angIcon.style.setProperty("--rotate", vel.getAngle(-1) + "deg");
    },
};
