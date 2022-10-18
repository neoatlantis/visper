const { Server } = require("socket.io");
const SessionHandler = require("./SessionHandler");


module.exports = function(httpserver){
    const io = new Server(httpserver, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });

    io.on("connection", (socket)=>{
        new SessionHandler(io, socket);
    });
}
