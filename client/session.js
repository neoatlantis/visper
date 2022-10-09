import io from "socket-io";
import nacl from "tweetnacl";

const buffer = require("buffer");
const events = require("events");


class Session extends events.EventEmitter{
    #socket;
    #room;

    constructor(){
        super();
        this.#socket = io();

        this.#socket.on("success", 
            ({ uri, data })=>this.on_success({ uri, data }));

        this.#socket.on("message", (data)=>this.on_message(data));
    }

    on_success({ uri, data }){
        console.log("success", uri, data);
        switch(uri){
            case "room.joined":
                this.on_success_room_joined(data); break;
            default:
        }
    }

    on_success_room_joined(data){
        this.emit("logged-in");
    }

    on_message(data){
        console.log("on message", data);
    }

    login(entry_seed){
        if(!_.isNil(entry_seed)){
            let room = 
                buffer.Buffer.from(
                    nacl.hash(buffer.Buffer.from(entry_seed, "ascii"))
                ).toString("hex");
            this.#room = room;
        }
        this.#socket.emit("join", { room: this.#room });

        setInterval(()=>{
            this.#socket.emit("message", { "test": new Date().getTime() });
        }, 1000);
    }

}

export default new Session();
