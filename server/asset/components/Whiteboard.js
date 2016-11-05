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

export default class Whiteboard extends FacadeElement {

  constructor(id, classes) {
    super(id, ["whiteboard"].concat(classes));
    super.on('click', (evt) => this._onClick(evt));
    super.on('contextmenu', (evt) => this._onRightClick(evt));
    super.on('mousemove', (evt) => this._onMouseMove(evt));
    this._activeShape = undefined;
  }

  _onClick(evt) {
    let path = "";
    if (this._activeShape) {
      let currentPath = this._activeShape.getAttributeNS(null, "d");
      let path = `${currentPath} L ${evt.pageX},${evt.pageY}`;
      this._activeShape.setAttributeNS(null, "d", path);
    } else {
      this._activeShape = document.createElementNS("http://www.w3.org/2000/svg","path");
      path = `M ${evt.pageX},${evt.pageY}`;
      this._activeShape.setAttributeNS(null, "d", path);
      this._activeShape.style.stroke = '#000';
      this._activeShape.style.fill = 'none';
      this._compiled.appendChild(this._activeShape);
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
      if (!evt.ctrlKey) {
        let path = `${currentPath} Z`;
        this._activeShape.setAttributeNS(null, "d", path);
      }
      this._activeShape = undefined;
    }
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }

  clear() {
    // todo - check why this breaks draw capabilities
    /*
    if (this._compiled) {
      let firstChild = this._compiled.firstChild;
      while(firstChild) {
        firstChild.remove();
        firstChild = this._compiled.firstChild;
      }
    }
    */
  }

  onDrawing(handler) {

  }

  update(newPaths) {
    console.log(newPaths);
  }

  render() {
    this._compiled = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._attachClasses(this._compiled);
    this._attachEvents(this._compiled);
    return this._compiled;
  }

}