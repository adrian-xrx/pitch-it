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

import FacadeElement from '../lib/FacadeElement';
import DrawApi from '../lib/DrawApi';

export default class Whiteboard extends FacadeElement {

  constructor(id, classes) {
    super(id, ["whiteboard"].concat(classes));
    super.on('click', (evt) => this._onClick(evt));
    super.on('contextmenu', (evt) => this._onRightClick(evt));
    super.on('mousemove', (evt) => this._onMouseMove(evt));
    this._activeShape = undefined;
  }

  set drawCallback(callback) {
    this._onDrawing = callback;
  }

  _onClick(evt) {
    let path = "";
    if (this._activeShape) {
      this._updatePath(this._activeShape, evt.pageX, evt.pageY);
    } else {
      this._activeShape = this._generatePath(evt.pageX, evt.pageY);
      this._compiled.appendChild(this._activeShape);
    }
    if (this._onDrawing) {
      this._onDrawing(evt.pageX, evt.pageY);
    }
  }

  _onMouseMove(evt) {
    if (this._activeShape) {
      let currentPath = this._activeShape.getAttributeNS(null, "d");
      let path = currentPath;
      let lastPosition = currentPath.lastIndexOf(" ");
      currentPath = currentPath.substring(0, lastPosition);
      if (currentPath !== "M") {
        path = `${currentPath} ${evt.pageX},${evt.pageY}`;
      } else {
        path = `${path} L ${evt.pageX},${evt.pageY}`;
      }
      this._activeShape.setAttributeNS(null, "d", path);
    }
  }

  _onRightClick(evt) {
    if (this._activeShape) {
      let currentPath = this._activeShape.getAttributeNS(null, "d");
      let closeType = DrawApi.KEEEP;
      if (!evt.ctrlKey) {
        let path = `${currentPath} Z`;
        closeType = DrawApi.CLOSE;
        this._activeShape.setAttributeNS(null, "d", path);
      }
      this._activeShape = undefined;
      if (this._onDrawing) {
        let lastPosition = currentPath.lastIndexOf(" ");
        let position = currentPath.substring(lastPosition, currentPath.length).trim();
        position = position.split(',');
        this._onDrawing(position[0], position[1], closeType);
      }
    }
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }

  _generatePath(x, y, color) {
    let pathShape = document.createElementNS("http://www.w3.org/2000/svg","path");
    let path = `M ${x},${y}`;
    pathShape.setAttributeNS(null, "d", path);
    pathShape.style.stroke = color || '#000';
    pathShape.style.fill = 'none';
    return pathShape;
  }

  _updatePath(pathElement, x, y) {
    let currentPath = pathElement.getAttributeNS(null, "d");
    let path = `${currentPath} L ${x},${y}`;
    pathElement.setAttributeNS(null, "d", path);
    return pathElement;
  }

  clear() {
    this._activeShape = undefined;
    this._remoteShape = undefined;
    if (this._compiled) {
      let firstChild = this._compiled.firstChild;
      while(firstChild) {
        firstChild.remove();
        firstChild = this._compiled.firstChild;
      }
    }
  }

  drawRemote(x, y, close) {
    if (this._remoteShape) {
      if (!close) {
        this._updatePath(this._remoteShape, x, y);
      } else {
        this._updatePath(this._remoteShape, x, y);
        if(close === DrawApi.CLOSE) {
          let currentPath = this._remoteShape.getAttributeNS(null, "d");
          let path = `${currentPath} Z`;
          this._remoteShape.setAttributeNS(null, "d", path);
        }
        this._remoteShape = undefined;
      }
    } else {
      this._remoteShape = this._generatePath(x, y, '#777');
      this._compiled.appendChild(this._remoteShape);
    }
  }

  render() {
    this._compiled = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._attachClasses(this._compiled);
    this._attachEvents(this._compiled);
    return this._compiled;
  }

}