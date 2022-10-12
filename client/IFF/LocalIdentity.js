import nacl from "tweetnacl";
const buffer = require("buffer");
const _ = require("lodash");
const events = require("events");


class Identity extends events.EventEmitter{

    #public_key;
    #secret_key;
    #public_key_serialized;

    constructor(){
        super();
    }

    generate(){
        const { publicKey, secretKey } = nacl.box.keyPair();
        this.#secret_key = secretKey;
        this.#public_key = publicKey;
        this.#public_key_serialized = buffer.Buffer.from(
            this.#public_key).toString("hex");

        this.emit("created");
    }

    get_public_key(){
        return this.#public_key_serialized;
    }
    
}




export default new Identity();
