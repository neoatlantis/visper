const express = require('express');
const ws = require("ws");
const http = require("http");
const path = require("path");

const is_dev = (process.argv.indexOf("production") >= 0);
const static_path = path.join(__dirname, is_dev?"web-dev":"web");


const app = express();
const port = 1812;

const server = http.createServer(app);
const wsserver = new ws.WebSocketServer({ server });

app.use(express.static(static_path));

server.listen(port);
