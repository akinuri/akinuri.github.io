window.addEventListener("load", async () => {
    document.body.append(...htmlFromString(await fetchHtmlFromUrl("/test/menu.html.tpl")));
    renderTemplateInstances();
});
