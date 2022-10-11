/*
 * Identification of Friend and Foreigner
 * ======================================
 *
 * This module is a security display for user. It maintains records on peers
 * joined in this chat and their public keys.
 */

import identity from "app/crypto/identity";
import session from "app/session";
const events = require("events");

class IFF extends events.EventEmitter {

    constructor(identity){
        super();

        setInterval(()=>this.broadcast(), 2000);
        session.on("iff", (data)=>this.receive(data));
        session.on("interference", ()=>this.emit("interference"));
    }

    set_password(p){
        session.set_password(p);
    }

    receive(data){
        this.emit("received");
    }

    broadcast(){
        session.broadcast_message({
            type: "iff",
            identity: identity.get_public_key(),
        });
        this.emit("broadcasted");
    }

}

export default new IFF();
