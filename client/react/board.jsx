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
  }

  render() {
    return (
      <a style={this.tokenStyle} 
      className={this.tokenClass} 
      role={this.tokenRole}
      onClick={this.props.setFieldValue}>
        {this.props.value}
      </a>
      );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fields: props.fields};
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // not to forget method name
  }

  componentWillUnmount() {
    // not to forget method name
  }

  handleClick(field) {
    var thizz = this;
    return function fun(e) {
      thizz.props.ws.send('move', {player: thizz.props.player, position: field});
    }
  }

  render() {
    return (
      <table>
        <tbody>
          <tr>
            <th><Field value={this.props.fields[0]} setFieldValue={this.handleClick(0)}/></th>
            <th><Field value={this.props.fields[1]} setFieldValue={this.handleClick(1)}/></th>
            <th><Field value={this.props.fields[2]} setFieldValue={this.handleClick(2)}/></th>
          </tr>
          <tr>
            <th><Field value={this.props.fields[3]} setFieldValue={this.handleClick(3)}/></th>
            <th><Field value={this.props.fields[4]} setFieldValue={this.handleClick(4)}/></th>
            <th><Field value={this.props.fields[5]} setFieldValue={this.handleClick(5)}/></th>
          </tr>
          <tr>
            <th><Field value={this.props.fields[6]} setFieldValue={this.handleClick(6)}/></th>
            <th><Field value={this.props.fields[7]} setFieldValue={this.handleClick(7)}/></th>
            <th><Field value={this.props.fields[8]} setFieldValue={this.handleClick(8)}/></th>
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
