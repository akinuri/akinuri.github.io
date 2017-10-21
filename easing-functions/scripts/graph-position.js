var ctxPos = document.getElementById("graph-position").getContext("2d");

ctxPos.size        = 150;
ctxPos.paddingTop  = ctxPos.size / 2.5;
ctxPos.paddingLeft = 30;

ctxPos.canvas.width = ctxPos.size + 2 * ctxPos.paddingLeft;
ctxPos.canvas.height = ctxPos.size + 2 * ctxPos.paddingTop;

function drawPosGraph() {
    ctxPos.resetTransform();
    ctxPos.clearRect(0, 0, ctxPos.canvas.width, ctxPos.canvas.height);
    
    ctxPos.strokeStyle = "black";
    
    ctxPos.beginPath();
    ctxPos.moveTo(ctxPos.paddingLeft + 0.5, ctxPos.paddingTop + 0.5);
    ctxPos.lineTo(ctxPos.paddingLeft + 0.5, ctxPos.paddingTop + ctxPos.size + 0.5);
    ctxPos.lineTo(ctxPos.paddingLeft + ctxPos.size + 0.5, ctxPos.paddingTop + ctxPos.size + 0.5);
    ctxPos.stroke();
    
    ctxPos.save();
    ctxPos.translate(ctxPos.paddingLeft * .7, ctxPos.paddingTop * 1.45);
    ctxPos.rotate(-90 * Math.PI / 180);
    ctxPos.font = "12px sans-serif";
    ctxPos.fillText('position', 0, 0);
    ctxPos.restore();
    
    ctxPos.save();
    ctxPos.translate((ctxPos.paddingLeft + ctxPos.size) * 1.01, (ctxPos.paddingTop + ctxPos.size) * 1.08);
    ctxPos.font = "12px sans-serif";
    ctxPos.fillText('time', 0, 0);
    ctxPos.restore();
    
    ctxPos.strokeStyle = "red";
    ctxPos.translate(ctxPos.paddingLeft, ctxPos.paddingTop);
    ctxPos.beginPath();
}

drawPosGraph();
