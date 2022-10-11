const _ = require("lodash");

class SessionHandler {
    #io;
    #socket;
    #room;

    constructor(io, socket){
        this.#io = io;
        this.#socket = socket;
        this.#room = null;

        this.#socket.on("join", (data)=>this.on_join(data));
        this.#socket.on("ping", ()=>this.on_ping());
        this.#socket.on("message", (data)=>this.on_message(data));

        this.#socket.on("error", ()=>this.shutdown());
        this.#socket.on("disconnect", ()=>this.shutdown());

        console.log(`Socket #${this.#socket.id} connected.`);
    }

    shutdown(){
        console.log(`Socket #${this.#socket.id} disconnected.`);
        this.#socket.removeAllListeners();
        this.#socket = null;
    }

    failure(uri, reason){
        // avoid conflict with "error"
        this.#socket.emit("failure", {
            uri, reason
        });
    }

    success(uri, data){
        this.#socket.emit("success", {
            uri, data
        });
    }

    on_ping(){
        this.#socket.emit("pong");
    }

    on_join(data){
        if(_.size(this.#socket.rooms) > 2){
            this.failure("room.already-joined", "");
            return;
        }
        let room = _.get(data, "room");
        if(_.isString(room) && /^[0-9a-f]{64,128}$/.test(room)){
            this.#socket.join(room);
            this.#room = room;
            this.success("room.joined", { room });
        } else {
            this.failure("room.invalid-name");
        }
    }

    on_message(data){
        if(!this.#room){
            this.failure("message.unauthorized");
            return;
        }
        if(!_.isPlainObject(data)){
            this.failure("message.invalid");
            return;
        }
        data._sender = this.#socket.id;
        data._time = new Date().getTime();
        this.#io.to(this.#room).emit("message", data);
    }

}

module.exports = SessionHandler;
