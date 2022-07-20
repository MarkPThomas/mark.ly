import React from 'react';
import $ from 'jquery';

import { CragItem } from './CragItem';
import config from '../../../../config.js';

export class CragList extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   crags: []
    // }

    // this.componentDidMount = this.componentDidMount.bind(this);
    this.getCragData = this.getCragData.bind(this);
  }

  // componentDidMount() {
  //   this.getCragData()
  //     .then(data => {
  //       this.setState({
  //         crags: data
  //       })
  //     })
  //     .catch(error => {
  //       console.log('GET failure');
  //     });
  // }

  getCragData() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `${config.serverUrl}/crags/${this.props.area._id}`
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
    const crags = this.props.crags;
    return (
      <div className="routes-crag">
        {crags.map(crag => (
          <CragItem
            key={crag.id}
            crag={crag}
            onRouteChange={this.props.onRouteChange}
          />
        ))}
      </div>
    );
  }
}