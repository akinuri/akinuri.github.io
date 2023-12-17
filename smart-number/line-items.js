class LineItems {

    tbody = null;
    rowTemplate = null;
    eventBus = null;

    constructor(tbody, rowTemplate, eventBus) {
        this.tbody = tbody;
        this.rowTemplate = rowTemplate;
        this.eventBus = eventBus;
    }

    addLine() {
        let item = this.buildLineItem();
        this.prepItem(item);
        this.tbody.append(item.row);
    }

    buildLineItem() {
        let row = this.rowTemplate.content.children[0].cloneNode(true);
        let item = new LineItem(row, this.eventBus);
        return item;
    }

    prepItem(item) {
        item.setIndex(this.getItemCount() + 1);
    }

    getItemCount() {
        return this.tbody.children.length;
    }

    removeLine(row) {
        row.remove();
        this.eventBus.dispatch("LineItemRemoved");
        this.reindexLines();
    }

    reindexLines() {
        Array.from(this.tbody.children).forEach((row, index) => {
            row.lineItem.setIndex(index + 1);
        });
    }
    
    getItems() {
        return Array.from(this.tbody.children).map(row => {
            return row.lineItem;
        });
    }
    
}