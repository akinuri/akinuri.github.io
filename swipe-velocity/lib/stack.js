class Stack {
    
    #items = [];
    #maxSize = null;
    #shiftOnOverflow = false;
    
    constructor(maxSize = null, shiftOnOverflow = false) {
        this.#maxSize = maxSize;
        this.#shiftOnOverflow = shiftOnOverflow;
    }
    
    setMaxSize = (n) => this.#maxSize = n;
    getMaxSize = () => this.#maxSize;
    
    getSize = () => this.#items.length;
    getItems = () => this.#items;
    
    push(item) {
        let popped = undefined;
        if (this.#maxSize != null) {
            if (this.getSize() >= this.#maxSize) {
                if (this.#shiftOnOverflow) {
                    popped = this.#items.shift();
                    this.#items.push(item);
                } else {
                    throw new Error("The stack has max size and is full.");
                }
            } else {
                this.#items.push(item);
            }
        } else {
            this.#items.push(item);
        }
        return popped;
    }
    
    pop() {
        if (this.getSize()) {
            return this.#items.pop();
        } else {
            throw new Error("The stack is empty. Nothing to return.");
        }
    }
    
    peek(index = 0) {
        if (!this.getSize()) {
            throw new Error("The stack is empty. Nothing to return.");
        }
        index = this.#items.length - 1 - index;
        if (!(index in this.#items)) {
            throw new Error("Invalid index.");
        }
        return this.#items[index];
    }
    
}