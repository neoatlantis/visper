const _ = require("lodash");

class TimedMap{

    #store;
    #seconds_division = 1;
    #max_size = 5;

    constructor(seconds_division, max_size){
        this.#store = new Map();
        this.#seconds_division = !_.isNil(seconds_division)?seconds_division:1;
        this.#max_size = !_.isNil(max_size)?max_size:5;

        this.forEach = (e)=>this.#store.forEach(e);
        this.has = (e)=>this.#store.has(e);
        this.delete = (e)=>this.#store.delete(e);

        setInterval(()=>this.#refresh(), this.#seconds_division * 500);
        this.#refresh();
    }

    current_key(){
        return Math.floor(new Date().getTime() / this.#seconds_division / 1000);
    }

    current(){
        return this.#store.get(this.current_key());
    }

    set(value){
        this.#store.set(this.current_key(), value);
    }

    get(key){
        return this.#store.get(key);
    }

    #refresh(){
        const limit = this.current_key() - this.#max_size;
        const removing_keys = [];
        this.forEach((_, key)=>{
            if(key < limit) removing_keys.push(key);
        });
        removing_keys.forEach((k)=>this.delete(k));
    }

}

export default TimedMap;
