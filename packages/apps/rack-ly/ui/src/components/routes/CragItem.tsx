import React from 'react';

import { RouteList } from './RouteList';

export class CragItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    }

    this.setExpanded = this.setExpanded.bind(this);
  }

  setExpanded(isExpanded) {
    this.setState({
      expanded: isExpanded
    })
  }

  render() {
    const crag = this.props.crag;
    return (
      <div className="crag-title-block">
        <div className="route-crag title-shadow" onClick={() => this.setExpanded(!this.state.expanded)}>
          {crag.cragName}
        </div>
        {
          this.state.expanded &&
          <RouteList
            key={crag.id}
            routes={crag.routes}
            onRouteChange={this.props.onRouteChange}
            isSelectable={true}
          />
        }
      </div>
    );
  }
}