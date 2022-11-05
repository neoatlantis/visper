import LocalIdentityEphermalCert from "./LocalIdentityEphermalCert";
import * as openpgp from "openpgp";
import nacl from "tweetnacl";
const buffer = require("buffer");
const _ = require("lodash");
const events = require("events");
const msgpack = require("msgpack");


class Identity extends events.EventEmitter{

    #public_key;
    #secret_key;
    #ephermal_cert;

    constructor(){
        super();
    }

    async export_secret(password){
        // export password protected identity file
        let payload = msgpack.encode({
            "visper-secret-key": this.#secret_key,
        });
        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ binary: payload }),
            passwords: [password],
            format: 'armored',
        });

        this.emit("secret-export", encrypted);
    }

    generate(){
        const { publicKey, secretKey } = nacl.sign.keyPair();
        this.#secret_key = secretKey;
        this.#public_key = publicKey;
        this.#ephermal_cert = new LocalIdentityEphermalCert();

        this.emit("created");
    }

    get_signed(data){
        return nacl.sign(data, this.#secret_key);
    }

    get_signed_detached(data){
        return nacl.sign.detached(data, this.#secret_key);
    }

    get_identity(){
        return buffer.Buffer.from(this.#public_key);
    }

    get_identity_hex(){
        return buffer.Buffer.from(this.#public_key).toString("hex");
    }

    async get_cert(){
        if(!this.#ephermal_cert){
            throw Error("Local identity not initialized");
        }
        return this.#ephermal_cert.update(this);
    }
}




export default new Identity();
