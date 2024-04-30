let accessLogTextInputBox = qs("#access-log-text-input");
let pathGroupsInputBox = qs("#path-groups-input");
let logsBody = qs("#logs-table tbody");
let ipCountBody = qs("#ip-count-table tbody");
let dateCountBody = qs("#date-count-table tbody");
let methodCountBody = qs("#method-count-table tbody");
let pathGroupsCountBody = qs("#path-groups-count-table tbody");
let protocolCountBody = qs("#protocol-count-table tbody");
let statusCountBody = qs("#status-count-table tbody");

on(pathGroupsInputBox, "input", debounce(() => {
    pathGroupsInputBox.value = trimTextWhitespace(pathGroupsInputBox.value);
}));

trigger(pathGroupsInputBox, "input");

on("#parse-btn", "click", () => {
    let logs = parseAccessLogs(accessLogTextInputBox.value);
    
    let maxLogRowCount = 1000;
    let logIndex = 1;
    logsBody.innerHTML = "";
    for (const log of logs) {
        logsBody.append( buildLogLine(log, logIndex++) );
        if (logIndex > maxLogRowCount) {
            break;
        }
    }
    
    let ipFrequency = calcFrequency(getColumn(logs, "ip"));
    ipFrequency = Object.entries(ipFrequency);
    ipFrequency = sortBy(ipFrequency, [1, -1], 0);
    ipFrequency = ipFrequency.slice(0, 10);
    let ipIndex = 1;
    ipCountBody.innerHTML = "";
    for (const entry of ipFrequency) {
        ipCountBody.append( buildCountLine(entry, ipIndex++) );
    }
    
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
    
    let methodFrequency = calcFrequency(getColumn(logs, "request.method"));
    methodFrequency = Object.entries(methodFrequency);
    methodFrequency = sortBy(methodFrequency, [1, -1], 0);
    let methodIndex = 1;
    methodCountBody.innerHTML = "";
    for (const entry of methodFrequency) {
        methodCountBody.append( buildCountLine(entry, methodIndex++) );
    }
    
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
    
    let statusFrequency = calcFrequency(getColumn(logs, "status"));
    statusFrequency = Object.entries(statusFrequency);
    statusFrequency = sortBy(statusFrequency, [1, -1], 0);
    let statusIndex = 1;
    statusCountBody.innerHTML = "";
    for (const entry of statusFrequency) {
        statusCountBody.append( buildCountLine(entry, statusIndex++) );
    }
});

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
