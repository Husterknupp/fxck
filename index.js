var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    expressWs = require('express-ws')(app); // IntelliJ doesnt know its required

/*  ===================
    INSTANCE VARIABLES
    ==================
 */
var gameBoard = [null, null, null, null, null, null, null, null, null];

/*global __dirname:false*/
/*  ====================
    EXPRESS APP SETTINGS
    ====================
 */
app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.listen(app.get("port"), function () { // heroku transparency
    console.log("Node app is running on port", app.get("port"));
});

/*  ========================
    ENDPOINTS AND CONTROLLER
    ========================
 */
app.ws("/ws", function(ws, req) {
    console.log('new websocket connected');
    ws.send(JSON.stringify({type: 'board', message: JSON.stringify(gameBoard)}));
    ws.on('message', function(msgString) {
        var payload = JSON.parse(msgString);
        console.log('incoming: ' + msgString);
        if (payload.type == 'move') {
            gameBoard[payload.message.position] = payload.message.player.toLowerCase();
            var result = {type: 'board', message: JSON.stringify(gameBoard)};
            console.log('outgoing: ' + JSON.stringify(result));
            ws.send(JSON.stringify(result));
            broadcastIfBoardIsFinished(ws);
        }
    });
});
/*
0 1 2
3 4 5
6 7 8
 */
function broadcastIfBoardIsFinished(ws) {
    var isDraw = true;
    var winner = null;
    if (oneLineSame(0, 4, 8)) {
        // diagonal upper left
        winner = gameBoard[0];
    } else if (oneLineSame(2, 4, 6)) {
        // diagonal upper right
        winner = gameBoard[2];

    } else if (oneLineSame(0, 3, 6)) {
        // vertical left
        winner = gameBoard[0];
    } else if (oneLineSame(1, 4, 7)) {
        // vertical middle
        winner = gameBoard[1];
    } else if (oneLineSame(2, 5, 8)) {
        // vertical right
        winner = gameBoard[2];

    } else if (oneLineSame(0, 1, 2)) {
        // horizontal top
        winner = gameBoard[0];
    } else if (oneLineSame(3, 4, 5)) {
        // horizontal middle
        winner = gameBoard[3];
    } else if (oneLineSame(6, 7, 8)) {
        // horizontal bottom
        winner = gameBoard[6];

    } else {
        gameBoard.forEach(function(field) {
            if (field == null) {
                isDraw = false;
            }
        });
    }

    if (winner != null) {
        console.log('winner: ' + winner);
        ws.send(JSON.stringify({type: 'finish', message: winner}));
    } else if (isDraw) {
        console.log('finished: draw');
        ws.send(JSON.stringify({type: 'finish', message: 'draw'}));
    } else {
        console.log('not finished: no winner and still moves left');
    }
}

function oneLineSame(onePos, twoPos, threePos) {
    var one = gameBoard[onePos];
    var two = gameBoard[twoPos];
    var three = gameBoard[threePos];
    return one != null && one == two && two == three;
}
