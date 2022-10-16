import EphermalKeyUsage from "app/EphermalKeys/Usage";
import IFF from "app/IFF";
import LocalIdentity from "app/IFF/LocalIdentity";
import session from "app/session";


class MessagingSender {

    #broadcast_chat(data){
        session.broadcast_message({
            type: "chat",
            identity: LocalIdentity.get_identity(),
            data,
        });
    }

    async text({ text }){
        let message = {
            type: "text",
            text,
        };
        let target_identities =
            IFF.list_foreign_identities().map((e)=>e.identity);

        let encrypted = await EphermalKeyUsage.encrypt_and_sign(
            message,
            target_identities
        );

        console.log("MESSAGING-SEND", encrypted);
        this.#broadcast_chat(encrypted);
    }

}

export default new MessagingSender();
