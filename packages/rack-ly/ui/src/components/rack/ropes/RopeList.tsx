import React from 'react';
import $ from 'jquery';

import config from '../../../../../config.js';

import { RopeItem } from './RopeItem';

export class RopeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ropes: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getRopeData = this.getRopeData.bind(this);
  }

  componentDidMount() {
    this.getRopeData()
      .then(data => {
        this.setState({
          ropes: data
        })
      })
      .catch(error => {
        console.log('GET failure');
      });
  }

  getRopeData() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `${config.serverUrl}/ropes`
      })
        .done(response => {
          resolve(response);
        })
        .fail(error => {
          console.log('error', error);
          reject(error);
        });
    });
  }

  render() {
    const ropes = this.state.ropes;
    return (
      <div className="product-group">
        <h1>Ropes</h1>
        {ropes.map(rope => (
          <RopeItem
            key={rope._id}
            rope={rope}
            isChangeable={this.props.isChangeable}
            onRopeChange={this.props.onRopeChange}
          />
        ))}
      </div>
    );
  }
}