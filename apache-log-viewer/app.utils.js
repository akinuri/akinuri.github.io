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
    let quotedParts;
    ({logLine, parts : quotedParts} = getAccessLogQuotedParts(logLine));
    const splitPattern = /[^\s\[]+|\[([^\]]+)\]/gi;
    let parts = [];
    let match;
    while ((match = splitPattern.exec(logLine)) !== null) {
        parts.push(match[1] ?? match[0]);
    }
    parts = arrayCombine(partNames, parts);
    parts.datetime = isoDateTimeFromParsedDate(parseAccessLogDate(parts.datetime));
    parts.request = parseAccessLogLineRequestPart(quotedParts.request);
    parts.referrer = quotedParts.referrer;
    parts.ua = quotedParts.ua;
    return parts;
}

function getAccessLogQuotedParts(logLine, partNames = ["request", "referrer", "ua"]) {
    let result = {
        logLine,
        parts : [],
    };
    let pattern = /"(?:\\.|[^"\\])*"/g;
    let i = 0;
    result.logLine = result.logLine.replace(pattern, function (match) {
        result.parts.push(match);
        return `%${partNames[i++]}%`;
    });
    result.parts = arrayCombine(partNames, result.parts);
    return result;
}

function parseAccessLogLineRequestPart(requestStr, partNames = ["method", "path", "protocol"]) {
    let request = {
        raw: requestStr,
    };
    request = Object.assign(request, arrayCombine(partNames, Array(partNames.length).fill(null)));
    let isRegularRequest = /^"(GET|POST|HEAD|CONNECT|OPTIONS|PUT|PATCH|DELETE|TRACE)/.exec(request.raw);
    if (isRegularRequest) {
        let parts = request.raw.slice(1, -1).split(" ");
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

function parsePathGroups(text) {
    let groups = {};
    let pattern = /^(\w+):\s*(.+)/;
    let lines = text.split("\n");
    for (const line of lines) {
        let match = line.match(pattern);
        if (!match) {
            continue;
        }
        let [groupName, groupPattern] = match.slice(1, 3);
        if (groupName == "path group" || groupPattern == "regex") {
            continue;
        }
        groups[groupName] = new RegExp(groupPattern);
    }
    return groups;
}

function getLogReferrerHost(referrer) {
    if (!referrer) {
        return referrer;
    }
    referrer = unquote(referrer);
    if (referrer != "-") {
        let url;
        if (!referrer.startsWith("http")) {
            referrer = "https://" + referrer;
        }
        try {
            url = new URL(referrer);
        } catch (error) {
            console.log([referrer]);
            throw error;
        }
        return url.host || url.href;
    }
    return referrer;
}

