import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        // inlcude a small library that can help create unique id
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        // with find index, we can specify a call back function that returns true
        const index = this.items.findIndex( el => el.id ===id);
        // mutate the original array
        // [2,4,8].splice(1,2) --> returns [4,8] orininal array is [2]
        // [2,4,8].slice(1,2) --> returs [4,8], orinigal array is [2,4,8]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount){
        // this returns the element itself
        this.items.find( el => el.id === id).count = newCount;
    }
}