"use strict";

class Board {
    constructor(rowCount, lineCount){
        this.rowCount = rowCount;
        this.lineCount = lineCount;
	    this.nullToken = null;
	    this.reset();
    }

    /**
     * @return undefined
     */
    reset() {
    	this.fields = [];
        for (var i = 0; i < this.rowCount; i++) {
       		for (var j = 0; j < this.lineCount; j++) {
       			this.fields.push(null);
       		}
	    }
    }

    /**
     * @return {String}
     */
    asWebsocketMessage() {
    	return JSON.stringify({type: 'board', message: this.fields});
    }

    /**
     * @param {String}
     * @param {Number}
     * @return {Object} [Result holding the status of the match after this move and the winner if any]
     */
    setField(player, position) {
    	this.fields[position] = player;
    	return this.winnerIfAny();
    }

    winnerIfAny() {
	    var isDraw = true;
	    var winner = null;
	    if (this.oneLineSame(0, 4, 8)) {
	        // diagonal upper left
	        winner = this.fields[0];
	    } else if (this.oneLineSame(2, 4, 6)) {
	        // diagonal upper right
	        winner = this.fields[2];

	    } else if (this.oneLineSame(0, 3, 6)) {
	        // vertical left
	        winner = this.fields[0];
	    } else if (this.oneLineSame(1, 4, 7)) {
	        // vertical middle
	        winner = this.fields[1];
	    } else if (this.oneLineSame(2, 5, 8)) {
	        // vertical right
	        winner = this.fields[2];

	    } else if (this.oneLineSame(0, 1, 2)) {
	        // horizontal top
	        winner = this.fields[0];
	    } else if (this.oneLineSame(3, 4, 5)) {
	        // horizontal middle
	        winner = this.fields[3];
	    } else if (this.oneLineSame(6, 7, 8)) {
	        // horizontal bottom
	        winner = this.fields[6];
	    } else {
	    	var n_llToken = this.nullToken;
	        this.fields.forEach(function(field) {
	            if (field == n_llToken) {
	                isDraw = false;
	            }
	        });
	    }

	    if (winner != null) {
	    	// todo move logs outside
	        console.log('winner: ' + winner);
	        return {status: 'finished', winner: winner};
	    } else if (isDraw) {
	        console.log('finished: draw');
	        return {status: 'finished', winner: 'draw'};
	    } else {
	        console.log('not finished: no winner and still moves left');
	        return {status: 'not finished'};
	    }
	}

	oneLineSame(onePos, twoPos, threePos) {
	    var one = this.fields[onePos];
	    var two = this.fields[twoPos];
	    var three = this.fields[threePos];
	    return one != this.nullToken && one == two && two == three;
	}
}

module.exports = {Board};
