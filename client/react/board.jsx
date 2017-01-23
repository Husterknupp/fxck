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

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}>{this.props.value}</a>
      );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <table>
        <tbody>
          <tr>
            <th><Field value={this.props.fields[0]}/></th>
            <th><Field value={this.props.fields[1]}/></th>
            <th><Field value={this.props.fields[2]}/></th>
          </tr>
          <tr>
            <th><Field value={this.props.fields[3]}/></th>
            <th><Field value={this.props.fields[4]}/></th>
            <th><Field value={this.props.fields[5]}/></th>
          </tr>
          <tr>
            <th><Field value={this.props.fields[6]}/></th>
            <th><Field value={this.props.fields[7]}/></th>
            <th><Field value={this.props.fields[8]}/></th>
          </tr>
        </tbody>
      </table>
    );
  }

  handleClick() {
    console.log('abc');
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: this.getNulledArray()
      , notification: "laal mirtsch"
      , player: ''
    };

    this.setPlayer = this.setPlayer.bind(this);

    // todo extract into wrapper class
    this.webSocket = new WebSocket("wss://" + window.location.host + "/ws");
    var that = this;
    this.webSocket.onerror = function(event) {
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
        this.webSocket = webSocket;
    };

    this.webSocket.onmessage = function(evt) {
      that.onMessageHandler(evt);
    };
  }

  onMessageHandler (msgString) {
    var msg = JSON.parse(msgString.data);
    if (msg.type == "board") {
      this.setState({fields: msg.message});
    } else if (msg.type == "finish") {
      this.setState({notification: msg.message});
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

  /* TODO
  - have button with ws send
   */
  render() {
    return (
      <div>
        <Board fields={this.state.fields}/>
        <input type='text' placeholder='🍭' value={this.state.player} onChange={this.setPlayer}></input>
        <div>{this.state.notification}</div>
      </div>
      );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
