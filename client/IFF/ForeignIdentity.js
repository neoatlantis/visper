const _ = require("lodash");

const INACTIVITY_START = 1000 * 5;
const INACTIVITY_TIMEOUT = 1000 * 59;

class ForeignIdentity{

    #identity;
    #last_seen;

    constructor(identity){
        this.#identity = identity;
        this.#last_seen = new Date();
        this.inactive_count = 0;
        this.inactive = false;
    }

    display(){
        this.recalculate();
        return {
            identity: this.#identity,
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

    update({ identity, time }){
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

}

export default ForeignIdentity;
