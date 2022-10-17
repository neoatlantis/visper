import nacl from "tweetnacl";
const buffer = require("buffer");
const _ = require("lodash");
const events = require("events");
const msgpack = require("msgpack");


class ForeignIdentityEphermalCert extends events.EventEmitter{

    #ephermal;
    #ephermal_next;
    #identity;
    #payload;
    #signature;
    #verified;

    constructor(cert){
        super();

        try{
            cert = buffer.Buffer.from(cert);
            const { payload, signature } = msgpack.deserialize(cert);
            const { identity, ephermal, ephermal_next } =
                msgpack.deserialize(payload);

            this.#identity = identity;
            this.#ephermal = ephermal;
            this.#ephermal_next = ephermal_next;
            this.#signature = signature;
            this.#payload = payload;
        } catch(e){
            console.log(e);
            this.#signature = this.#payload = null;
            this.#identity = this.#ephermal = null;
        }
        this.#verified = false;
    }

    verify(){
        if(this.#verified) return true;
        try{
            if(!nacl.sign.detached.verify(
                this.#payload, this.#signature, this.#identity)
            ){
                this.#verified = false;
                return false;
            }
        } catch(e){
            return false;
        }
        this.#verified = true;
        return true;
    }

    get_identity(){
        try{
            return buffer.Buffer.from(this.#identity);
        } catch(e){
            return null;
        }
    }

    get_identity_hex(){
        try{
            return this.get_identity().toString("hex");
        } catch(e){
            return null;
        }
    }

    get_ephermal(){ return this.#ephermal }
    get_ephermal_next(){ return this.#ephermal_next }

}

export default ForeignIdentityEphermalCert;
