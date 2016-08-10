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