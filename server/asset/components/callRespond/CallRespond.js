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