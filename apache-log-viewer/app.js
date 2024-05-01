let accessLogTextInputBox = qs("#access-log-text-input");
let pathGroupsInputBox = qs("#path-groups-input");

let logsBody = qs("#logs-table tbody");

let ipCountBody = qs("#ip-count-table tbody");
let dateCountBody = qs("#date-count-table tbody");
let methodCountBody = qs("#method-count-table tbody");
let pathGroupsCountBody = qs("#path-groups-count-table tbody");
let protocolCountBody = qs("#protocol-count-table tbody");
let statusCountBody = qs("#status-count-table tbody");

let ipBytesTable = qs("#ip-bytes-table tbody");
let dateBytesTable = qs("#date-bytes-table tbody");
let methodBytesTable = qs("#method-bytes-table tbody");

on(pathGroupsInputBox, "input", debounce(() => {
    pathGroupsInputBox.value = trimTextWhitespace(pathGroupsInputBox.value);
}));

trigger(pathGroupsInputBox, "input");

on("#parse-btn", "click", () => {
    let logs = parseAccessLogs(accessLogTextInputBox.value);
    
    printLogsLines(logs);
    
    printIpRequestCounts(logs);
    printDateRequestCounts(logs);
    printMethodRequestCounts(logs);
    printPathGroupsRequestCounts(logs);
    printStatusRequestCounts(logs);
    
    printIpRequestBytes(logs);
    printDateRequestBytes(logs);
    printMethodRequestBytes(logs);
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
            elem("td", log.datetime),
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
            elem("td", {"colspan" : 3, "class" : "bg-red-50"}, log.request.raw),
        );
    }
    row.append(
        elem("td", log.status),
        elem("td", log.length),
        elem("td", log.referrer),
        elem("td", log.ua),
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
    let ips = Array.from(new Set(getColumn(logs, "ip")));
    for (const ip of ips) {
        let ipRequests = logs.filter(log => log.ip == ip);
        let ipBytes = getColumn(ipRequests, "length")
            .filter(value => value != "-")
            .map(value => parseInt(value));
        ipBytes = sum(ipBytes);
        ipBytes = parseFloat((ipBytes / 1024 / 1024).toFixed(2));
        bytes[ip] = ipBytes;
    }
    bytes = Object.entries(bytes);
    bytes = sortBy(bytes, [1, -1], 0);
    bytes = bytes.slice(0, 10);
    let byteIndex = 1;
    ipBytesTable.innerHTML = "";
    for (const entry of bytes) {
        ipBytesTable.append( buildCountLine(entry, byteIndex++) );
    }
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
    dateBytesTable.innerHTML = "";
    for (const entry of bytes) {
        dateBytesTable.append( buildCountLine(entry, byteIndex++) );
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
    methodBytesTable.innerHTML = "";
    for (const entry of bytes) {
        methodBytesTable.append( buildCountLine(entry, byteIndex++) );
    }
}

// #endregion


