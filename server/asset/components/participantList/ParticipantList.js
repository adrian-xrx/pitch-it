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
'use strict';

import React from 'react';

import '../../less/elements/button.less';
import '../../less/elements/input.less';

import './participantList.less';

export default class WelcomeBox extends React.Component {
  constructor() {
    super();
  }
  
  onAddClicked(item) {
    console.log('TODO - add item')
  }

  _createListItems(participants) {
    if (participants) {
      return (
        <li className="participant-list-item">{participant.name}</li>
      );
    } else {
      return (
        <li className="empty-marker">No participants</li>
      );
    }
  }
  
  render() {
    let listItems = this._createListItems();
    return (
      <div className="participant-list">
        <div className="participant-list-header">Participants</div>
        <input className="input-field" /><button className="btn" onClick={this.onAddClicked.bind(this)}>Add</button>
        <ul>
          {listItems}
        </ul>
      </div>
    );
  }
}