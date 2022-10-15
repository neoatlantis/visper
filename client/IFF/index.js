/*
 * Identification of Friend and Foreigner
 * ======================================
 *
 * This module is a security display for user. It maintains records on peers
 * joined in this chat and their public keys.
 */


import LocalIdentity from "./LocalIdentity";
import ForeignIdentity from "./ForeignIdentity";
import ForeignIdentityEphermalCert from "./ForeignIdentityEphermalCert";
import session from "app/session";

const events = require("events");
const _ = require("lodash");




class IFF extends events.EventEmitter {

    #foreign_identities;

    constructor(identity){
        super();

        this.#foreign_identities = new Map();

        setInterval(()=>this.broadcast(), 2000);
        session.on("iff", (data)=>this.receive(data));
        session.on("interference", ()=>this.emit("interference"));

        setInterval(()=>this.refresh(), 1000);
    }

    set_password(p){
        session.set_password(p);
    }

    receive({ sender, data, time }){
        this.read_broadcast({ sender, data, time });
        this.emit("received");
    }

    async broadcast(){
        session.broadcast_message({
            type: "iff",
            cert: await LocalIdentity.get_cert(),
        });
        this.emit("broadcasted");
    }

    read_broadcast({ sender, time, data }){
        const cert = new ForeignIdentityEphermalCert(
            _.get(data, "cert", null));
        const identity_hex = cert.get_identity_hex();
        if(identity_hex == LocalIdentity.get_identity_hex()){
            return;
        }
        console.debug("Cert broadcast: RECV", data);
        if(!cert.verify()){
            this.emit("interference");
            return;
        }
        console.debug("Remote cert self signature verified.");
        if(!this.#foreign_identities.has(identity_hex)){
            this.#foreign_identities.set(
                identity_hex, new ForeignIdentity(identity_hex));
        }
        // update identity entry
        this.#foreign_identities.get(identity_hex).update({
            time,
            cert,
        });
    }

    list_foreign_identities(){
        let ret = [];
        this.#foreign_identities.forEach(
            (identity)=>ret.push(identity.display()));
        return ret;
    }


    refresh(){
        // remove inactive foreign identities
        let inactive_keys = [];
        this.#foreign_identities.forEach((identity, identity_key)=>{
            if(identity.inactive) inactive_keys.push(identity_key);
        });
        inactive_keys.forEach((k)=>this.#foreign_identities.delete(k));
    }
}

export default new IFF();
