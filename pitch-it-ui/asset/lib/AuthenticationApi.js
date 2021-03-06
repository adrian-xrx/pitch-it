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

import Message from '../../../shared/Message';
import CookieApi from './CookieApi';

export default class AuthenticationApi {
  constructor(clientSocket) {
    this._clientSocket = clientSocket; 
    this._clientSocket.on(Message.AUTH_REGISTER, (msg) => this.registerSuccess(msg));
  }

  register(username, password) {
    let msg = new Message(Message.AUTH_REGISTER, {
      username: username,
      password: password
    });
    this._clientSocket.send(msg);
  }

  registerSuccess(msg) {
    let token = msg.data.token;
    console.log('Register successful');
    CookieApi.createCookie('token', token);
    location.hash = 'main';
  }

  logout() {
    let msg = new Message(Message.AUTH_LOGOUT, {});
    this._clientSocket.send(msg);
    CookieApi.removeCookie('token');
    location.hash = 'login';
    console.log('Logout');
  }

  isAuthenticated() {
    return typeof CookieApi.getValue('token') !== 'undefined';
  }
}