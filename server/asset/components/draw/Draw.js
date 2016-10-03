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

import './draw.less';

export default class Draw extends React.Component {
  constructor() {
    super();
    this._drawing = false;
    this._drawPath = [];
  }
  
  performDraw(drawData) {
    let context = this.refs.drawArea.getContext('2d');

    this._context.strokeStyle = '#3F51B5';
    for (let i = 0; i < drawData.length; i++) {
      let item = drawData[i];
      if (i === 0) {
        this._context.beginPath();
        this._context.moveTo(item.x,item.y);
      } if (i === drawData.length -1) {
        this._context.lineTo(item.x, item.y);
        this._context.stroke();
        this._context.closePath();
      } else {
        this._context.lineTo(item.x, item.y);
        this._context.stroke();
      }
    }
    this._context.strokeStyle = '#000000';
  }

  clearDraw() {
    this._context.clearRect(0, 0, this.refs.drawArea.width, this.refs.drawArea.height);
  }
  
  _onDrawStart(event) {
    if (event.button === 0) {
      this._drawing = true;
      this._context.beginPath();
      let x = event.pageX - this._offset.left;
      let y = event.pageY - this._offset.top;
      this._context.moveTo(x, y);
      this._drawPath = [{
        x: x,
        y: y
      }];
    }
  }
  
  _onDrawEnd(event) {
    if(event.button === 0) {
      this._drawing = false;
      let x = event.pageX - this._offset.left + 1;
      let y = event.pageY - this._offset.top + 1;
      this._context.lineTo(x,y);
      this._context.stroke();
      this._context.closePath();
      this._drawPath.push({
        x: x,
        y: y
      });
      this.props.onDraw(this._drawPath);
      this._drawPath = [];
    }
  }
  
  _onDrawing(event) {
    if(this._drawing) {
      let x = event.pageX - this._offset.left + 1;
      let y = event.pageY - this._offset.top + 1;
      this._context.lineTo(x,y);
      this._context.stroke();
      this._drawPath.push({
        x: x,
        y: y
      });
    }
  }

  _onClearClick() {
    this.clearDraw();
    if (this.props.onClear) {
      this.props.onClear();
    }
  }
  
  componentDidMount() {
    this._context = this.refs.drawArea.getContext('2d');
    this._context.strokeStyle='#000000';
    this._context.lineCap = 'round';
    this._offset = this.refs.drawArea.getBoundingClientRect();
    this.refs.drawArea.addEventListener('mousedown', this._onDrawStart.bind(this));
    this.refs.drawArea.addEventListener('mouseup', this._onDrawEnd.bind(this));
    this.refs.drawArea.addEventListener('mousemove', this._onDrawing.bind(this));
  }
  
  render() {
    let width = (window.innerWidth - 220) + 'px';
    let height = (window.innerHeight - 70) + 'px';
    return (
      <div className="draw">
        <button className="btn clear-button" onClick={this._onClearClick.bind(this)}>Clear</button>
        <canvas ref="drawArea" className="draw-canvas" width={width} height={height}></canvas>
      </div>
    );
  }
}