import React from 'react';
import Field from './field.jsx';

// TODO unit tests?
export default function Board(props) {
    return (
      <table>
        <tbody>
          <tr>
            <th><Field value={props.fields[0]} position={0} player={props.player} ws={props.ws}/></th>
            <th><Field value={props.fields[1]} position={1} player={props.player} ws={props.ws}/></th>
            <th><Field value={props.fields[2]} position={2} player={props.player} ws={props.ws}/></th>
          </tr>
          <tr>
            <th><Field value={props.fields[3]} position={3} player={props.player} ws={props.ws}/></th>
            <th><Field value={props.fields[4]} position={4} player={props.player} ws={props.ws}/></th>
            <th><Field value={props.fields[5]} position={5} player={props.player} ws={props.ws}/></th>
          </tr>
          <tr>
            <th><Field value={props.fields[6]} position={6} player={props.player} ws={props.ws}/></th>
            <th><Field value={props.fields[7]} position={7} player={props.player} ws={props.ws}/></th>
            <th><Field value={props.fields[8]} position={8} player={props.player} ws={props.ws}/></th>
          </tr>
        </tbody>
      </table>
    );
}
