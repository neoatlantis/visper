import EphermalKeyUsage from "app/EphermalKeys/Usage";
import IFF from "app/IFF";
import LocalIdentity from "app/IFF/LocalIdentity";
import session from "app/session";
import chat_history from "app/ChatHistory";

const events = require("events");


class MessagingSender extends events.EventEmitter {

    constructor(){
        super();
    }

    async #broadcast_chat(chatdata){
        const identity = LocalIdentity.get_identity();
        const identity_hex = LocalIdentity.get_identity_hex();

        let target_identities =
            IFF.list_foreign_identities().map((e)=>e.identity);
        let encrypted = await EphermalKeyUsage.encrypt_and_sign(
            chatdata,
            target_identities
        );
        session.broadcast_message({
            type: "chat",
            identity: LocalIdentity.get_identity(),
            data: encrypted,
        });
        console.log("CHAT/OUTGOING", encrypted);

        chat_history.add({
            data: chatdata,
            identity: identity_hex,
            time: new Date(),
            is_self: true,
        });

        chat_history.emit("sent");

    }

    async text({ text }){
        return await this.#broadcast_chat({ type: "text", text });
    }

}

export default new MessagingSender();
