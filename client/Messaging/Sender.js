import EphermalKeyUsage from "app/EphermalKeys/Usage";
import IFF from "app/IFF";


class MessagingSender {

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
    }

}

export default new MessagingSender();
