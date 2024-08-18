class TimeFrequencyCounter {
    #timestamps = [];

    constructor(timeSpan = 1000) {
        this.timeSpan = timeSpan;
    }

    count() {
        let newTimestamp = performance.now();
        let sliceIndex = null;
        for (let index = 0; index < this.#timestamps.length; index++) {
            const thenTimestamp = this.#timestamps[index];
            let diff = newTimestamp - thenTimestamp;
            if (diff <= this.timeSpan) {
                sliceIndex = index;
                break;
            }
        }
        if (sliceIndex) {
            this.#timestamps = this.#timestamps.slice(sliceIndex);
        }
        this.#timestamps.push(newTimestamp);
    }

    getSize = () => this.#timestamps.length;
}
