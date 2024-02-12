import React from 'react';

export class RouteItem extends React.Component {
  constructor(props) {
    super(props);

    let isSelected = props.route.isSelected ? true : false;
    this.state = {
      selected: isSelected
    }

    this.setSelected = this.setSelected.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  setSelected(isSelected) {
    console.log('isSeleced:', isSelected);
    this.setState({
      selected: isSelected
    })
  }

  handleSelectionChange() {
    if (this.props.isSelectable) {
      const isSelected = !this.state.selected;

      const route = this.props.route;
      route.isSelected = isSelected;
      console.log(`Route selection changed! ${route.routeName} is selected: ${route.isSelected}`);
      this.props.onRouteChange(route);
      this.setSelected(isSelected);
      this.forceUpdate();
    }
  }

  render() {
    const route = this.props.route;

    let className = `route-item`;
    if (this.props.isSelectable) {
      className += ' selectable';
    }
    if (this.state.selected) {
      className += ' isSelected';
    }

    return (
      <div className={className} onClick={this.handleSelectionChange}>
        <div className="route-name">{route.routeName}</div>
        <div className="route-rating">{route.rating}</div>
        <div className="route-length">{route.length} {route.lengthUnit}</div>
      </div>
    );
  }
};