import React from 'react';

import { CamManufacturers } from './cams/CamManufacturers';
import { RopeList } from './ropes/RopeList';

export class Rack extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rack: {
        cams: [],
        ropes: []
      }
    }

    this.updateRackComponent = this.updateRackComponent.bind(this);
    this.handleCamChange = this.handleCamChange.bind(this);
    this.handleRopeChange = this.handleRopeChange.bind(this);
  }

  updateRackComponent(componentSet, updatedComponent) {
    const isInSet = (index) => { return (index !== -1) };

    const index = componentSet.findIndex((component) => { return (component._id === updatedComponent._id) });
    if (isInSet(index)) {
      if (updatedComponent.quantity === 0) {
        componentSet.splice(index, 1);
      }
    } else if (updatedComponent.quantity > 0) {
      componentSet.push(updatedComponent);
    }
    return componentSet;
  }

  handleCamChange(cam) {
    console.log('Updated Cam:', cam);
    const rack = this.state.rack;
    const cams = this.updateRackComponent(rack.cams, cam);
    rack.cams = cams;
    this.props.onRackChange(rack);
    this.setState({
      rack: rack
    })
  }

  handleRopeChange(rope) {
    console.log('Updated Rope:', rope);
    const rack = this.state.rack;
    const ropes = this.updateRackComponent(rack.ropes, rope);
    rack.ropes = rope;
    this.props.onRackChange(rack);
    this.setState({
      rack: rack
    })
  }

  render() {
    return (
      <div className="rack">
        <h1> Rack Components</h1>
        <div className="horizontal">
          <CamManufacturers onCamChange={this.handleCamChange} />
          <RopeList onRopeChange={this.handleRopeChange} isChangeable={true} />
        </div>
      </div>
    );
  }
};