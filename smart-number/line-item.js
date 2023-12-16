class LineItem {

    fields = {
        name: null,
        unit: null,
        quantity: null,
        unitPrice: null,
        discount: {
            type: null,
            value: null,
        },
        taxRate: null,
        total: null,
    };

    constructor(row) {
        this.row = row;
        this.row.lineItem = this;
        this.findFields();
        this.addEventListeners();
    }

    findFields() {
        this.fields = {
            name: this.row.querySelector(".col-name input"),
            unit: this.row.querySelector(".col-unit input"),
            quantity: this.row.querySelector(".col-quantity input"),
            unitPrice: this.row.querySelector(".col-unit-price input"),
            discount: {
                type: this.row.querySelector(".col-discount select"),
                value: this.row.querySelector(".col-discount input"),
            },
            taxRate: this.row.querySelector(".col-tax input"),
            total: this.row.querySelector(".col-total input"),
        };
    }

    setIndex(index) {
        this.row.querySelector(".col-index").textContent = index;
    }

    addEventListeners() {
        let lineItem = this;
        [
            this.fields.quantity,
            this.fields.unitPrice,
            this.fields.discount.type,
            this.fields.discount.value,
            this.fields.taxRate,
            this.fields.total,
        ].forEach(input => {
            input.addEventListener("input", () => {
                lineItem.printTotal(input);
            });
        });
    }

    printTotal(inputOrigin) {
        let result = this.calcTotal(inputOrigin);
        this.lastResult = result;
        if (inputOrigin == this.fields.total) {
            let unitPrice = parseFloat(result.getResult("unit").toFixed(2));
            this.fields.unitPrice.value = unitPrice;
        } else {
            let total = parseFloat(result.getResult().toFixed(2));
            this.fields.total.value = total;
        }
    }

    calcTotal(inputOrigin) {
        let result = new SmartPrice();
        let values = this.getValues();
        if (inputOrigin == this.fields.total) {
            result.unit(null);
            result.quantity(values.quantity);
            result.discount(
                values.discount.value,
                values.discount.type,
            );
            result.tax(values.taxRate);
            result.setResult(values.total);
        }
        else {
            result.unit(values.unitPrice);
            result.quantity(values.quantity);
            result.discount(
                values.discount.value,
                values.discount.type,
            );
            result.tax(values.taxRate);
        }
        return result;
    }

    getValues() {
        let result = {
            quantity: parseInt(this.fields.quantity.value) || 0,
            unitPrice: parseFloat(this.fields.unitPrice.value) || 0,
            discount: {
                type: this.fields.discount.type.value || "percentage",
                value: parseFloat(this.fields.discount.value.value) || 0,
            },
            taxRate: parseFloat(this.fields.taxRate.value) || 0,
            total: parseFloat(this.fields.total.value) || 0,
        };
        return result;
    }

}