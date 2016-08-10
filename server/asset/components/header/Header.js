'use strict';
import React from 'react';
import Logo from '../logo/Logo';
import './header.less';

export default class Header extends React.Component {
  render() {
    return (<div className="header"><Logo /><div className="user">{(this.props.user) ? this.props.user.name : ''}</div></div>)
  }
}