import * as openpgp from "openpgp";
import Keyring from "./Keyring";
import TimedMap from "app/lib/TimedMap";
import LocalIdentity from "app/IFF/LocalIdentity";
import constants from "app/constants";
const _ = require("lodash");



const key_period = constants.EPHERMAL_KEY_ROTATION_PERIOD * 1000;


class LocalEphermalKeys {

    constructor(){
        setTimeout(()=>{
            LocalIdentity.on("created", ()=>{
                this.#drop_old_local_identity();
            })
        }, 1);
    }

    current_period(){
        return Math.floor(new Date().getTime() / key_period);
    }

    period_start(p){
        return p * key_period;
    }

    async #get_private_key_for_period(period){
        const starttime = this.period_start(period);
        const all_private_keys = Keyring.get_private_keys();
        let matching_keys = [];
        all_private_keys.forEach((private_key)=>{
            let ctime = private_key.getCreationTime().getTime();
            if(ctime <= starttime && starttime < ctime+key_period){
                matching_keys.push(private_key);
            }
        });
        if(_.size(matching_keys) > 0) return _.first(matching_keys);

        let { publicKey, privateKey } = await this.#create_key(starttime);
        return privateKey;
    }

    async #drop_old_local_identity(){
        Keyring.empty_private_keys();
    }

    async #create_key(starttime){
        let local_identity = LocalIdentity.get_identity_hex();
        const local_identity_truncated = local_identity.slice(0, 32);

        const { privateKey, publicKey } = await openpgp.generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [ { name: local_identity_truncated }],
            format: 'object',
            keyExpirationTime: constants.EPHERMAL_KEY_LIFE,
            date: new Date(starttime),
        });

        Keyring.add({ publicKey, privateKey, identity: local_identity });
        return { publicKey, privateKey };
    }

    async get_current_public_key(){
        let pkey = await this.#get_private_key_for_period(this.current_period());
        return pkey.toPublic().write();
    }

    async get_next_public_key(){
        let pkey = await this.#get_private_key_for_period(
            this.current_period() + 1);
        return pkey.toPublic().write();
    }
}


export default new LocalEphermalKeys();
