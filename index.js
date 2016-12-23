var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    expressWs = require('express-ws')(app); // IntelliJ doesnt know its required

/*global __dirname:false*/
/*  ====================
    EXPRESS APP SETTINGS
    ====================
 */
app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));
app.listen(app.get("port"), function () { // heroku transparency
    console.log("Node app is running on port", app.get("port"));
});

/*  ===================
 INSTANCE VARIABLES
 ==================
 */
var gameBoard = [];
resetBoard = function() {
    gameBoard = [null, null, null, null, null, null, null, null, null];
};
resetBoard();
var nullToken = null;

/*  ========================
    ENDPOINTS AND CONTROLLER
    ========================
 */
board = function() {
    return {type: 'board', message: gameBoard};
};

app.ws("/ws", function(ws, req) {
    console.log('new websocket connected');
    ws.send(JSON.stringify(board()));
    ws.on('message', function(msgString) {
        var payload = JSON.parse(msgString);
        console.log('incoming: ' + msgString);
        if (payload.type == 'move') {
            gameBoard[payload.message.position] = payload.message.player.toLowerCase();
            var b = board();
            console.log('outgoing: ' + JSON.stringify(b));
            sendStringToAllClients(JSON.stringify(b));
            broadcastIfBoardIsFinished();
        } else if (payload.type == 'reset') {
            console.log('board empty now');
            resetBoard();
            sendStringToAllClients(JSON.stringify(board()));
        }
    });
});

/*
0 1 2
3 4 5
6 7 8
 */
function broadcastIfBoardIsFinished() {
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
            if (field == nullToken) {
                isDraw = false;
            }
        });
    }

    if (winner != null) {
        console.log('winner: ' + winner);
        sendStringToAllClients(JSON.stringify({type: 'finish', message: winner}));
    } else if (isDraw) {
        console.log('finished: draw');
        sendStringToAllClients(JSON.stringify({type: 'finish', message: 'draw'}));
    } else {
        console.log('not finished: no winner and still moves left');
    }
}

function oneLineSame(onePos, twoPos, threePos) {
    var one = gameBoard[onePos];
    var two = gameBoard[twoPos];
    var three = gameBoard[threePos];
    return one != nullToken && one == two && two == three;
}

function sendStringToAllClients(leMessage) {
    expressWs.getWss('/ws').clients.forEach(function(ws) {
        ws.send(leMessage);
    });
}
