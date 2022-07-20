import React from 'react'

export class MenuCategory extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    console.log('Menu Category clicked');
    this.props.handleClick(e.target.id);
  }

  render() {
    return (
      <div id={this.props.title} className="menu-category" onClick={this.onClick}>
        {this.props.title}
      </div>
    );
  }
}