/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

import React from 'react';

import RoomListItem from '../roomListItem/RoomListItem';
import './roomList.less';

export default class ContactList extends React.Component {
  constructor() {
    super();
  }
  
  itemClicked(item) {
    if (this.props.onItemClicked) {
      this.props.onItemClicked(item);
    } else {
      console.log('No list item click handler');
    }
  }
  
  render() {
    let roomItems = this.props.data.map((contact) => {
      return (
        <RoomListItem
          key={contact.id}
          data={contact}
          onItemClicked={this.itemClicked.bind(this)}/>
      );
    });
    return (
      <div className="room-list">
        <div className="room-list-header">{this.props.header}</div>
        <div className="room-list-content">
          <ul>
            {roomItems}
          </ul>
        </div>
        <button className="btn btn-create-create-room">Create Room</button>
      </div>
    );
  }
}