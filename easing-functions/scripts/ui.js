$(".ease input").click(function () {
    if (!easing) {
        easing = true;
        
        var ease = this.parentElement.firstElementChild.innerText;
        var type = this.value;
        
        if (type == "linear") {
            method = type;
        } else {
            method = ease + type[0].toUpperCase() + type.slice(1);
        }
        
        $("#method").text(method);
        
        if (Math.round(realCar.left()) >= end-2) {
            
            ghostCar.reset();
            realCar.reset();
            
            start    = 0;
            distance = end - start;
            
            coorPos  = {
                x : tElapsed / duration * ctxPos.size,
                y : ctxPos.size - (realCar.left() - realCar.initial) / distance * ctxPos.size,
            };
            speed     = Math.abs(realCar.pos - realCar.left());
            maxSpeed  = distance / 20;
            coorSpeed = {
                x : tElapsed / duration * ctxSpeed.size,
                y : ctxSpeed.size - (speed / maxSpeed * ctxSpeed.size),
            };
        }
        
        
        drawPosGraph();
        drawSpeedGraph();
        
        setTimeout(move, 500);
    }
});

$(".car.real").draggable({
    axis        : 'x',
    containment : 'parent',
    start : function (event, ui) {
        realCar.initial = realCar.left();
    },
    drag : function (event, ui) {
        var shift      = ui.position.left - realCar.initial;
        var rotation   = shift / realCar.tires.circum * 360;
        realCar.tires.back.style.transform  = "rotate(" + rotation + "deg)";
        realCar.tires.front.style.transform = "rotate(" + rotation + "deg)";
        
        ghostCar.elem.style.left = ui.position.left + "px";
        ghostCar.tires.back.style.transform  = "rotate(" + rotation + "deg)";
        ghostCar.tires.front.style.transform = "rotate(" + rotation + "deg)";
    },
    stop : function (event, ui) {
        realCar.initial = realCar.left();
        start = ui.position.left;
        distance = end - start;
        coorPos  = {
            x : tElapsed / duration * ctxPos.size,
            y : ctxPos.size - (realCar.left() - realCar.initial) / distance * ctxPos.size,
        };
        speed     = Math.abs(realCar.pos - realCar.left());
        maxSpeed  = distance / 20;
        coorSpeed = {
            x : tElapsed / duration * ctxSpeed.size,
            y : ctxSpeed.size - (speed / maxSpeed * ctxSpeed.size),
        };
    },
});

$(window).resize(function () {
    duration = Math.round(window.innerWidth / 500);
    frames   = fps * duration;
    tick     = duration / frames;
    end      = $("#box").css("width").toInt() - realCar.width;
    distance = end - start;
});