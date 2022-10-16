import EphermalKeyUsage from "app/EphermalKeys/Usage";
import IFF from "app/IFF";
import session from "app/session";
const _ = require("lodash");
const buffer = require("buffer");

class MessagingReceiver {

    constructor(){
        session.on("chat", (e)=>this.#decrypt(e).then(this.#handle));
    }

    async #decrypt({ data: packet, sender, time }){
        let { data, identity } = packet; // data -> PGP encrypted message
        console.log(packet);
        let foreign_identity = buffer.Buffer.from(identity).toString("hex");
        try{
            let result = await EphermalKeyUsage.decrypt_and_verify(
                data, foreign_identity);
            return result;
        } catch(e){
            console.error("INCOMING-CHAT", "Decryption failure.", e);
            return;
        }
    }

    async #handle(packet){
        if(_.isNil(packet)) return;
        console.log("INCOMING-CHAT", "decrypted", packet);

    }

}

export default new MessagingReceiver();
