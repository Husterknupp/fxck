import React from 'react';
import Field from './field.jsx';

// TODO rename react -> src
// TODO make it run on heroku
// TODO unit tests?
export default class Board extends React.Component {
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
