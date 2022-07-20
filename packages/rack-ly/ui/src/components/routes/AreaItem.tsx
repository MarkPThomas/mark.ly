import React from 'react';

import { CragList } from './CragList';

export class AreaItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    }
  }

  setExpanded(isExpanded) {
    this.setState({
      expanded: isExpanded
    })
  }

  render() {
    const area = this.props.area;
    return (
      <div className="area-title-block">
        <div className="route-area title-shadow" onClick={() => this.setExpanded(!this.state.expanded)}>
          {area.areaName}
        </div>
        <div className="items-list">
          {this.state.expanded &&
            <CragList
              key={area.id}
              crags={area.crags}
              onRouteChange={this.props.onRouteChange}
            />
          }
        </div>
      </div>
    );
  }
}