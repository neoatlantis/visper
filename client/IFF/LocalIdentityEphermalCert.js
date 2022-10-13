import nacl from "tweetnacl";
const buffer = require("buffer");
const _ = require("lodash");
const events = require("events");
const msgpack = require("msgpack");


class LocalIdentityEphermalCert extends events.EventEmitter{

    #keys;

    constructor(){
        super();
        this.#keys = new Map();
    }

    update(local_identity){
        const now = Math.floor(new Date().getTime() / 30000);
        if(this.#keys.has(now)){
            return _.get(this.#keys.get(now), "cert");
        }
        const { publicKey, secretKey } = nacl.box.keyPair();

        const cert_payload = msgpack.serialize({
            identity: local_identity.get_identity(),
            ephermal: publicKey,
            sequence: now,
        });
        const cert_signature = local_identity.get_signed_detached(cert_payload);
        const cert = msgpack.serialize({
            payload: cert_payload,
            signature: cert_signature,
        });

        this.#keys.set(now, {
            publicKey, secretKey, cert
        });

        return buffer.Buffer.from(cert).toString("base64");
    }

}

export default LocalIdentityEphermalCert;
