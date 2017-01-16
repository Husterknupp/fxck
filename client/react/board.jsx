class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {fields: []};
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
      <table>
        <tbody>
          <tr>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole} onClick={this.handleClick}>c</a></th>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}></a></th>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}></a></th>
          </tr>
          <tr>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}></a></th>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}></a></th>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}></a></th>
          </tr>
          <tr>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}></a></th>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}></a></th>
            <th><a style={this.tokenStyle} className={this.tokenClass} role={this.tokenRole}></a></th>
          </tr>
        </tbody>
      </table>
    );
  }

  handleClick() {
    console.log('abc');
  }
}

// ReactDOM.render(
//   <Clock />,
//   document.getElementById('root')
// ); 

// function App() {
//   return (
//     <div>
//       <Board />
//     </div>
//   );
// }

ReactDOM.render(
  <Board />,
  document.getElementById('root')
);
