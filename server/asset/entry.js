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

import FacadeRouter from './lib/FacadeRouter';
import FacadeView from './lib/FacadeView';
import Login from './views/Login';
import Main from './views/Main';
import FacadeElement from './lib/FacadeElement';
import UserApi from './lib/UserApi';
import AuthenticationApi from './lib/AuthenticationApi';
import ClientSocket from './lib/ClientSocket';

let clientSocket = new ClientSocket('localhost', 1234, null, null, false);

let userApi = new UserApi(clientSocket);
let authApi = new AuthenticationApi(clientSocket);

let login = new Login('#render-container', authApi);

let main = new Main('#render-container', userApi);

var router = new FacadeRouter({
  "login": {
    view: login
  },
  "main": {
    view: main,
    authentication: true
  },
  "default": {
    onEnter: () => {
      if (authApi.isAuthenticated()) {
        location.hash = 'main';
      } else {
        location.hash = 'login';        
      }
    }
  }
}, authApi);