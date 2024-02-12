import React from 'react';
import $ from 'jquery';

import config from '../../../../config.js.js';

import { AreaItem } from './AreaItem';

export class AreaList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      areas: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getAreaData = this.getAreaData.bind(this);
  }

  componentDidMount() {
    this.getAreaData()
      .then(data => {
        console.log('Routes loaded:', data);
        this.setState({
          areas: data.areas
        })
      })
      .catch(error => {
        console.log('GET failure');
      });
  }

  getAreaData() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `${config.serverUrl}/routes`
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
    const areas = this.state.areas;
    return (
      <div className="routes-area">
        <h1>Routes</h1>
        {areas.map(area => (
          <AreaItem
            key={area.id}
            area={area}
            onRouteChange={this.props.onRouteChange}
          />
        ))}
      </div>
    );
  }
}