import * as openpgp from "openpgp";
import Keyring from "./Keyring";
import TimedMap from "app/lib/TimedMap";
import LocalIdentity from "app/IFF/LocalIdentity";
import constants from "app/constants";
const _ = require("lodash");


class LocalEphermalKeys {

    constructor(){}

    async decrypt_and_verify(message, foreign_identity){
        let verificationkeys = Keyring.get_public_keys_of(foreign_identity);
        if(verificationKeys.length < 1){
            console.warning(
                "Failed decrypting incoming message: expected signed.");
            return null;
        }

        let decryptionKeys = Keyring.get_private_keys_of(
            LocalIdentity.get_identity_hex()
        );
        try{
            let message = await openpgp.decrypt({
                message: await openpgp.readMessage({
                    binaryMessage: message,
                }),
                verificationKeys,
                expectSigned: true,
                decryptionKeys,
                format: "binary",
            });
            return message;
        } catch(e){
            console.error("Failed decrypting message", e);
            return null;
        }
    }

    async get_latest_key(){
        let local_identity = LocalIdentity.get_identity_hex();
        let latest_key = Keyring.get_latest_public_key_of(local_identity);
        if(!_.isNil(latest_key)) return latest_key;

        const local_identity_truncated = local_identity.slice(0, 32);

        const { privateKey, publicKey } = await openpgp.generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [ { name: local_identity_truncated }],
            format: 'binary',
            keyExpirationTime: constants.EPHERMAL_KEY_LIFE,
        });

        Keyring.add({ publicKey, privateKey, identity: local_identity });
        return publicKey;
    }
}


export default new LocalEphermalKeys();
