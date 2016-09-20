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
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './lib/Router';
import Main from './components/main/Main';
import Login from './components/login/Login';

import './less/base.less';
import './less/content.less';
import './less/elements/button.less';
  
if (typeof window.console === 'undefined') {
  window.console = {
    log: function () {},
    info: function () {},
    warn: function () {},
    error: function () {}
  };
}

let router = new Router({
  "login": {
    onEnter: () => {
      ReactDOM.render(<Login />, document.querySelector('#render-container'));
    }
  },
  "main": {
    onEnter: () => {
      ReactDOM.render(<Main />, document.querySelector('#render-container'));
    }
  },
  "default": {
    onEnter: () => {
      location.hash = "login";
    }
  }
});