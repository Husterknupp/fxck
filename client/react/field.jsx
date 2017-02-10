import React from 'react';

export default class Field extends React.Component {
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
