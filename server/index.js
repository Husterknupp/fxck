var express = require("express")
    , app = express()
    , bodyParser = require("body-parser")
    , expressWs = require('express-ws')(app) // IntelliJ doesnt know its required
    , Board = require("./board").Board;

/*global __dirname:false*/
/*  ====================
    EXPRESS APP SETTINGS
    ====================
 */
app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/dist/'));
app.listen(app.get("port"), function () { // heroku transparency
    console.log("Node app is running on port", app.get("port"));
});

/* 
 ===================
 INSTANCE VARIABLES
 ==================
 */
var board = new Board(3, 3);

/*  ========================
    ENDPOINTS AND CONTROLLER
    ========================
 */
app.ws("/ws", function(ws, req) {
    console.log('new websocket connected');
    console.log('outgoing: ' + board.asWebsocketMessage());
    ws.send(board.asWebsocketMessage());
    ws.on('message', function(msgString) {
        var payload = JSON.parse(msgString);
        console.log('incoming: ' + msgString);
        if (payload.type == 'move') {
            var result = board.setField(payload.message.player.toLowerCase(), payload.message.position);
            if (result.status == 'finished') {
                sendStringToAllClients(JSON.stringify({type: 'finish', message: result.winner}));
            }
            console.log('outgoing: ' + board.asWebsocketMessage());
            sendStringToAllClients(board.asWebsocketMessage());
        } else if (payload.type == 'reset') {
            board.reset();
            console.log('board empty now');
            sendStringToAllClients(board.asWebsocketMessage());
        }
    });
});

function sendStringToAllClients(leMessage) {
    expressWs.getWss('/ws').clients.forEach(function(ws) {
        ws.send(leMessage);
    });
}
