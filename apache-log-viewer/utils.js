function parseAccessLogs(text) {
    let logs = [];
    let lines = text.split(/\r?\n/);
    lines = lines.filter(line => line.trim().length);
    for (const line of lines) {
        logs.push(parseAccessLogLine(line));
    }
    return logs;
}

function parseAccessLogLine(
    text,
    partNames = ["ip", "identity", "user", "datetime", "method", "path", "protocol", "status", "length", "referrer", "ua"],
) {
    const regex = /[^\s"\[]+|"([^"]+)"|\[([^\]]+)\]/gi;
    let parts = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match[1]) {
            let request = parseAccessLogRequestPart(match[1]);
            parts.push(request);
        } else if (match[2]) {
            parts.push(match[2]);
        } else {
            parts.push(match[0]);
        }
    }
    parts.splice(4, 1, ...Object.values(parts[4]));
    parts = arrayCombine(partNames, parts);
    return parts;
}

function parseAccessLogRequestPart(text, partNames = ["method", "path", "protocol"]) {
    let parts = text.split(" ");
    let result = arrayCombine(partNames, parts);
    return result;
}

function arrayCombine(keys, values) {
    let combined = {};
    for (let i = 0; i < keys.length; i++) {
        let value = null;
        if (i in values) {
            value = values[i];
        }
        combined[keys[i]] = value;
    }
    return combined;
}

function calcFrequency(array) {
    let frequency = {};
    for (const item of array) {
        if (frequency[item]) {
            frequency[item]++;
        } else {
            frequency[item] = 1;
        }
    }
    return frequency;
}

function getColumn(array, columnName) {
    return array.map(item => item[columnName]);
}

function sortBy(array, firstColumnName, secondColumnName) {
    let firstColDir = 1;
    let secondColDir = 1;
    if (firstColumnName instanceof Array) {
        firstColDir = firstColumnName[1];
        firstColumnName = firstColumnName[0];
    }
    if (secondColumnName instanceof Array) {
        secondColDir = secondColumnName[1];
        secondColumnName = secondColumnName[0];
    }
    return array.sort((a, b) => {
        const valueA = a[firstColumnName];
        const valueB = b[firstColumnName];
        if (valueA < valueB) {
            return -1 * firstColDir;
        }
        if (valueA > valueB) {
            return 1 * firstColDir;
        }
        if (secondColumnName) {
            const secondValueA = a[secondColumnName];
            const secondValueB = b[secondColumnName];
            if (secondValueA < secondValueB) {
                return -1 * secondColDir;
            }
            if (secondValueA > secondValueB) {
                return 1 * secondColDir;
            }
        }
        return 0;
    });
}
