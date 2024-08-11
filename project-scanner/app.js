window.addEventListener("load", () => {
    let rootFolder = qs(".root-folder");
    on(qs("#analyze-btn"), "click", () => {
        rootFolder.innerHTML = null;
        let inputText = qs("#scan-input-box").value.trim();
        let tree = JSON.parse(inputText);
        printTree(tree, rootFolder);
    });
});
