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