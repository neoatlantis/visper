import * as openpgp from "openpgp";
import Keyring from "./Keyring";
import TimedMap from "app/lib/TimedMap";
import LocalIdentity from "app/IFF/LocalIdentity";
import constants from "app/constants";
const _ = require("lodash");
const msgpack = require("msgpack");


class EphermalKeyUsage {


    async encrypt_and_sign(message, target_identities){
        message = await openpgp.createMessage({
            binary: msgpack.serialize(message),
        });

        let encryptionKeys = Keyring
            .filter(({ identity })=>{
                return target_identities.indexOf(identity) >= 0
            })
            .map((key)=>key.publicKey);
        let signingKey = Keyring.get_latest_private_key_of(
            LocalIdentity.get_identity_hex()
        );

        let encrypted = await openpgp.encrypt({
            message,
            encryptionKeys,
            signingKey,
            format: "binary",
        });
        return encrypted;
    }

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
            return msgpack.deserialize(message);
        } catch(e){
            console.error("Failed decrypting message", e);
            return null;
        }
    }

}


export default new EphermalKeyUsage();
