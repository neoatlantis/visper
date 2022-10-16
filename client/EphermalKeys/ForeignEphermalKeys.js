/*
A centeralized manager for all foreign ephermal keys.
*/
import * as openpgp from "openpgp";
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
            console.error(e);
            return null;
        }
    }

    async register_new_key(identity, key){
        console.log("register_new_key #1");

        const new_key = await this.#read_key(key);
        if(_.isNil(new_key)) return;

        // Check: user id matches IFF's identification
        const user_id = _.first(new_key.getUserIDs());
        if(!_.startsWith(user_id, identity.slice(0, 32))){
            console.error("Received invalid ephermal key: user id invalid.");
            return;
        }

        // get creation time
        const creation_time = new_key.getCreationTime();

        console.log("new foreign key", new_key.getFingerprint());
        console.log("primary user", user_id);

        Keyring.add({
            publicKey: new_key,
            identity:  identity,
            time: creation_time,
        });


    }

}

export default new ForeignEphermalKeys();
