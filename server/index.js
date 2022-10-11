const { Server } = require("socket.io");
const SessionHandler = require("./SessionHandler");


module.exports = function(server){
    const io = new Server(server);

    io.on("connection", (socket)=>{
        new SessionHandler(io, socket);
    });
}
