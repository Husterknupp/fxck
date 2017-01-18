// TODO extract module - ?use webpack
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
    this.state = {fields: this.getNulledArray()};
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

  getNulledArray() {
    return [
        null, null, null
        , null, null, null
        , null, null, null
      ];
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
            <th><Field value={this.state.fields[0]}/></th>
            <th><Field value={this.state.fields[1]}/></th>
            <th><Field value={this.state.fields[2]}/></th>
          </tr>
          <tr>
            <th><Field value={this.state.fields[3]}/></th>
            <th><Field value={this.state.fields[4]}/></th>
            <th><Field value={this.state.fields[5]}/></th>
          </tr>
          <tr>
            <th><Field value={this.state.fields[6]}/></th>
            <th><Field value={this.state.fields[7]}/></th>
            <th><Field value={this.state.fields[8]}/></th>
          </tr>
        </tbody>
      </table>
    );
  }

  handleClick() {
    console.log('abc');
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);
