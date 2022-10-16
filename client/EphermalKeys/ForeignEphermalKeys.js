/*
A centeralized manager for all foreign ephermal keys.
*/
import Keyring from "./Keyring";
import constants from "app/constants";
const _ = require("lodash");


class ForeignEphermalKeys {

    constructor(){
    }

    remove_identity(identity){
        Keyring.purge_identity(identity);
    }

    async #read_key(key){
        try{
            return await openpgp.readKey({ binaryKey: key, });
        } catch(e){
            return null;
        }
    }

    async register_new_key(identity, key){
        const new_key = await this.#read_key(key);
        if(_.isNil(new_key)) return;

        // Check: user id matches IFF's identification
        const user_id = _.first(new_key.getUserIDs());
        if(!_.startsWith(user_id, identity.slice(0, 32))){
            console.error("Received invalid ephermal key: user id invalid.");
            return;
        }

        console.log("new foreign key", new_key.getFingerprint());
        console.log("primary user", user_id);

        Keyring.add({
            publicKey: new_key,
            identity:  identity,
        })
    }

}

export default new ForeignEphermalKeys();
