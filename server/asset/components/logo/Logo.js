/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

'use strict';
import React from 'react';
import './logo.less';

export default class Logo extends React.Component {
  render() {
    let classes = 'logo';
    if (this.props.large === 'true') {
      classes += ' large';
    }
    return (<div className={classes}>pitch it</div>)
  }
}

