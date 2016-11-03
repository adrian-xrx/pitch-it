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

const Message = require('../../shared/Message');
const Logger = require('./Logger');

class Users {
  constructor() {
    this._userList = [];
  }

  indexOf(name) {
    let size = this._userList.length
    for (let i = 0; i < size; i++) {
      if (this._userList[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  add(name) {
    if (name) {
      this._userList.push({
        name: name
      });
      Logger.debug('Added user: ' + name);
      Logger.debug('Total number of users: ' + this._userList.length);
    }
  }

  remove(name) {
    if (name) {
      let index = this.indexOf(name);
      if (index !== -1) {
        this._userList.splice(index, 1);
        Logger.debug('Removed User: ' + name);
        Logger.debug('Total number of users: ' + this._userList.length);
      }
    }
  }

  list(socket) {
    // todo - remove origin user from user list
    let message = new Message(Message.USER_LIST, {list: this._userList});
    socket.send(message.serialize());
  }

}

module.exports = Users;