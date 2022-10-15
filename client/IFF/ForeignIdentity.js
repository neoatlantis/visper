import LocalIdentity from "./LocalIdentity";
const _ = require("lodash");

const INACTIVITY_START = 1000 * 5;
const INACTIVITY_TIMEOUT = 1000 * 59;

class ForeignIdentity{

    #identity;
    #ephermal;
    #sequence0;
    #sequence;
    #last_seen;

    constructor(identity){
        this.#identity = identity;
        this.#ephermal = null;
        this.#sequence0 = null;
        this.#sequence = 0;
        this.#last_seen = new Date();
        this.inactive_count = 0;
        this.inactive = false;
    }

    display(){
        this.recalculate();
        return {
            identity: this.#identity,
            sequence: this.#sequence - this.#sequence0,
            inactive_countdown: this.inactive_count >= INACTIVITY_START,
            inactive_count: this.inactive_count,
            inactive: this.inactive,
        }
    }

    recalculate(){
        const now = new Date().getTime();
        this.inactive_count = now - this.#last_seen.getTime();
        this.inactive = this.inactive_count > INACTIVITY_TIMEOUT;
    }

    update_cert(cert){
        // Take the new cert and use it. Returns true if success.
        // TODO verify validity
        if(!cert.verify()) return false; // likely duplicated, safety first?

        if(cert.get_sequence() > this.#sequence){
            this.#sequence = cert.get_sequence();
            if(this.#sequence0 === null) this.#sequence0 = this.#sequence;
            this.#ephermal = cert.get_ephermal();
            this.update_keys();
        }
        return true;
    }

    update({
        cert, // -> ForeignIdentityEphermalCert()
        time
    }){
        if(!this.update_cert(cert)) return;
        const now = new Date().getTime();
        const last_seen = new Date(
            _.min([ // no later than system time
                now,
                _.max([ // no earlier than previous registered last seen
                    this.#last_seen.getTime(),
                    time
                ])
            ])
        );
        this.#last_seen = last_seen;
    }

    update_keys(){
        /*const newkeys = LocalIdentity.pair_with_key(this.#ephermal);
        console.log(
            "ForeignIdentity",
            `new keys for ${this.#identity}:`,
            newkeys
        );*/
    }
}

export default ForeignIdentity;
