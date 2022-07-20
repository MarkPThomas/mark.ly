import React from 'react';
import $ from 'jquery';

import { RouteItem } from './RouteItem';
import config from '../../../../config.js';

export class RouteList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routes: []
    }

    this.getRouteData = this.getRouteData.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }

  handleRouteChange(route) {
    this.props.onRouteChange(route);
  }

  getRouteData() {
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `${config.serverUrl}/routes/${this.props.crag._id}`
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
    const routes = this.props.routes;
    return (
      <div className="items-list">
        {routes.map(route => (
          <RouteItem
            key={route.id}
            route={route}
            isSelectable={this.props.isSelectable}
            onRouteChange={this.handleRouteChange}
          />
        ))}
      </div>
    );
  }
}





