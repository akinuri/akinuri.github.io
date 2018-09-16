var stopwatch = {
    
    buttons : {
        start  : document.querySelector("#startWatch"),
        stop   : document.querySelector("#stopWatch"),
        addLap : document.querySelector("#addLap"),
        resume : document.querySelector("#resumeWatch"),
        save   : document.querySelector("#saveLaps"),
        reset  : document.querySelector("#resetWatch"),
    },
    
    buttonFields : {
        start  : document.querySelector("#start"),
        stop   : document.querySelector("#stop"),
        resume : document.querySelector("#resume"),
        showStart : function () {
            stopwatch.buttonFields.start.removeAttribute("hidden");
            stopwatch.buttonFields.stop.setAttribute("hidden", "");
            stopwatch.buttonFields.resume.setAttribute("hidden", "");
        },
        showStop : function () {
            stopwatch.buttonFields.start.setAttribute("hidden", "");
            stopwatch.buttonFields.stop.removeAttribute("hidden");
            stopwatch.buttonFields.resume.setAttribute("hidden", "");
        },
        showResume : function () {
            stopwatch.buttonFields.start.setAttribute("hidden", "");
            stopwatch.buttonFields.stop.setAttribute("hidden", "");
            stopwatch.buttonFields.resume.removeAttribute("hidden");
        },
    },
    
    screens : {
        current     : document.querySelector("#currentTime"),
        lastElapsed : document.querySelector("#lastElapsed"),
        laps        : document.querySelector("#laps table"),
        lapsBox     : document.querySelector("#laps"),
    },
    
    settings : {
        interval : null,
        delay    : 1,
        started  : 0,
        elapsed  : 0,
        state    : "idle", // idle, ticking, stopped
        // offset   : 0,
    },
    
    laps : [],
    
    render : {
        
        currentTime : function () {
            var dur = new Duration(stopwatch.settings.elapsed);
            stopwatch.screens.current.innerText = dur.toString();
        },
        
        lastElapsed : function () {
            var last = null;
            if (stopwatch.laps.length) {
                last = stopwatch.laps[stopwatch.laps.length - 1];
            }
            if (last) {
                var elapsed = stopwatch.settings.elapsed - last[0];
                var dur = new Duration(elapsed);
                stopwatch.screens.lastElapsed.innerText = dur.toString();
            } else {
                var dur = new Duration(stopwatch.settings.elapsed);
                stopwatch.screens.lastElapsed.innerText = dur.toString();
            }
        },
        
        lap : function () {
            var index   = stopwatch.laps.length;
            var lastLap = stopwatch.laps[index - 1];
            var added   = new Duration(lastLap[0]);
            var elapsed = new Duration(lastLap[1]);
            var row = elem("tr", null, [
                elem("td", {"class":"lap-index"}, index.toString().padStart(2, "0")),
                elem("td", {"class":"lap-ts"}, added.toString()),
                elem("td", {"class":"lap-diff"}, elapsed.toString()),
            ]);
            stopwatch.screens.laps.appendChild(row);
            stopwatch.screens.lapsBox.scrollTop = stopwatch.screens.lapsBox.scrollHeight;
        },
        
    },
    
    // https://stackoverflow.com/questions/20318822/how-to-create-a-stopwatch-using-javascript
    tick : function tick() {
        var now = Date.now();
        var diff = now - stopwatch.settings.started;
        // stopwatch.started += now;
        stopwatch.settings.elapsed = diff;
    },
    
    update : function update() {
        stopwatch.tick();
        stopwatch.render.currentTime();
        stopwatch.render.lastElapsed();
    },
    
    start : function startWatch() {
        if (stopwatch.settings.state == "idle") {
            stopwatch.settings.started = Date.now();
            stopwatch.settings.interval = setInterval(stopwatch.update, stopwatch.settings.delay);
            stopwatch.settings.state = "ticking";
            stopwatch.buttonFields.showStop();
        }
    },
    stop : function stopWatch() {
        if (stopwatch.settings.state == "ticking") {
            clearInterval(stopwatch.settings.interval);
            stopwatch.settings.state = "stopped";
            stopwatch.buttonFields.showResume();
        }
    },
    calcLapTime : function calcLapTime() {
        var last = null;
        if (stopwatch.laps.length) {
            last = stopwatch.laps[stopwatch.laps.length - 1];
        }
        if (last) {
            var elapsed = stopwatch.settings.elapsed - last[0];
            stopwatch.laps.push([stopwatch.settings.elapsed, elapsed]);
        } else {
            stopwatch.laps.push([stopwatch.settings.elapsed, stopwatch.settings.elapsed]);
        }
    },
    addLap : function addLap() {
        if (stopwatch.settings.state == "ticking") {
            stopwatch.calcLapTime();
            stopwatch.render.lap();
        }
    },
    resume : function resumeWatch() {
        if (stopwatch.settings.state == "stopped") {
            var now = Date.now();
            var offset = now - (stopwatch.settings.started + stopwatch.settings.elapsed);
            stopwatch.settings.started += offset;
            stopwatch.settings.interval = setInterval(stopwatch.update, stopwatch.settings.delay);
            stopwatch.settings.state = "ticking";
            stopwatch.buttonFields.showStop();
        }
    },
    save : function saveLaps() {
        if (stopwatch.settings.state == "stopped") {
            var data = [];
            Array.from(stopwatch.screens.laps.children).forEach(function (row) {
                data.push([row.children[0].innerText, row.children[1].innerText, row.children[2].innerText]);
            });
            var csv = "";
            data.forEach(function (lap) {
                csv += lap.join(",") + "\r\n";
            });
            downloadCSV(csv);
        }
    },
    reset : function resetWatch() {
        if (stopwatch.settings.state == "stopped") {
            if (confirm("Are you sure you want to reset the watch?")) {
                clearInterval(stopwatch.settings.interval);
                stopwatch.settings.interval = null;
                stopwatch.settings.started = 0;
                stopwatch.settings.elapsed = 0;
                stopwatch.laps             = [];
                stopwatch.settings.state   = "idle";
                stopwatch.render.currentTime();
                stopwatch.render.lastElapsed();
                stopwatch.screens.laps.innerHTML = "";
                stopwatch.buttonFields.showStart();
            }
        }
    },
};
    
stopwatch.buttons.start.addEventListener("click", stopwatch.start);
stopwatch.buttons.stop.addEventListener("click", stopwatch.stop);
stopwatch.buttons.addLap.addEventListener("click", stopwatch.addLap);
stopwatch.buttons.resume.addEventListener("click", stopwatch.resume);
stopwatch.buttons.save.addEventListener("click", stopwatch.save);
stopwatch.buttons.reset.addEventListener("click", stopwatch.reset);