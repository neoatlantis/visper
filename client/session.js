import io from "socket-io";
import nacl from "tweetnacl";

const buffer = require("buffer");
const events = require("events");
const msgpack = require("msgpack");


class Session extends events.EventEmitter{
    #socket;
    #room_seed = "";
    #room = "";

    #password = "";
    #shared_key;

    constructor(){
        super();
        this.#socket = io("/", {
            reconnection: true,
        });

        this.set_password("");
        this.#socket.on("success", 
            ({ uri, data })=>this.on_success({ uri, data }));
        this.#socket.on("message", (data)=>this.on_message(data));
        this.#socket.on("error", console.error);

        this.#socket.io.on("reconnect", ()=>this.on_reconnect());

    }

    #encrypt(data){
        const s_data = msgpack.serialize(data); // uint8array
        const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
        const encrypted = nacl.secretbox(
            s_data, nonce, this.#get_shared_key());
        return buffer.Buffer.from(
            msgpack.serialize([nonce, encrypted])).toString("base64");
    }

    #decrypt(data){
        try{
            data = new Uint8Array(buffer.Buffer.from(data, "base64"));
            const [nonce, encrypted ] = msgpack.deserialize(data);
            const plaintext = nacl.secretbox.open(
                encrypted, nonce, this.#get_shared_key());
            if(plaintext == null) return null;
            return msgpack.deserialize(plaintext);
        } catch(e){
            console.log(e);
            return null;
        }
    }

    #get_shared_key(){
        /*
         * This shared key is used to encrypt room broadcast messages among
         * members. Members within the same room, and optionally using the
         * same password, may read these messages.
         *
         * To avoid the server knowing this key, we use room_seed instead of
         * room_name = sha256(room_seed), to derive this key. The server will
         * only know this seed's SHA256 value.
         */
        if(this.#shared_key != null) return this.#shared_key;
        this.#shared_key = nacl.hash(new Uint8Array(buffer.Buffer.concat([
            new Uint8Array(buffer.Buffer.from("derive-room-key", "ascii")),
            nacl.hash(buffer.Buffer.from(this.#room_seed, "ascii")),
            nacl.hash(buffer.Buffer.from(this.#password, "ascii")),
        ]))).slice(0, nacl.secretbox.keyLength);
        return this.#shared_key;
    }

    set_password(password){
        this.#password = password;
        this.#shared_key = null;
    }

    #set_room(room_seed){
        this.#room_seed = room_seed;
        this.#room = buffer.Buffer.from(
            nacl.hash(buffer.Buffer.from(room_seed, "ascii"))
        ).toString("hex");
        this.#shared_key = null; // shared key derived with room name,
                                 // erase it when room name change
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

    on_message(server_data){
        let { sender, time, payload } = server_data;
        let data = this.#decrypt(payload);
        if(data == null){
            // failed decryption
            this.emit("interference", { sender ,time });
            return;
        }

        if(data.type == "iff"){
            this.emit("iff", { sender, time, data });
            return;
        }
    }

    #join_room(entry_seed){
        if(!_.isNil(entry_seed)){
            this.#set_room(entry_seed);
        }
        this.#socket.emit("join", { room: this.#room });
    }

    on_reconnect(){
        console.log("reconnected");
        this.#join_room();
    }

    login(entry_seed){
        this.#join_room(entry_seed);
    }


    broadcast_message(data){
        data = this.#encrypt(data);
        this.#socket.emit("message", data);
    }

}

export default new Session();
