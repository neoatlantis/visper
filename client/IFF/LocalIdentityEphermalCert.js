import nacl from "tweetnacl";
import EphermalKeys from "app/EphermalKeys";
import TimedMap from "app/lib/TimedMap";

const buffer = require("buffer");
const _ = require("lodash");
const events = require("events");
const msgpack = require("msgpack");


class LocalIdentityEphermalCert extends events.EventEmitter{

    #certs;

    constructor(){
        super();
        this.#certs = new TimedMap(30, 3);
    }

    async update(local_identity){
        let current_prerecord = this.#certs.current();
        if(current_prerecord) return current_prerecord;

        let newest_ephermal_public_key =
            await EphermalKeys.Local.get_newest_key();

        const cert_payload = msgpack.serialize({
            identity: local_identity.get_identity(),
            ephermal: newest_ephermal_public_key,
        });
        const cert_signature = local_identity.get_signed_detached(cert_payload);
        const cert = msgpack.serialize({
            payload: cert_payload,
            signature: cert_signature,
        });

        this.#certs.set(cert);

        return cert;
    }

}

export default LocalIdentityEphermalCert;
