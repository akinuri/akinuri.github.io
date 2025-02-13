window.addEventListener("load", async () => {
    document.body.append(...htmlFromString(await fetchHtmlFromUrl("menu.html.tpl")));
    renderTemplateInstances();
});
