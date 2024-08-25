class World {
    objects = [];
    canvas = null;

    constructor(el) {
        this.canvas = el;
    }

    add(obj) {
        if (!this.objects.includes(obj)) {
            this.objects.push(obj);
            if (obj.el) {
                this.canvas.append(obj.el);
                obj.render();
            }
        }
    }
    remove(targetObj) {
        for (let index = 0; index < this.objects.length; index++) {
            const worldObj = this.objects[index];
            if (worldObj === targetObj) {
                if (targetObj.el) {
                    targetObj.el.remove();
                    targetObj.el = null;
                }
                this.objects.splice(index, 1);
                break;
            }
        }
    }
}
