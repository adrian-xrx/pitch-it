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

class Message {
  static get AUTH_REGISTER() {
    return 'auth.register';
  }

  constructor(type, data) {
    this._type = type;
    this._data = data;
    this._token;
  }

  get type() {
    return this._type;
  }

  get data() {
    return this._data;
  }

  get token() {
    return this._token;
  }

  set token(token) {
    this._token = token;
  }

  static deserialize(raw) {
    let parsed = JSON.parse(raw);
    return new Message(parsed.type, parsed.data);
  }

  serialize() {
    return JSON.stringify({
      type: this._type,
      data: this._data,
      token: this._token
    });
  }
}

module.exports = Message;