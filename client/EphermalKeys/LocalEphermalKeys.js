import * as openpgp from "openpgp";
import LocalIdentity from "app/IFF/LocalIdentity";
const _ = require("lodash");


class LocalEphermalKeys {

    #keypairs;

    constructor(){
        this.#keypairs = new Map();

    }

    async get_newest_key(){
        const seq = Math.floor(new Date().getTime() / 30000);
        if(this.#keypairs.has(seq)){
            return _.get(
                this.#keypairs.get(seq),
                "publicKey",
                null
            );
        }

        const local_identity_truncated =
            LocalIdentity.get_identity_hex().slice(0, 32);
        const { privateKey, publicKey } = await openpgp.generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [ { name: local_identity_truncated }],
            format: 'binary',
            keyExpirationTime: 300,
        });
        console.log("new pgp keypair", privateKey, publicKey);

        this.#keypairs.set(seq, {
            privateKey,
            publicKey,
        });

        return publicKey;
    }
}


export default new LocalEphermalKeys();
