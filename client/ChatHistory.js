const events = require("events");

class ChatHistory extends events.EventEmitter{

    constructor(){
        super();

    }

    add(e){
        this.emit("message", e);
    }

}

export default new ChatHistory();
