import EphermalKeyUsage from "app/EphermalKeys/Usage";
import IFF from "app/IFF";
import session from "app/session";
import chat_history from "app/ChatHistory";

const _ = require("lodash");
const buffer = require("buffer");

const events = require("events");

class MessagingReceiver extends events.EventEmitter {

    constructor(){
        super();
        const self = this;
        session.on("chat", (e)=>self.#decrypt(e).then(self.#handle));
    }

    async #decrypt({ data: packet, sender, time }){
        let { data, identity } = packet; // data -> PGP encrypted message
        console.log(packet);
        let foreign_identity = buffer.Buffer.from(identity).toString("hex");
        try{
            let result = await EphermalKeyUsage.decrypt_and_verify(
                data, foreign_identity);
            return { packet: result, identity };
        } catch(e){
            console.error("INCOMING-CHAT", "Decryption failure.", e);
            return;
        }
    }

    async #handle({ packet, identity }){
        if(_.isNil(packet)) return;
        const identity_hex = buffer.Buffer.from(identity).toString("hex");

        chat_history.add({
            data: packet,
            identity: identity_hex,
            time: new Date(), // TODO use server time or signed time
            is_self: false,
        });

    }

}

export default new MessagingReceiver();
