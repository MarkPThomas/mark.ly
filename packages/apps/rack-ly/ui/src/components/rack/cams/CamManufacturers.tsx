import React from 'react';
import $ from 'jquery';

import config from '../../../../../config.js.js';

import { CamManufacturer } from './CamManufacturer';

export class CamManufacturers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cams: []
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getCamData = this.getCamData.bind(this);
  }

  componentDidMount() {
    this.getCamData()
      .then(data => {
        this.setState({
          cams: data
        })
      })
      .catch(error => {
        console.log('Failed to get cams', error);
      });
  }

  getCamData() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `${config.serverUrl}/cams`
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
    const camManufacturers = this.state.cams;
    return (
      <div className="product-group">
        <h1>Cams (SLCDs)</h1>
        {camManufacturers.map(manufacturer => (
          <CamManufacturer
            key={manufacturer._id}
            manufacturer={manufacturer}
            onCamChange={this.props.onCamChange}
          />
        ))}
      </div>
    );
  }
};