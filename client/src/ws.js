export default class Ws {
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
