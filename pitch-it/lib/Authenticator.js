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

class Authenticator {
  constructor() {
    this._tokenCache = {};
  }

  generateToken() {
    let _set = "abcdefghiljklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 30; i++) {
      let rand = Math.floor(Math.random() * _set.length);
      token += _set[rand];
    }
    return token;
  }

  authenticate(socket, username) {
    let token = this.generateToken();
    this._tokenCache[token] = {
      user: username,
      expire: Date.now() + 3600000
    };
    let message = new Message(Message.AUTH_REGISTER, {token: token});
    socket.send(message.serialize());
  }

  removeToken(token) {
    delete this._tokenCache[token];
  }

  isValid(token) {
    let tokenData = this._tokenCache[token];
    if (tokenData && tokenData.expire >= Date.now()) {
      return true;
    } else {
      removeToken(token);
      return false;
    }
  }
}

module.exports = Authenticator;