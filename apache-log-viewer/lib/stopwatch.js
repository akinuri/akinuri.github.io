class Stopwatch {

    #logs = {};
    #aggregates = {};

    /**
     * Starts an interval.
     */
    time(label = "default") {
        if (!this.#logs[label]) {
            this.#logs[label] = new StopwatchInterval(true);
        } else {
            console.error(`A timer with label "${label}" is already registered.`);
        }
    }

    /**
     * Ends an interval.
     */
    timeEnd(label = "default") {
        const interval = this.#logs[label];
        if (interval) {
            interval.end();
        } else {
            console.error(`No timer registered for label: ${label}`);
        }
    }

    /**
     * Ends an interval and collects intervals with the same label.
     */
    timeAggregate(label = "default") {
        const interval = this.#logs[label];
        if (interval) {
            interval.end();
            if (!this.#aggregates[label]) {
                this.#aggregates[label] = [];
            }
            this.#aggregates[label].push(interval);
            delete this.#logs[label];
        } else {
            console.error(`No timer registered for label: ${label}`);
        }
    }

    getLogs() {
        return this.#logs;
    }

    getDurations() {
        let durations = {};
        for (const label in this.#logs) {
            if (Object.hasOwnProperty.call(this.#logs, label)) {
                const interval = this.#logs[label];
                durations[label] = interval.getDuration();
            }
        }
        return durations;
    }

    getAggregateDurations() {
        let durations = {};
        for (const label in this.#aggregates) {
            if (Object.hasOwnProperty.call(this.#aggregates, label)) {
                const intervals = this.#aggregates[label];
                let durs = intervals.map(_int => _int.getDuration());
                let dur = sum(durs);
                durations[label] = dur;
            }
        }
        return durations;
    }

}

class StopwatchInterval {

    startTime = null;
    endTime = null;

    constructor(startTime, endTime) {
        if (startTime) {
            if (startTime === true) {
                this.start();
            } else {
                this.startTime = startTime;
            }
        }
        if (endTime) {
            this.endTime = endTime;
        }
    }

    start() {
        if (this.isIdle()) {
            this.startTime = performance.now();
        }
    }

    end() {
        if (this.isTicking()) {
            this.endTime = performance.now();
        }
    }

    isIdle() {
        return this.startTime === null && this.endTime === null;
    }

    isTicking() {
        return this.startTime !== null && this.endTime === null;
    }

    isComplete() {
        return this.startTime !== null && this.endTime !== null;
    }

    getDuration() {
        if (!this.isComplete()) {
            return null;
        }
        return this.endTime - this.startTime;
    }

}
