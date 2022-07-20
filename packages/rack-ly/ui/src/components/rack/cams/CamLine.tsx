import React from 'react';

import { CamList } from './CamList';

export class CamLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  setExpanded(isExpanded) {
    this.setState({
      expanded: isExpanded
    })
  }

  getModelLineName() {
    const modelName = this.props.modelName;
    const lineName = this.props.line.lineName;

    return modelName === lineName ? modelName : `${lineName} ${modelName}`;
  }

  render() {
    return (
      <div>
        <div className="product-model title-shadow" onClick={() => this.setExpanded(!this.state.expanded)}>
          {this.getModelLineName()}
        </div>
        <div className="items-list">
          {this.state.expanded &&
            <CamList
              cams={this.props.line.cams}
              isChangeable={true}
              onCamChange={this.props.onCamChange}
            />}
        </div>
      </div>
    );
  }
}
