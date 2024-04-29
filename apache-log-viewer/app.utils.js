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
    parts.datetime = isoDateTimeFromParsedDate(parseAccessLogDate(parts.datetime));
    return parts;
}

function parseAccessLogLineRequestPart(logLine, partNames = ["method", "path", "protocol"]) {
    let request = {
        raw: /\] "(.*)" \d+ /s.exec(logLine)[1],
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

function parseAccessLogDate(dateStr) {
    let parts = dateStr.split(/\/|:|\s/);
    let namedParts = arrayCombine(["day", "month", "year", "hour", "minute", "second", "timezone"], parts);
    namedParts.month = getMonthIndexByName(namedParts.month);
    return namedParts;
}
