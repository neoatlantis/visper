import constants from "app/constants";
const _  = require("lodash");


class KeyStack {

    #keys = [];
    constructor(){

    }

    add(key){
        this.#keys.push(key);
        this.rotate();
    }

    rotate(){
        const now = new Date().getTime();
        const limit_future = now + 2 * constants.EPHERMAL_KEY_ROTATION_PERIOD * 1000;
        const limit_past   = now - 2 * constants.EPHERMAL_KEY_ROTATION_PERIOD * 1000;
        this.#keys = _.uniqBy(this.#keys, (key)=>key.getFingerprint());
        _.remove(this.#keys, (key)=>{
            let t = key.getCreationTime().getTime();
            return t > limit_future || t < limit_past;
        });
        this.#keys = _.sortBy(
            this.#keys,
            (key)=>key.getCreationTime().getTime()
        ).slice(0, 5);
    }

    all(){
        return this.#keys;
    }

    latest(){
        this.rotate();
        return _.maxBy(this.#keys, (key)=>key.getCreationTime().getTime());
    }

    pick(){
        this.rotate();
        // Returns a most suitable key for current time
        // Algorithm: max remaining time of all keys in current key period.
        let collection = [];
        let now = new Date().getTime();
        this.#keys.forEach((key)=>{
            let ctime = key.getCreationTime().getTime();
            let time_remaining = now - ctime;
            if(time_remaining > constants.EPHERMAL_KEY_ROTATION_PERIOD * 1000){
                // too new
                return;
            }
            if(time_remaining < 0){
                // too old
                return;
            }
            collection.push({ key, time_remaining });
        });
        return _.get(
            _.last(_.sortBy(collection, (e)=>e.time_remaining)),
            "key",
            null
        );
    }

    size(){
        return _.size(this.#keys);
    }

    empty(){
        _.remove(this.#keys);
    }

}







class Keyring {

    #public_keys;
    #private_keys;

    constructor(){
        this.#public_keys = new Map();  // identity -> key
        this.#private_keys = new KeyStack();

        setInterval(
            ()=>this.purge(),
            constants.EPHERMAL_KEY_ROTATION_PERIOD * 500
        );
    }

    add_public_key({ publicKey, identity }){
        if(!this.#public_keys.has(identity)){
            this.#public_keys.set(identity, new KeyStack());
        }
        this.#public_keys.get(identity).add(publicKey);
    }

    add_private_key({ privateKey }){
        this.#private_keys.add(privateKey);
    }


    add({ publicKey, privateKey, identity }){
        if(_.isNil(privateKey)){
            return this.add_public_key({ publicKey, identity });
        }
        this.add_private_key({ privateKey });
    }

    purge(){
        let empty_identities = [];
        this.#public_keys.forEach((keystack, identity)=>{
            keystack.rotate();
            if(keystack.size() < 1) empty_identities.push(identity);
        });
        this.#private_keys.rotate();
        empty_identities.forEach((e)=>this.#public_keys.delete(e));
    }

    purge_identity(identity){
        this.#public_keys.delete(identity);
    }

    get_identities(){
        return [...this.#public_keys.keys()];
    }

    get_public_keys_of(identity){
        this.purge();
        let ks = this.#public_keys.get(identity);
        if(!ks) return [];
        return ks.all();
    }

    get_private_keys(){
        this.purge();
        return this.#private_keys.all();
    }

    pick_public_key_of(identity){
        this.purge();
        let ks = this.#public_keys.get(identity);
        if(!ks) return null;
        return ks.pick();
    }

    pick_all_public_keys(){
        return this
            .get_identities()
            .map((identity)=>this.pick_public_key_of(identity));
    }

    pick_private_key(){
        this.purge();
        return this.#private_keys.pick();
    }

    get_latest_private_key(){
        return this.#private_keys.latest();
    }

    empty_private_keys(){
        this.#private_keys.empty();
    }

}

export default new Keyring();
