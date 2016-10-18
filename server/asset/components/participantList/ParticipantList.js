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
  
  _onAddClicked() {
    let userToAdd = this.refs.search.value;
    if (userToAdd) {
      console.log('Add participant: ' + userToAdd);
      let tmpUser = this._findUser(userToAdd);
      if (tmpUser) {
        console.log('User found');
        this.props.onAddClicked(tmpUser);
      } else {
        console.log('User could not be found');
      }
    }
  }

  _findUser(userToSearch) {
    for (let i = 0; i < this.props.availableUsers.length; i++) {
      let user = this.props.availableUsers[i];
      if (user.name === userToSearch) {
        return user;
      }
    }
  }


  render() {
    return (
      <div className="participant-list">
        <div className="participant-list-header">Participants</div>
        <div className="participant-list-add">
          <input className="input-field" ref="search"/><button className="btn" onClick={this._onAddClicked.bind(this)}>Add</button>
        </div>
      </div>
    );
  }
}