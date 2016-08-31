/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

import React from 'react';

import './callRespond.less';
import '../../less/elements/button.less';

export default class CallRespond extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {},
      isVisible: null
    };
  }
  accept() {
    if (this.props.accept) {
      this.props.accept();
    }
    this.setState({
      isVisible: false
    });
  }
  
  decline() {
    if (this.props.decline) {
      this.props.decline();
    }
    this.setState({
      isVisible: false
    });
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.data && Object.keys(nextProps.data).length > 0) {
      this.setState({
        data: nextProps.data,
        isVisible: true
      });
    } else {
      this.setState({
        data: {},
        isVisible: null
      });
    }
  }
  
  render() {
    let slideClass="call-respond";
    if (this.state.isVisible === true) {
      slideClass += " in"
    } else if (this.state.isVisible === false) {
      slideClass += " out"
    }
    return (
      <div className={slideClass}>
        <div className="caller">{this.state.data.caller} is calling</div>
        <div>
          <button className="btn accept" onClick={this.accept.bind(this)}>Accept</button>
          <button className="btn decline" onClick={this.decline.bind(this)}>Decline</button>
        </div>
      </div>
    );
  }
}