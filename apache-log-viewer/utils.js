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
    logLine,
    partNames = ["ip", "identity", "user", "datetime", "request", "status", "length", "referrer", "ua"],
) {
    let request = parseAccessLogLineRequestPart(logLine);
    logLine = logLine.replace('"' + request.raw + '"', "");
    const splitPattern = /[^\s\[]+|\[([^\]]+)\]/gi;
    let parts = [];
    let match;
    while ((match = splitPattern.exec(logLine)) !== null) {
        if (match[1]) {
            parts.push(match[1]);
        } else {
            parts.push(match[0]);
        }
    }
    let requestIndex = partNames.indexOf("request");
    if (requestIndex !== -1) {
        parts.splice(requestIndex, 0, request);
    }
    parts = arrayCombine(partNames, parts);
    return parts;
}

function parseAccessLogLineRequestPart(logLine, partNames = ["method", "path", "protocol"]) {
    let request = {
        raw : /\] "(.*)" \d+ /s.exec(logLine)[1],
    };
    request = Object.assign(request, arrayCombine(partNames, Array(partNames.length).fill(null)));
    let isRegularRequest = /^(GET|POST|HEAD|CONNECT|OPTIONS|PUT|PATCH|DELETE|TRACE)/.exec(request.raw);
    if (isRegularRequest) {
        let parts = request.raw.split(" ");
        let namedParts = arrayCombine(partNames, parts);
        request = Object.assign(request, namedParts);
    }
    if (request.protocol && request.protocol.includes("\\n")) {
        request.protocol = request.protocol.replace("\\n", "");
    }
    if (request.protocol && !request.protocol.startsWith("HTTP/")) {
        request.path += " " + request.protocol;
        request.protocol = null;
    }
    return request;
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
    return array.map(item => {
        if (columnName.includes(".")) {
            return getObjProp(item, columnName);
        }
        return item[columnName];
    });
}

function getObjProp(obj, path, fallback) {
    const pathProps = path.split(".");
    let prop = obj;
    for (let i = 0; i < pathProps.length; i++) {
        const pathProp = pathProps[i];
        if (prop && prop.hasOwnProperty(pathProp)) {
            prop = prop[pathProp];
        } else {
            return fallback;
        }
    }
    return prop;
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
