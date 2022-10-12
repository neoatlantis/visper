/*
 * Identification of Friend and Foreigner
 * ======================================
 *
 * This module is a security display for user. It maintains records on peers
 * joined in this chat and their public keys.
 */

import LocalIdentity from "app/crypto/identity";
import ForeignIdentity from "./ForeignIdentity";
import session from "app/session";

const events = require("events");



class IFF extends events.EventEmitter {

    #foreign_identities;

    constructor(identity){
        super();

        this.#foreign_identities = new Map();

        setInterval(()=>this.broadcast(), 2000);
        session.on("iff", (data)=>this.receive(data));
        session.on("interference", ()=>this.emit("interference"));
    }

    set_password(p){
        session.set_password(p);
    }

    receive({ sender, data, time }){
        this.read_broadcast(data);
        this.emit("received");
    }

    broadcast(){
        session.broadcast_message({
            type: "iff",
            identity: LocalIdentity.get_public_key(),
        });
        this.emit("broadcasted");
    }

    read_broadcast({ identity }){
        if(identity == LocalIdentity.get_public_key()){
            return;
        }
        if(!this.#foreign_identities.has(identity)){
            this.#foreign_identities.set(
                identity, new ForeignIdentity(identity));
        }
        // update identity entry
        this.#foreign_identities.get(identity).update({
        });
    }

    list_foreign_identities(){
        let ret = [];
        this.#foreign_identities.forEach(
            (identity)=>ret.push(identity.display()));
        return ret;
    }
}

export default new IFF();
