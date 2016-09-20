/**
 *    Copyright 2016, the creators of pitch-it
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * be found in the LICENSE file in the root directory
 * 
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