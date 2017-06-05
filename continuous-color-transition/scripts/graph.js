document.getElementById("playPause").onclick = function() {
    switch (this.value) {
        case "Pause":
            clearInterval(transHandler);
            this.value = "Play";
            break;
        case "Play":
            transHandler = setInterval(function() {
                transition();
            }, 1000/fps);
            this.value = "Pause";
        break;
    }
};

function calculateDistance(color1, color2) {
    var colorArray1 = Object.values(color1);
    var colorArray2 = Object.values(color2);
    var distance = [];
    for (var i = 0; i < colorArray1.length; i++) {
        distance.push(Math.abs(colorArray1[i] - colorArray2[i]));
    }
    return distance;
}

var graph = {
    container 	: document.getElementById("graph-container"),
    table 	    : document.getElementById("graph"),
    stats 	    : document.getElementById("stats").tBodies[0],
    fills	    : document.getElementsByClassName("fill"),
    targets	    : document.getElementsByClassName("target-color-line"),
    
    getCells    : function() {
        graph.cells = {
            currentColor : document.getElementsByClassName("current-color"),
            prevColor	 : [],
            nextColor	 : [],
            distance	 : [],
            increment	 : [],
        };
        for (var j = 1; j < 4; j++) {
            graph.cells.prevColor.push( graph.stats.rows[0].cells[j] );
            graph.cells.nextColor.push( graph.stats.rows[1].cells[j] );
            graph.cells.distance.push(  graph.stats.rows[2].cells[j] );
            graph.cells.increment.push( graph.stats.rows[3].cells[j] );
        }
    },
    update : {
        stats : function() {
            for (var i = 0; i < 3; i++) {
                graph.cells.currentColor[i].innerHTML = Object.values(currentColor)[i];
                graph.cells.prevColor[i].innerHTML	  = Object.values(currentColor)[i];
                graph.cells.nextColor[i].innerHTML	  = Object.values(targetColor)[i];
                graph.cells.distance[i].innerHTML	  = Object.values(transDist)[i];
                graph.cells.increment[i].innerHTML	  = Object.values(increment)[i];
            }
        },
        targetLines : function() {
            var color = Object.values(targetColor);
            for (var i = 0; i < graph.targets.length; i++) {
                var percent = Math.floor(color[i] / 255 * 100);
                graph.targets[i].style.height = percent + "px";
            }
        },
        currentColor : function() {
            var color = Object.values(currentColor);
            for (var i = 0; i < color.length; i++) {
                graph.cells.currentColor[i].innerHTML = color[i];
            }
        },
        fills : function() {
            var color = Object.values(currentColor);
            for (var i = 0; i < graph.fills.length; i++) {
                var percent = Math.floor(color[i] / 255 * 100);
                graph.fills[i].style.height = percent + "px";
            }
        }
    }
};
graph.getCells();