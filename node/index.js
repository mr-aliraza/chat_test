'use strict';

let express = require('express');
let http = require('http');
let ws = require('ws');
let url = require('url');
let PORT = process.env.PORT || 3000;
let app = express();

let server = http.Server(app);

server.listen(PORT, () => console.log(`Client Listening on ${PORT}`));

let wssClient = new ws.Server({
    server: server,
    path: '/client'
});

function noop() {
}

function heartbeat() {
    this.isAlive = true;
}

const clientInterval = setInterval(function ping() {
    wssClient.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

let userSockets = {};

wssClient.on('connection', (socket, request) => {
    socket.isAlive = true;
    socket.on('pong', heartbeat);
    const parameters = url.parse(request.url, true);
    const userId = parameters.query.user_id;
    userSockets[userId] = socket;
    console.log("Connection established for user " + userId)
});

app.get('/new/:message', (req, res) => {
    const msg = JSON.parse(req.params.message);
    let userId = msg.user_id;
    let socket = userSockets[userId];
    if (typeof (socket) !== "undefined") {
        JSON.stringify(msg);
        socket.send(JSON.stringify(msg))
    }
    res.send("")
});

// app.get('/new/:user_id&:message', (req, res) => {
//     let userId = req.params.user_id;
//     console.log('userId' + userId);
//     let socket = userSockets[userId];
//     console.log('socket: ' + socket);
//     if (typeof (socket) !== "undefined") {
//         socket.send('')
//     }
//     res.send("")
// });