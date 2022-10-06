import nacl from "tweetnacl";
const buffer = require("buffer");
const _ = require("lodash");
const events = require("events");


class Identity extends events.EventEmitter{

    #public_key;
    #secret_key;

    constructor(){
        super();
    }

    generate(){
        const { publicKey, secretKey } = nacl.box.keyPair();
        this.#public_key = publicKey;
        this.#secret_key = secretKey;

        this.emit("created");
    }

    get_public_key(){
        return buffer.Buffer.from(this.#public_key).toString("hex");
    }
    
}




const identity = new Identity();
export default identity;
