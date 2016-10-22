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

import FacadeElement from '../lib/FacadeElement';
import FacadeKeys from '../lib/FacadeKeys';
import Logo from './Logo';
import FormInput from './FormInput';

export default class LoginBox extends FacadeElement {
  constructor() {
    super(undefined, ['login-box']);
    this.appendChild(new Logo());
    let formInput = new FormInput('username', undefined, 'login');
    formInput.on('keyup', (event) => {
      switch(event.keyCode) {
        case FacadeKeys.ENTER:
          this._login(formInput.getValue(), event);
      }
    });
    this.appendChild(formInput);
  }

  _login(username, event) {
    if (this._loginCallback) {
      this._loginCallback(username, event);
    }
  }

  onLogin(callback) {
    if (callback) {
      this._loginCallback = callback;
    }
  }
}