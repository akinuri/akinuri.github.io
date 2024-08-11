function printTree(folder, containerEl) {
    for (const folderName in folder.folders) {
        if (Object.prototype.hasOwnProperty.call(folder.folders, folderName)) {
            const subfolder = folder.folders[folderName];
            let folderEl = buildFolder(folderName);
            containerEl.append(folderEl);
            printTree(subfolder, folderEl.children[1]);
        }
    }
    for (const fileName in folder.files) {
        if (Object.prototype.hasOwnProperty.call(folder.files, fileName)) {
            const file = folder.files[fileName];
            let methodsCount = Object.values(file.classes).reduce((count, clsObj) => {
                return count + clsObj.methods.length;
            }, 0);
            containerEl.innerHTML += buildFileItem(
                fileName,
                Object.keys(file.classes).length,
                methodsCount,
                file.functions.length,
                file.includes.length,
                new Set(Object.values(file.calls.methods).map(method => method.class)).length,
                file.calls.methods.length,
                file.calls.functions.length,
                file.lineCount.physical,
                file.lineCount.logical,
                file.size
            );
        }
    }
}

function buildFolder(folderName, items = []) {
    let folder = elem("div", { class: "folder" });
    folder.innerHTML += buildFolderItem(folderName);
    let folderContents = elem("div", { class: "folder-contents" });
    folder.append(folderContents);
    return folder;
}

function buildFolderItem(
    folderName,
    classDefCount = 0,
    methodDefCount = 0,
    funcDefCount = 0,
    includeUseCount = 0,
    classUseCount = 0,
    methodUseCount = 0,
    funcUseCount = 0,
    physLineCount = 0,
    logLineCount = 0,
    size = 0
) {
    let fadeColor = "text-green-700/25";
    classDefCount =
        classDefCount != 0 ? classDefCount : `<span class="${fadeColor}">${classDefCount}</span>`;
    methodDefCount =
        methodDefCount != 0
            ? methodDefCount
            : `<span class="${fadeColor}">${methodDefCount}</span>`;
    funcDefCount =
        funcDefCount != 0 ? funcDefCount : `<span class="${fadeColor}">${funcDefCount}</span>`;
    includeUseCount =
        includeUseCount != 0
            ? includeUseCount
            : `<span class="${fadeColor}">${includeUseCount}</span>`;
    classUseCount =
        classUseCount != 0 ? classUseCount : `<span class="${fadeColor}">${classUseCount}</span>`;
    methodUseCount =
        methodUseCount != 0
            ? methodUseCount
            : `<span class="${fadeColor}">${methodUseCount}</span>`;
    funcUseCount =
        funcUseCount != 0 ? funcUseCount : `<span class="${fadeColor}">${funcUseCount}</span>`;
    physLineCount =
        physLineCount != 0 ? physLineCount : `<span class="${fadeColor}">${physLineCount}</span>`;
    logLineCount =
        logLineCount != 0 ? logLineCount : `<span class="${fadeColor}">${logLineCount}</span>`;
    size = size != 0 ? size : `<span class="${fadeColor}">${size}</span>`;
    // TODO: temp hide; enable later
    classDefCount = "";
    methodDefCount = "";
    funcDefCount = "";
    includeUseCount = "";
    classUseCount = "";
    methodUseCount = "";
    funcUseCount = "";
    physLineCount = "";
    logLineCount = "";
    size = "";
    return `
        <div class="folder-item flex *:w-[var(--col-width)] justify-between text-green-700">
            <div class="item-name !w-[var(--col-1-width)] flex gap-1 items-center">
                <svg class="size-4 rounded cursor-pointer hover:bg-slate-300/50 active:bg-slate-300/75">
                    <use href="#chevron-down" />
                </svg>
                <span>${folderName}</span>
            </div>
            <div>${classDefCount}</div>
            <div>${methodDefCount}</div>
            <div>${funcDefCount}</div>
            <div>${includeUseCount}</div>
            <div>${classUseCount}</div>
            <div>${methodUseCount}</div>
            <div>${funcUseCount}</div>
            <div>${physLineCount}</div>
            <div>${logLineCount}</div>
            <div>${size}</div>
        </div>`;
}

function buildFileItem(
    fileName,
    classDefCount = 0,
    methodDefCount = 0,
    funcDefCount = 0,
    includeUseCount = 0,
    classUseCount = 0,
    methodUseCount = 0,
    funcUseCount = 0,
    physLineCount = 0,
    logLineCount = 0,
    size = 0
) {
    let fadeColor = "text-blue-900/25";
    classDefCount =
        classDefCount != 0 ? classDefCount : `<span class="${fadeColor}">${classDefCount}</span>`;
    methodDefCount =
        methodDefCount != 0
            ? methodDefCount
            : `<span class="${fadeColor}">${methodDefCount}</span>`;
    funcDefCount =
        funcDefCount != 0 ? funcDefCount : `<span class="${fadeColor}">${funcDefCount}</span>`;
    includeUseCount =
        includeUseCount != 0
            ? includeUseCount
            : `<span class="${fadeColor}">${includeUseCount}</span>`;
    classUseCount =
        classUseCount != 0 ? classUseCount : `<span class="${fadeColor}">${classUseCount}</span>`;
    methodUseCount =
        methodUseCount != 0
            ? methodUseCount
            : `<span class="${fadeColor}">${methodUseCount}</span>`;
    funcUseCount =
        funcUseCount != 0 ? funcUseCount : `<span class="${fadeColor}">${funcUseCount}</span>`;
    physLineCount =
        physLineCount != 0 ? physLineCount : `<span class="${fadeColor}">${physLineCount}</span>`;
    logLineCount =
        logLineCount != 0 ? logLineCount : `<span class="${fadeColor}">${logLineCount}</span>`;
    size = size != 0 ? size : `<span class="${fadeColor}">${size}</span>`;
    return `
        <div class="file-item flex *:w-[var(--col-width)] justify-between text-blue-900">
            <div class="!w-[var(--col-1-width)]">
                <span class="item-name">${fileName}</span>
            </div>
            <div>${classDefCount}</div>
            <div>${methodDefCount}</div>
            <div>${funcDefCount}</div>
            <div>${includeUseCount}</div>
            <div>${classUseCount}</div>
            <div>${methodUseCount}</div>
            <div>${funcUseCount}</div>
            <div>${physLineCount}</div>
            <div>${logLineCount}</div>
            <div>${size}</div>
        </div>`;
}
