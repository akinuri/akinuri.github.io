function groupBy(array, prop) {
    let grouped = {};
    for (const item of array) {
        let key;
        if (typeof prop == "function") {
            key = prop(item);
        }
        if (key) {
            if (!(key in grouped)) {
                grouped[key] = [];
            }
            grouped[key].push(item);
        }
    }
    return grouped;
}

function parseTimeStr(timeStr) {
    let result = {
        hour: 0,
        minute: 0,
        second: 0,
    };
    let parts = timeStr.split(":");
    result.hour = parseInt(parts[0]);
    result.minute = parseInt(parts[1]);
    result.second = parseInt(parts[2]);
    return result;
}

function timeStrToSeconds(timeStr) {
    let parsed = parseTimeStr(timeStr);
    return parsed.hour * 60 * 60 + parsed.minute * 60 + parsed.second;
}