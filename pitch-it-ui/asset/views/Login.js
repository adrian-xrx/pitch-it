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

import FacadeView from '../lib/FacadeView';
import LoginBox from '../components/LoginBox';

export default class Login extends FacadeView {
  constructor(domTarget, authApi) {
    super(domTarget);
    this._root.addClass('login-view');
    this._authApi = authApi;
    this._loginBox = new LoginBox();
    this._loginBox.onLogin((username, event) => this.authenticate(username));

    super.appendChild(this._loginBox);
  }

  init() {
    this._loginBox.update('');
  }

  authenticate(username) {
    if (username) {
      this._authApi.register(username);
    }
  }
}