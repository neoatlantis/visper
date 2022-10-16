import constants from "app/constants";
const _  = require("lodash");


class Keyring {

    #keyring;

    constructor(){
        this.#keyring = new Map();
        setInterval(
            ()=>this.purge(),
            constants.EPHERMAL_KEY_ROTATION_PERIOD * 500
        );
    }

    has_fingerprint(_fingerprint){
        let ret = false;
        this.#keyring.forEach(({ fingerprint })=>{
            if(!ret && _fingerprint == fingerprint) ret = true;
        });
        return ret;
    }

    add({ publicKey, privateKey, identity }){
        const symbol = Symbol();
        let fingerprint = (()=>{
            if(!_.isNil(publicKey)) return publicKey.getFingerprint();
            return privateKey.getFingerprint();
        })();
        if(this.has_fingerprint(fingerprint)) return;
        this.#keyring.set(symbol, {
            publicKey, privateKey, identity, fingerprint,
            time: new Date().getTime(),
        });
    }

    purge(){
        let limit = new Date().getTime() - constants.EPHERMAL_KEY_LIFE * 1000;
        let removing_keys = [];
        this.#keyring.forEach((record, key)=>{
            if(record.time < limit) removing_keys.push(key);
        });
        removing_keys.forEach((key)=>this.#keyring.delete(key));
    }

    purge_identity(identity){
        let removing_keys = [];
        this.#keyring.forEach((record, key)=>{
            if(record.identity === identity) removing_keys.push(key);
        });
        removing_keys.forEach((key)=>this.#keyring.delete(key));
    }

    filter(cond){
        let ret = [];
        this.#keyring.forEach((value)=>{
            if(cond(value)) ret.push(value);
        });
        return ret;
    }

    get_public_keys_of(_identity){
        this.purge();
        return _.compact(
            this.filter(({ identity })=>identity == _identity)
            .map((each)=>each.publicKey)
        );
    }

    get_private_keys_of(_identity){
        this.purge();
        return _.compact(
            this.filter(({ identity })=>identity == _identity)
            .map((each)=>each.privateKey)
        );
    }

    get_latest_public_key_of(_identity){
        this.purge();
        let ret = _.sortBy(
            this.filter(({ identity })=>identity == _identity),
            (e)=>e.time
        );
        ret = _.last(_.compact(ret));
        return _.get(ret, "publicKey", null);
    }

    get_latest_private_key_of(_identity){
        this.purge();
        let ret = _.sortBy(
            this.filter(({ identity })=>identity == _identity),
            (e)=>e.time
        );
        ret = _.last(_.compact(ret));
        return _.get(ret, "privateKey", null);
    }


}

export default new Keyring();
