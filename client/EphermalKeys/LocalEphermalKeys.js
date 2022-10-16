import * as openpgp from "openpgp";
import Keyring from "./Keyring";
import TimedMap from "app/lib/TimedMap";
import LocalIdentity from "app/IFF/LocalIdentity";
import constants from "app/constants";
const _ = require("lodash");


class LocalEphermalKeys {

    constructor(){}

    async get_latest_key(){
        function serialize_key(key){
            return key.write();
        }

        let local_identity = LocalIdentity.get_identity_hex();
        let latest_key = Keyring.get_latest_public_key_of(local_identity);
        if(!_.isNil(latest_key)) return serialize_key(latest_key);

        const local_identity_truncated = local_identity.slice(0, 32);

        const { privateKey, publicKey } = await openpgp.generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [ { name: local_identity_truncated }],
            format: 'object',
            keyExpirationTime: constants.EPHERMAL_KEY_LIFE,
        });

        Keyring.add({ publicKey, privateKey, identity: local_identity });
        return serialize_key(publicKey);
    }
}


export default new LocalEphermalKeys();
