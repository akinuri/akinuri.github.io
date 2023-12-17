class Totals {

    table = null;
    lineItems = null;
    eventBus = null;
    cells = {
        subtotal : null,
    };

    constructor(table, lineItems, eventBus) {
        this.table = table;
        this.lineItems = lineItems;
        this.eventBus = eventBus;
        this.findElements();
        this.addEventListeners();
    }

    findElements() {
        this.cells.subtotal = this.table.querySelector(".subtotal-value-cell");
    }

    addEventListeners() {
        let totals = this;
        this.eventBus.addListener(
            [
                "LineItemChanged",
                "LineItemRemoved",
            ],
            () => {
                totals.print();
            },
        );
    }

    print() {
        let totals = this.calc();
        this.cells.subtotal.textContent = totals.subtotal.sum;
    }

    calc() {
        let result = {
            subtotal : {
                values : [],
                sum    : 0,
            },
        };
        for (let lineItem of this.lineItems.getItems()) {
            let itemTotal = lineItem.calcTotal();
            result.subtotal.values.push(
                itemTotal.getResult("unit", "quantity")
            );
        }
        result.subtotal.sum = result.subtotal.values.reduce((sum, value) => sum += value, 0);
        return result;
    }

}