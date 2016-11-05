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

  static get AUTH_LOGOUT() {
    return 'auth.logout';
  }

  static get AUTH_CHECK() {
    return 'auth.check';
  }

  static get AUTH_REGISTER() {
    return 'auth.register';
  }

  static get USER_LIST() {
    return 'user.list';
  }

  static get CALL_OFFER() {
    return 'call.offer';
  }

  static get CALL_ACCEPT() {
    return 'call.accept';
  }

  static get CALL_REJECT() {
    return 'call.reject';
  }

  static get RTC_OFFER() {
    return 'rtc.offer';
  }

  static get RTC_ANSWER() {
    return 'rtc.answer';
  }

  static get RTC_ICE_CANDIDATE() {
    return 'rtc.ice.candidate';
  }

  static get ERROR() {
    return 'error';
  }

  constructor(type, data) {
    this._type = type;
    this._data = data;
    this._token;
    this._origin;
  }

  get origin() {
    return this._origin;
  }

  set origin(origin) {
    this._origin = origin;
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
    let msg = new Message(parsed.type, parsed.data);
    if (parsed.token) {
      msg.token = parsed.token;
    }
    if (parsed.origin) {
      msg.origin = parsed.origin;
    }
    return msg;
  }

  serialize() {
    return JSON.stringify({
      type: this._type,
      data: this._data,
      token: this._token,
      origin: this._origin
    });
  }
}

module.exports = Message;