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

import React from 'react';
import Logo from '../logo/Logo';

import '../../less/elements/button.less';
import '../../less/elements/input.less';

import './login.less';

export default class Login extends React.Component {
  
  static get KEY_ENTER() {
    return 13;
  }

  _register(username) {
    if (username) {
      console.log('Register with user: ' + username);
      window.username = username;
      location.hash = 'main';
    }
  }

  onSubmitClick() {
    let username = this.refs.username.value;
    this._register(username);
  }
  
  onKeyUpHandler(evt) {
    switch(evt.nativeEvent.keyCode) {
      case Login.KEY_ENTER:
        this.onSubmitClick();
        break;
    }
  }
  
  render() {
    return (
      <div className="login-page">
        <Logo large="true" />
        <label className="label-username" htmlFor="field-username">
          Enter a username:<br />
          <input className="input-field field-username" id="field-username" name="field-username" type="text" ref="username" onKeyUp={this.onKeyUpHandler.bind(this)}/>
        </label>
        <div className="submit" onClick={this.onSubmitClick.bind(this)} ></div>
      </div>
    );
  }
}