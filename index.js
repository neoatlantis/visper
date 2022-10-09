const express = require('express');
const http = require("http");
const path = require("path");

const is_dev = (process.argv.indexOf("debug") >= 0);
const static_path = path.join(__dirname, is_dev?"web-dev":"web");


const app = express();
const port = 1812;

const http_server = http.createServer(app);

app.use(express.static(static_path));

require("./server")(http_server);
http_server.listen(port);
