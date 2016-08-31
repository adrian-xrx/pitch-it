/**
 * BSD-Licensed
 * @author J-Pi
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

