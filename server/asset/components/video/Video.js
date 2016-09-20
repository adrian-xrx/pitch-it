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

import './video.less';

export default class Video extends React.Component {
  componentDidUpdate() {
    if (this.props.stream && this.refs.video) {
      this.refs.video.play();
    } else {
      console.warn('Stream or video element not available');
    }
  }
  render() {
    return (
      (this.props.stream) ?
        <video className="video" src={this.props.stream} ref="video"></video> :
        <div></div>
    );
  } 
}