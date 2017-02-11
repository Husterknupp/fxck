import React from 'react';
import Board from './board.jsx';
import Ws from './ws'

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        null, null, null
        , null, null, null
        , null, null, null
      ]
      , notification: "eat more laal mirtsch"
      , player: ''
    };

    this.setPlayer = this.setPlayer.bind(this);
    this.resetBoard = this.resetBoard.bind(this);

    this.webSocket = new Ws();
    this.webSocket.onType("board", (fields) => {this.setState({fields})});
    this.webSocket.onType("finish", (player) => {this.setState({notification: `winner is ${player}`})});
  }

  setPlayer(evt) {
    this.setState({player: evt.target.value});
  }

  resetBoard() {
    this.webSocket.send('reset');
    this.setState({notification: 'next round, bro'});
  }

  render() {
    return (
      <div>
        <Board fields={this.state.fields} player={this.state.player} ws={this.webSocket} />
        <input type='text' placeholder='🍭' value={this.state.player} onChange={this.setPlayer} />
        <div>
          <button onClick={this.resetBoard}>Reset Board</button>
        </div>
        <div>{this.state.notification}</div>
      </div>
      );
  }
}
