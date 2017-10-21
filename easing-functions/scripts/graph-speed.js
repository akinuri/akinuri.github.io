var ctxSpeed = document.getElementById("graph-speed").getContext("2d");

ctxSpeed.size        = 150;
ctxSpeed.paddingTop  = ctxSpeed.size / 2.5;
ctxSpeed.paddingLeft = 30;

ctxSpeed.canvas.width = ctxSpeed.size + 2 * ctxSpeed.paddingLeft;
ctxSpeed.canvas.height = ctxSpeed.size + 2 * ctxSpeed.paddingTop;

function drawSpeedGraph() {
    ctxSpeed.resetTransform();
    ctxSpeed.clearRect(0, 0, ctxSpeed.canvas.width, ctxSpeed.canvas.height);
    
    ctxSpeed.strokeStyle = "black";
    
    ctxSpeed.beginPath();
    ctxSpeed.moveTo(ctxSpeed.paddingLeft + 0.5, ctxSpeed.paddingTop + 0.5);
    ctxSpeed.lineTo(ctxSpeed.paddingLeft + 0.5, ctxSpeed.paddingTop + ctxSpeed.size + 0.5);
    ctxSpeed.lineTo(ctxSpeed.paddingLeft + ctxSpeed.size + 0.5, ctxSpeed.paddingTop + ctxSpeed.size + 0.5);
    ctxSpeed.stroke();
    
    ctxSpeed.save();
    ctxSpeed.translate(ctxSpeed.paddingLeft * .7, ctxSpeed.paddingTop * 1.45);
    ctxSpeed.rotate(-90 * Math.PI / 180);
    ctxSpeed.font = "12px sans-serif";
    ctxSpeed.fillText('speed', 0, 0);
    ctxSpeed.restore();
    
    ctxSpeed.save();
    ctxSpeed.translate((ctxSpeed.paddingLeft + ctxSpeed.size) * 1.01, (ctxSpeed.paddingTop + ctxSpeed.size) * 1.08);
    ctxSpeed.font = "12px sans-serif";
    ctxSpeed.fillText('time', 0, 0);
    ctxSpeed.restore();
    
    ctxSpeed.strokeStyle = "red";
    ctxSpeed.translate(ctxSpeed.paddingLeft, ctxSpeed.paddingTop);
    ctxSpeed.beginPath();
}

drawSpeedGraph();