let logInput = qs("#log-input-box");
let parseBtn = qs("#parse-btn");
let outputArea = qs("#output-area");

on(parseBtn, "click", () => {
    let parsed = CommitsParser.parse(logInput.value);
    let groupedByDate = groupBy(parsed, commit => commit.date.split(" ")[0]);
    let graphsContainer = elem("div", { "class": "w-fit flex flex-col gap-4" });
    for (const date in groupedByDate) {
        if (Object.hasOwnProperty.call(groupedByDate, date)) {
            const commits = groupedByDate[date];
            let graph = buildDayGraph(date, commits);
            graphsContainer.append(graph);
        }
    }
    outputArea.innerHTML = null;
    outputArea.append(graphsContainer);
});

function buildDayGraph(date, commits) {
    let container = elem("div", { "class": "flex gap-4 items-center" });
    container.append(elem("span", date));
    let graph = elem("div", { "class": "w-[480px] bg-white h-[2rem] border rounded relative" });
    let hoursContainer = elem("div", { "class": "h-full flex absolute w-[480px] text-[8px] text-black/50" });
    for (let hour = 0; hour < 24; hour++) {
        hoursContainer.append(
            elem("div", { "class": "w-[calc(100%/24)] border-r h-full flex items-center pl-[2px]" }, hour)
        )
    }
    graph.append(hoursContainer);
    let dayInSeconds = timeStrToSeconds("24:00:00");
    let commitsContainer = elem("div", { "class": "relative h-full" });
    for (const commit of commits) {
        let timeStr = commit.date.split(" ")[1];
        let seconds = timeStrToSeconds(timeStr);
        let pct = seconds / dayInSeconds * 100;
        pct = pct.toFixed(1);
        commitsContainer.append(
            elem("div", { "class": `w-[1px] h-full bg-green-400/75 shadow shadow-green-400 absolute t-0 left-[${pct}%]` })
        );
    }
    graph.append(commitsContainer);
    container.append(graph);
    container.append(elem("span", commits.length));
    return container;
}