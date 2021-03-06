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

import Message from '../../../shared/Message';
import CookieApi from './CookieApi';

export default class ClientSocket {
  constructor(host, port, connected, disconnected, tlsEnabled=false) {
    this._messageHandlers = {};
    this._connectedCallback = connected;
    this._disconnectedCallback = disconnected;
    let socketURL = (tlsEnabled ? 'wss' : 'ws') + '://' + host + ':' + port;
    this._socket = new WebSocket(socketURL);
    this._socket.onopen = () => this._connected();
    this._socket.onclose = () => this._disconnected();
    this._socket.onmessage = this._handleMessage.bind(this);
    this._callbacks = {};
  }

  _connected() {
    console.log('Connected');
    let authCheck = new Message(Message.AUTH_CHECK, {});
    if (location.hash !== 'login') {
      this.send(authCheck);
    }
    if (this._connectedCallback) {
      this._connectedCallback();
    }
  }
  
  _disconnected() {
    console.log('disconnected');
    if (this._disconnectedCallback) {
      this._disconnectedCallback();
    }
  }
  
  _handleMessage(msg) {
    msg = Message.deserialize(msg.data);
    if (msg.type === Message.ERROR) {
      if (msg.data.code === 401) {
        CookieApi.removeCookie('token');
        location.hash = '';
      } else {
        console.error(msg.data.code, msg.data.reason);        
      }
    }
    if (this._callbacks[msg.type]) {
      this._callbacks[msg.type](msg);
    } else {
      console.info('No handler found for ', msg.type);
    }
  }
  
  send(msg) {
    let token = CookieApi.getValue('token'); 
    if (token) {
      msg.token = token;
    }
    this._socket.send(msg.serialize());
  }

  on(type, handle) {
    if (!this._callbacks[type]) {
      this._callbacks[type] = handle;
    } else {
      console.warn('Try to overwrite handler for ', type);
    }
  }
}
