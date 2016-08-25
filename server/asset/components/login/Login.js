/**
 * BSD-Licensed, J-Pi
 */

import React from 'react';
import Logo from '../logo/Logo';

import './login.less';

export default class Login extends React.Component {
  
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
  
  render() {
    return (
      <div className="login-page">
        <Logo large="true" />
        <label className="label-username" for="field-username">
          Enter a username:<br />
          <input className="field-username" id="field-username" name="field-username" type="text" ref="username"/>
        </label>
        <div className="submit" onClick={this.onSubmitClick.bind(this)}></div>
      </div>
    );
  }
}