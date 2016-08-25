/**
 * BSD-Licensed, J-Pi
 */

import React from 'react';

import './roomListItem.less';

export default class RoomListItem extends React.Component {
  constructor() {
    super();
  }
  
  itemClicked() {
    if (this.props.onItemClicked) {
      this.props.onItemClicked(this.props.data);
    } else {
      console.log('No item click handler');
    }
  }
  
  render() {
    return (
      <li className="room-list-item"
          onClick={this.itemClicked.bind(this)}>
        {this.props.data.name}
      </li>
    );
  }
}