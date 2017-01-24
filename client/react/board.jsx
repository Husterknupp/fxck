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
      thizz.props.ws.send(JSON.stringify({
        type: 'move', 
        message: {player: thizz.props.player, position: field}
      }));
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: this.getNulledArray()
      , notification: "eat more laal mirtsch"
      , player: ''
      , webSocket: {}
    };

    this.setPlayer = this.setPlayer.bind(this);
    this.resetBoard = this.resetBoard.bind(this);

    // TODO extract into wrapper class
    this.state.webSocket = new WebSocket("wss://" + window.location.host + "/ws");
    var that = this;
    this.state.webSocket.onerror = function(event) {
        console.log("webSocket error. Try to connect without ssl");
        
        var webSocket = new WebSocket("ws://" + window.location.host + "/ws");
        webSocket.onopen = function() {
          console.log("Established webSocket connection. But it aint gonna be secure, bro.");
        };
        // needed as callback
        webSocket.onmessage = function(evt) {
          that.onMessageHandler(evt);
        };
        webSocket.onerror = function(event) {
            alert("Could not establish websocket connection even without ssl. App will not work. So sorry")
        };
        that.state.webSocket = webSocket;
    };

    this.state.webSocket.onmessage = function(evt) {
      that.onMessageHandler(evt);
    };
  }

  onMessageHandler (msgString) {
    var msg = JSON.parse(msgString.data);
    if (msg.type == "board") {
      this.setState({fields: msg.message});
    } else if (msg.type == "finish") {
      this.setState({notification: 'winner is ' + msg.message});
    } else {
      // nothing
    }
  };

  getNulledArray() {
    return [
        null, null, null
        , null, null, null
        , null, null, null
      ];
  }

  setPlayer(evt) {
    this.setState({player: evt.target.value});
  }

  resetBoard() {
    this.state.webSocket.send(JSON.stringify({type: 'reset'}));
  }

  render() {
    return (
      <div>
        <Board fields={this.state.fields} player={this.state.player} ws={this.state.webSocket} />
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
