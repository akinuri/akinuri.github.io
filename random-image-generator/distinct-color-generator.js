class DistinctColorGenerator {

    colors = [];
    minDistance = 44; // black-white: 441.67

    constructor(minDistance = 44) {
        this.minDistance = minDistance;
    }

    generate(minDistance = 44) {
        let rgbValues = [];
        let isDistinct = false;
        do {
            rgbValues = Random.rgbValues();
            let distances = this.colors.map(exRgb => DistinctColorGenerator.calcDistance(exRgb, rgbValues));
            isDistinct = distances.every(distance => distance > minDistance);
        } while (!isDistinct)
        this.colors.push(rgbValues);
        return Random.rgbColor(rgbValues);
    }

    generateMultiple(minCount = 1, maxCount = 5, minDistance = 44) {
        let colors = [];
        let count = Random.int(minCount, maxCount);
        for (let i = 0; i < count; i++) {
            colors.push(this.generate(minDistance));
        }
        return colors;
    }

    reset() {
        this.colors = [];
    }

    static calcDistance(rgbValues1, rgbValues2) {
        const [r1, g1, b1] = rgbValues1;
        const [r2, g2, b2] = rgbValues2;
        const distance = Math.sqrt(
            Math.pow(r2 - r1, 2) +
            Math.pow(g2 - g1, 2) +
            Math.pow(b2 - b1, 2)
        );
        return distance;
    }

}