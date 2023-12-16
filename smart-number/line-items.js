class LineItems {

    constructor(tbody, rowTemplate) {
        this.tbody = tbody;
        this.rowTemplate = rowTemplate;
    }

    addLine() {
        let item = this.buildLineItem();
        this.prepItem(item);
        this.tbody.append(item.row);
    }

    buildLineItem() {
        let row = this.rowTemplate.content.children[0].cloneNode(true);
        let item = new LineItem(row);
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
        this.reindexLines();
    }

    reindexLines() {
        Array.from(this.tbody.children).forEach((row, index) => {
            row.lineItem.setIndex(index + 1);
        });
    }

}