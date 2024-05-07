class Stopwatch {
    
    #intervals = {};
    
    time(label = "default") {
        if (!this.#intervals[label]) {
            this.#intervals[label] = {
                startTime: performance.now(),
                endTime: null,
                duration : null,
            };
        } else {
            console.error(`A timer with label "${label}" is already running.`);
        }
    }
    
    timeEnd(label = "default") {
        const interval = this.#intervals[label];
        if (interval) {
            interval.endTime = performance.now();
            interval.duration = interval.endTime - interval.startTime;
        } else {
            console.error(`No timer started for label: ${label}`);
        }
    }
    
    getResult() {
        return this.#intervals;
    }
    
}