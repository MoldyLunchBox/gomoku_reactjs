export default class PriorityQueue {
    constructor() {
        this.items = [];
        this.maxOpen = 0
    }

    queue(elem) {
        let contain = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].score > elem.score) {
                while (i < this.items.length && this.items[i].score == elem.score){
                   
                    
                }
                this.items.splice(i, 0, elem);
                contain = true;
                break;
            }
        }

        if (!contain) {
            this.items.push(elem)
        }

        // get complexity in size
        if (this.items.length > this.maxOpen)
            this.maxOpen = this.items.length
    }
    dequeue() {
        return this.isEmpty() ? undefined : this.items.shift();
    }

    isEmpty() {
        return this.items.length == 0;
    }
} 