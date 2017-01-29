// TODO extract module - ?use require.js
class Field extends React.Component {
  constructor(props) {
    super(props);
    this.tokenStyle = {
      width: '100px'
      , height: '100px'
      , display: 'inline-block'
      , backgroundColor: '#eee'
      , margin: '10px'
      , fontSize: '64px'
    }
    this.tokenClass = "text-center";
    this.tokenRole = "button";

    this.wsSendPlayer = this.wsSendPlayer.bind(this);
  }

  wsSendPlayer(evt) {
    this.props.ws.send('move', {player: this.props.player, position: this.props.position});
  }

  render() {
    return (
      <a style={this.tokenStyle} 
      className={this.tokenClass} 
      role={this.tokenRole}
      onClick={this.wsSendPlayer}>
        {this.props.value}
      </a>
      );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // not to forget method name
  }

  componentWillUnmount() {
    // not to forget method name
  }

  render() {
    return (
      <table>
        <tbody>
          <tr>
            <th><Field value={this.props.fields[0]} position={0} player={this.props.player} ws={this.props.ws}/></th>
            <th><Field value={this.props.fields[1]} position={1} player={this.props.player} ws={this.props.ws}/></th>
            <th><Field value={this.props.fields[2]} position={2} player={this.props.player} ws={this.props.ws}/></th>
          </tr>
          <tr>
            <th><Field value={this.props.fields[3]} position={3} player={this.props.player} ws={this.props.ws}/></th>
            <th><Field value={this.props.fields[4]} position={4} player={this.props.player} ws={this.props.ws}/></th>
            <th><Field value={this.props.fields[5]} position={5} player={this.props.player} ws={this.props.ws}/></th>
          </tr>
          <tr>
            <th><Field value={this.props.fields[6]} position={6} player={this.props.player} ws={this.props.ws}/></th>
            <th><Field value={this.props.fields[7]} position={7} player={this.props.player} ws={this.props.ws}/></th>
            <th><Field value={this.props.fields[8]} position={8} player={this.props.player} ws={this.props.ws}/></th>
          </tr>
        </tbody>
      </table>
    );
  }
}

class Ws {
  constructor() {
    this.onTypeCallbacks = {};

    this.onMessageHandler = this.onMessageHandler.bind(this);
    this.insecureFallback = this.insecureFallback.bind(this);

    this.webSocket = new WebSocket("wss://" + window.location.host + "/ws");
    this.webSocket.onerror = function(evt) {
      console.log("Try to connect without ssl");
      this.insecureFallback(evt);
    }.bind(this);

    this.webSocket.onmessage = function(evt) {
      this.onMessageHandler(evt);
    }.bind(this);
  }

  send(type, messageObj) {
    var result;
    if (messageObj) {
      this.webSocket.send(JSON.stringify({
        type
        , message: messageObj
      }))
    } else {
      this.webSocket.send(JSON.stringify({
        type
      }))
    }
  }

  onType(type, callback) {
    this.onTypeCallbacks[type] = callback;
  }

  insecureFallback(evt) {
    var webSocket = new WebSocket("ws://" + window.location.host + "/ws");
    webSocket.onopen = function() {
      console.log("Established webSocket connection. But it aint gonna be secure, bro.");
    };
    // needed as callback
    webSocket.onmessage = function(evt) {
      this.onMessageHandler(evt);
    }.bind(this);
    webSocket.onerror = function(evt) {
      alert("Could not establish websocket connection even without ssl. App will not work. So sorry")
    }.bind(this);
    this.webSocket = webSocket;
  }

  onMessageHandler(msgString) {
    var msg = JSON.parse(msgString.data);
    var typeCallback = this.onTypeCallbacks[msg.type];
    if (typeCallback) {
      typeCallback(msg.message);
    } else {
      console.log(`no callback defined for type ${msg.type}`);
    }
  };
}

class Game extends React.Component {
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
