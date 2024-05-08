let accessLogTextInputBox = qs("#access-log-text-input");
let pathGroupsInputBox = qs("#path-groups-input");

let logsBody = qs("#logs-table tbody");

let statEls = {
    daysCount : qs("#days-count"),
    requestsCount : qs("#requests-count"),
    ipsCount : qs("#ips-count"),
    bytesSum : qs("#bytes-sum"),
    referrersCount : qs("#referrers-count"),
    uaCount : qs("#ua-count"),
};

let ipCountBody = qs("#ip-count-table tbody");
let dateCountBody = qs("#date-count-table tbody");
let methodCountBody = qs("#method-count-table tbody");
let pathGroupsCountBody = qs("#path-groups-count-table tbody");
let protocolCountBody = qs("#protocol-count-table tbody");
let statusCountBody = qs("#status-count-table tbody");
let referrerCountBody = qs("#referrer-count-table tbody");
let uaCountBody = qs("#ua-count-table tbody");

let ipBytesBody = qs("#ip-bytes-table tbody");
let dateBytesBody = qs("#date-bytes-table tbody");
let methodBytesBody = qs("#method-bytes-table tbody");
let pathGroupsBytesBody = qs("#path-groups-bytes-table tbody");
let protocolBytesBody = qs("#protocol-bytes-table tbody");
let statusBytesBody = qs("#status-bytes-table tbody");
let referrerBytesBody = qs("#referrer-bytes-table tbody");
let uaBytesBody = qs("#ua-bytes-table tbody");

on(pathGroupsInputBox, "input", debounce(() => {
    pathGroupsInputBox.value = trimTextWhitespace(pathGroupsInputBox.value);
}));

on(accessLogTextInputBox, "paste", function logPasteDuration() {
    const startTime = performance.now();
    setTimeout(function() {
        const endTime = performance.now();
        const pasteTime = endTime - startTime;
        let charCount = accessLogTextInputBox.value.length;
        let size = (charCount / 1024 / 1024).toFixed(2);
        console.log(`Pasted ${charCount} chars (${size} MB) in ${Math.round(pasteTime)} ms`);
    });
});

trigger(pathGroupsInputBox, "input");

on("#parse-btn", "click", () => {
    
    let sw = new Stopwatch();
    
    sw.time("all");
    
    sw.time("parse");
    let logs = parseAccessLogs(accessLogTextInputBox.value);
    sw.timeEnd("parse");
    
    sw.time("print lines");
    printLogsLines(logs);
    sw.timeEnd("print lines");
    
    sw.time("stats");
    statEls.daysCount.textContent = new Set(
        getColumn(
            logs,
            log => isoDateFromParsedDate(parseISODateTime(log.datetime))
        )
    ).size;
    statEls.requestsCount.textContent = logs.length;
    statEls.ipsCount.textContent = new Set(getColumn(logs, "ip")).size;
    statEls.bytesSum.textContent = (
        sum(
            getColumn(logs, "length")
                .filter(value => value != "-")
                .map(value => parseInt(value))
        )
        / 1024 / 1024
    ).toFixed(2);
    statEls.referrersCount.textContent = new Set(
        getColumn(logs, "referrer").map(ref => getLogReferrerHost(ref))
    ).size;
    statEls.uaCount.textContent = new Set(getColumn(logs, "ua")).size;
    sw.timeEnd("stats");
    
    sw.time("counts");
    printIpRequestCounts(logs);
    printDateRequestCounts(logs);
    printMethodRequestCounts(logs);
    printPathGroupsRequestCounts(logs);
    printProtocolRequestCounts(logs);
    printStatusRequestCounts(logs);
    printReferrerRequestCounts(logs);
    printUARequestCounts(logs);
    sw.timeEnd("counts");
    
    sw.time("bytes");
    
    sw.time("bytes - ip");
    printIpRequestBytes(logs);
    sw.timeEnd("bytes - ip");
    
    sw.time("bytes - date");
    printDateRequestBytes(logs);
    sw.timeEnd("bytes - date");
    
    sw.time("bytes - method");
    printMethodRequestBytes(logs);
    sw.timeEnd("bytes - method");
    
    sw.time("bytes - path");
    printPathGroupsRequestBytes(logs);
    sw.timeEnd("bytes - path");
    
    sw.time("bytes - protocol");
    printProtocolRequestBytes(logs);
    sw.timeEnd("bytes - protocol");
    
    sw.time("bytes - status");
    printStatusRequestBytes(logs);
    sw.timeEnd("bytes - status");
    
    sw.time("bytes - referrer");
    printReferrerRequestBytes(logs);
    sw.timeEnd("bytes - referrer");
    
    sw.time("bytes - ua");
    printUARequestBytes(logs);
    sw.timeEnd("bytes - ua");
    
    sw.timeEnd("bytes");
    
    sw.timeEnd("all");
    
    console.table(sw.getDurations());
});


// #region ==================== LOGS

function printLogsLines(logs) {
    let maxLogRowCount = 1000;
    let logIndex = 1;
    logsBody.innerHTML = "";
    for (const log of logs) {
        logsBody.append( buildLogLine(log, logIndex++) );
        if (logIndex > maxLogRowCount) {
            break;
        }
    }
}

function buildLogLine(log, index) {
    let row = elem(
        "tr",
        {
            "class" : "*:px-2 *:py-[2px] *:border hover:bg-slate-50",
        },
        [
            elem("td", index),
            elem("td", log.ip),
            elem("td", log.identity),
            elem("td", log.user),
            elem("td", {"class" : "whitespace-nowrap"}, log.datetime),
        ],
    );
    if (log.request.method) {
        row.append(
            elem("td", log.request.method),
            elem("td", log.request.path),
            elem("td", log.request.protocol),
        );
    } else {
        row.append(
            elem("td", {"colspan" : 3, "class" : "bg-red-50"}, log.request.raw.slice(1, -1)),
        );
    }
    row.append(
        elem("td", log.status),
        elem("td", log.length),
        elem("td", log.referrer?.slice(1, -1)),
        elem("td", log.ua?.slice(1, -1)),
    );
    return row;
}

// #endregion


// #region ==================== COUNTS

function printIpRequestCounts(logs) {
    let ipFrequency = calcFrequency(getColumn(logs, "ip"));
    ipFrequency = Object.entries(ipFrequency);
    ipFrequency = sortBy(ipFrequency, [1, -1], 0);
    ipFrequency = ipFrequency.slice(0, 10);
    let ipIndex = 1;
    ipCountBody.innerHTML = "";
    for (const entry of ipFrequency) {
        ipCountBody.append( buildCountLine(entry, ipIndex++) );
    }
}

function printDateRequestCounts(logs) {
    let dateFrequency = calcFrequency(
        getColumn(logs, log => {
            return isoDateFromParsedDate(parseISODateTime(log.datetime));
        })
    );
    dateFrequency = Object.entries(dateFrequency);
    dateFrequency = sortBy(dateFrequency, [1, -1], 0);
    let dateIndex = 1;
    dateCountBody.innerHTML = "";
    for (const entry of dateFrequency) {
        dateCountBody.append( buildCountLine(entry, dateIndex++) );
    }
}

function printMethodRequestCounts(logs) {
    let methodFrequency = calcFrequency(getColumn(logs, "request.method"));
    methodFrequency = Object.entries(methodFrequency);
    methodFrequency = sortBy(methodFrequency, [1, -1], 0);
    let methodIndex = 1;
    methodCountBody.innerHTML = "";
    for (const entry of methodFrequency) {
        methodCountBody.append( buildCountLine(entry, methodIndex++) );
    }
}

function printPathGroupsRequestCounts(logs) {
    let pathGroups = parsePathGroups(pathGroupsInputBox.value);
    let pathGroupsFrequency = {
        "[OTHER]" : 0,
        "[INVALID]" : 0,
    };
    pathGroupsCountBody.innerHTML = "";
    if (Object.keys(pathGroups).length) {
        for (const log of logs) {
            if (!log.request.path) {
                pathGroupsFrequency["[INVALID]"]++;
                continue;
            }
            let groupMatch = false;
            for (const pathGroupName in pathGroups) {
                const pathGroupRegex = pathGroups[pathGroupName];
                if (pathGroupRegex.exec(log.request.path)) {
                    groupMatch = true;
                    if (pathGroupsFrequency[pathGroupName]) {
                        pathGroupsFrequency[pathGroupName]++;
                    } else {
                        pathGroupsFrequency[pathGroupName] = 1;
                    }
                }
            }
            if (!groupMatch) {
                pathGroupsFrequency["[OTHER]"]++;
            }
        }
        pathGroupsFrequency = Object.entries(pathGroupsFrequency);
        pathGroupsFrequency = sortBy(pathGroupsFrequency, [1, -1], 0);
        let pathGroupIndex = 1;
        for (const entry of pathGroupsFrequency) {
            pathGroupsCountBody.append( buildCountLine(entry, pathGroupIndex++) );
        }
    }
}

function printProtocolRequestCounts(logs) {
    let protocolFrequency = calcFrequency(getColumn(logs, "request.protocol"));
    protocolFrequency = Object.entries(protocolFrequency);
    protocolFrequency = sortBy(protocolFrequency, [1, -1], 0);
    let protocolIndex = 1;
    protocolCountBody.innerHTML = "";
    for (const entry of protocolFrequency) {
        protocolCountBody.append( buildCountLine(entry, protocolIndex++) );
    }
}

function printStatusRequestCounts(logs) {
    let statusFrequency = calcFrequency(getColumn(logs, "status"));
    statusFrequency = Object.entries(statusFrequency);
    statusFrequency = sortBy(statusFrequency, [1, -1], 0);
    let statusIndex = 1;
    statusCountBody.innerHTML = "";
    for (const entry of statusFrequency) {
        statusCountBody.append( buildCountLine(entry, statusIndex++) );
    }
}

function printReferrerRequestCounts(logs) {
    let referrers = getColumn(logs, "referrer");
    referrers = referrers.map(ref => getLogReferrerHost(ref));
    let referrerFrequency = calcFrequency(referrers);
    referrerFrequency = Object.entries(referrerFrequency);
    referrerFrequency = sortBy(referrerFrequency, [1, -1], 0);
    let referrerIndex = 1;
    referrerCountBody.innerHTML = "";
    for (const entry of referrerFrequency) {
        referrerCountBody.append( buildCountLine(entry, referrerIndex++) );
    }
}

function printUARequestCounts(logs) {
    let uaFrequency = calcFrequency(getColumn(logs, "ua"));
    uaFrequency = Object.entries(uaFrequency);
    uaFrequency = sortBy(uaFrequency, [1, -1], 0);
    uaFrequency = uaFrequency.slice(0, 10);
    uaFrequency = uaFrequency.map(entry => {
        entry[0] = unquote(entry[0]);
        if (entry[0].startsWith("Mozilla/5.0")) {
            entry[0] = entry[0].replace("Mozilla/5.0 ", "");
        }
        entry[0] = ellipsis(entry[0], 64);
        return entry;
    });
    let uaIndex = 1;
    uaCountBody.innerHTML = "";
    for (const entry of uaFrequency) {
        uaCountBody.append( buildCountLine(entry, uaIndex++) );
    }
}

function buildCountLine(entry, index) {
    return elem(
        "tr",
        {
            "class" : "*:px-2 *:py-[2px] *:border hover:bg-slate-50",
        },
        [
            elem("td", index),
            elem("td", entry[0] == "null" ? "" : entry[0]),
            elem("td", entry[1]),
        ],
    );
}

// #endregion


// #region ==================== BYTES

function printIpRequestBytes(logs) {
    let bytes = {};
    // let sw = new Stopwatch();
    // sw.time("bytes - ip - get");
    let ips = Array.from(new Set(getColumn(logs, "ip")));
    // sw.timeEnd("bytes - ip - get");
    // sw.time("bytes - ip - calc");
    for (const ip of ips) {
        // sw.time("bytes - ip - calc - requests");
        let ipRequests = logs.filter(log => log.ip == ip);
        // sw.timeEnd("bytes - ip - calc - requests");
        // sw.time("bytes - ip - calc - bytes");
        let ipBytes = getColumn(ipRequests, "length")
            .filter(value => value != "-")
            .map(value => parseInt(value));
        // sw.timeEnd("bytes - ip - calc - bytes");
        // sw.time("bytes - ip - calc - sum");
        ipBytes = sum(ipBytes);
        ipBytes = parseFloat((ipBytes / 1024 / 1024).toFixed(2));
        bytes[ip] = ipBytes;
        // sw.timeEnd("bytes - ip - calc - sum");
    }
    // sw.timeEnd("bytes - ip - calc");
    // sw.time("bytes - ip - sort");
    bytes = Object.entries(bytes);
    bytes = sortBy(bytes, [1, -1], 0);
    bytes = bytes.slice(0, 10);
    // sw.timeEnd("bytes - ip - sort");
    // sw.time("bytes - ip - print");
    let byteIndex = 1;
    ipBytesBody.innerHTML = "";
    for (const entry of bytes) {
        ipBytesBody.append( buildCountLine(entry, byteIndex++) );
    }
    // sw.timeEnd("bytes - ip - print");
    // console.table(sw.getDurations(), ["duration"]);
}

function printDateRequestBytes(logs) {
    let bytes = {};
    let dates = Array.from(
        new Set(
            getColumn(
                logs,
                log => isoDateFromParsedDate(parseISODateTime(log.datetime))
            )
        )
    );
    for (const date of dates) {
        let dateRequests = logs.filter(
            log => isoDateFromParsedDate(parseISODateTime(log.datetime)) == date
        );
        let dateBytes = getColumn(dateRequests, "length")
            .filter(value => value != "-")
            .map(value => parseInt(value));
        dateBytes = sum(dateBytes);
        dateBytes = parseFloat((dateBytes / 1024 / 1024).toFixed(2));
        bytes[date] = dateBytes;
    }
    bytes = Object.entries(bytes);
    bytes = sortBy(bytes, [1, -1], 0);
    bytes = bytes.slice(0, 10);
    let byteIndex = 1;
    dateBytesBody.innerHTML = "";
    for (const entry of bytes) {
        dateBytesBody.append( buildCountLine(entry, byteIndex++) );
    }
}

function printMethodRequestBytes(logs) {
    let bytes = {};
    let methods = Array.from(new Set(getColumn(logs, "request.method")));
    for (const method of methods) {
        let methodRequests = logs.filter(log => log.request.method == method);
        let methodBytes = getColumn(methodRequests, "length")
            .filter(value => value != "-")
            .map(value => parseInt(value));
        methodBytes = sum(methodBytes);
        methodBytes = parseFloat((methodBytes / 1024 / 1024).toFixed(2));
        bytes[method] = methodBytes;
    }
    bytes = Object.entries(bytes);
    bytes = sortBy(bytes, [1, -1], 0);
    bytes = bytes.slice(0, 10);
    let byteIndex = 1;
    methodBytesBody.innerHTML = "";
    for (const entry of bytes) {
        methodBytesBody.append( buildCountLine(entry, byteIndex++) );
    }
}

function printPathGroupsRequestBytes(logs) {
    let pathGroups = parsePathGroups(pathGroupsInputBox.value);
    let bytes = {
        "[OTHER]" : [],
        "[INVALID]" : [],
    };
    pathGroupsBytesBody.innerHTML = "";
    if (Object.keys(pathGroups).length) {
        for (const log of logs) {
            let contentLength = log.length != "-" ? log.length : 0;
            if (!log.request.path) {
                bytes["[INVALID]"].push(contentLength);
                continue;
            }
            let groupMatch = false;
            for (const pathGroupName in pathGroups) {
                const pathGroupRegex = pathGroups[pathGroupName];
                if (pathGroupRegex.exec(log.request.path)) {
                    groupMatch = true;
                    if (bytes[pathGroupName]) {
                        bytes[pathGroupName].push(contentLength);
                    } else {
                        bytes[pathGroupName] = [];
                    }
                }
            }
            if (!groupMatch) {
                bytes["[OTHER]"].push(contentLength);
            }
        }
        for (const pathGroupName in bytes) {
            bytes[pathGroupName] = sum(bytes[pathGroupName]);
            bytes[pathGroupName] = parseFloat((bytes[pathGroupName] / 1024 / 1024).toFixed(2));
        }
        bytes = Object.entries(bytes);
        bytes = sortBy(bytes, [1, -1], 0);
        let byteIndex = 1;
        pathGroupsBytesBody.innerHTML = "";
        for (const entry of bytes) {
            pathGroupsBytesBody.append( buildCountLine(entry, byteIndex++) );
        }
    }
}

function printProtocolRequestBytes(logs) {
    let bytes = {};
    let protocols = Array.from(new Set(getColumn(logs, "request.protocol")));
    for (const protocol of protocols) {
        let protocolRequests = logs.filter(log => log.request.protocol == protocol);
        let protocolBytes = getColumn(protocolRequests, "length")
            .filter(value => value != "-")
            .map(value => parseInt(value));
        protocolBytes = sum(protocolBytes);
        protocolBytes = parseFloat((protocolBytes / 1024 / 1024).toFixed(2));
        bytes[protocol] = protocolBytes;
    }
    bytes = Object.entries(bytes);
    bytes = sortBy(bytes, [1, -1], 0);
    bytes = bytes.slice(0, 10);
    let byteIndex = 1;
    protocolBytesBody.innerHTML = "";
    for (const entry of bytes) {
        protocolBytesBody.append( buildCountLine(entry, byteIndex++) );
    }
}

function printStatusRequestBytes(logs) {
    let bytes = {};
    let statuses = Array.from(new Set(getColumn(logs, "status")));
    for (const status of statuses) {
        let statusRequests = logs.filter(log => log.status == status);
        let statusBytes = getColumn(statusRequests, "length")
            .filter(value => value != "-")
            .map(value => parseInt(value));
        statusBytes = sum(statusBytes);
        statusBytes = parseFloat((statusBytes / 1024 / 1024).toFixed(2));
        bytes[status] = statusBytes;
    }
    bytes = Object.entries(bytes);
    bytes = sortBy(bytes, [1, -1], 0);
    bytes = bytes.slice(0, 10);
    let byteIndex = 1;
    statusBytesBody.innerHTML = "";
    for (const entry of bytes) {
        statusBytesBody.append( buildCountLine(entry, byteIndex++) );
    }
}

function printReferrerRequestBytes(logs) {
    let bytes = {};
    let referrers = getColumn(logs, "referrer");
    referrers = referrers.map(ref => getLogReferrerHost(ref));
    referrers = Array.from(new Set(referrers));
    for (const referrer of referrers) {
        let referrerRequests = logs.filter(log => getLogReferrerHost(log.referrer) == referrer);
        let referrerBytes = getColumn(referrerRequests, "length")
            .filter(value => value != "-")
            .map(value => parseInt(value));
        referrerBytes = sum(referrerBytes);
        referrerBytes = parseFloat((referrerBytes / 1024 / 1024).toFixed(2));
        bytes[referrer] = referrerBytes;
    }
    bytes = Object.entries(bytes);
    bytes = sortBy(bytes, [1, -1], 0);
    bytes = bytes.slice(0, 10);
    let byteIndex = 1;
    referrerBytesBody.innerHTML = "";
    for (const entry of bytes) {
        referrerBytesBody.append( buildCountLine(entry, byteIndex++) );
    }
}

function printUARequestBytes(logs) {
    let bytes = {};
    let uas = Array.from(new Set(getColumn(logs, "ua")));
    for (const ua of uas) {
        let uaRequests = logs.filter(log => log.ua == ua);
        let uaBytes = getColumn(uaRequests, "length")
            .filter(value => value != "-")
            .map(value => parseInt(value));
        uaBytes = sum(uaBytes);
        uaBytes = parseFloat((uaBytes / 1024 / 1024).toFixed(2));
        bytes[ua] = uaBytes;
    }
    bytes = Object.entries(bytes);
    bytes = sortBy(bytes, [1, -1], 0);
    bytes = bytes.slice(0, 10);
    bytes = bytes.map(entry => {
        entry[0] = unquote(entry[0]);
        if (entry[0].startsWith("Mozilla/5.0")) {
            entry[0] = entry[0].replace("Mozilla/5.0 ", "");
        }
        entry[0] = ellipsis(entry[0], 64);
        return entry;
    });
    let uaIndex = 1;
    uaBytesBody.innerHTML = "";
    for (const entry of bytes) {
        uaBytesBody.append( buildCountLine(entry, uaIndex++) );
    }
}

// #endregion


