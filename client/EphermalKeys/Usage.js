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
        let signingKeys = Keyring.get_latest_private_key_of(
            LocalIdentity.get_identity_hex()
        );

        console.log("params", encryptionKeys, signingKeys);

        let encrypted = await openpgp.encrypt({
            message,
            encryptionKeys,
            signingKeys,
            format: "binary",
        });
        return encrypted;
    }

    async #verify_signatures(signatures){
        let tasks = signatures.map((each)=>each.verified);
        let results = await Promise.all(tasks);
        return results.indexOf(false) < 0;
    }

    async decrypt_and_verify(message, foreign_identity){
        let verificationKeys = Keyring.get_public_keys_of(foreign_identity);
        if(verificationKeys.length < 1){
            console.warning(
                "Failed decrypting incoming message: expected signed.");
            return null;
        }
        let decryptionKeys = Keyring.get_private_keys_of(
            LocalIdentity.get_identity_hex()
        );
        let pgpmessage = await openpgp.readMessage({ binaryMessage: message });
        try{
            let { data: decrypted, signatures } = await openpgp.decrypt({
                message: pgpmessage,
                verificationKeys,
                //expectSigned: true,
                decryptionKeys,
                format: "binary",
            });
            let signature_verification =
                await this.#verify_signatures(signatures);
            if(!signature_verification){
                console.warn("decryption failed: bad signature");
                return null;
            }
            return msgpack.deserialize(decrypted);
        } catch(e){
            console.error("Failed decrypting message", e);
            return null;
        }
    }

}


export default new EphermalKeyUsage();
