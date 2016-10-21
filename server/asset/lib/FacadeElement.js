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

export default class FacadeElement {

  constructor(id, classes, content) {
    this._id = id || '';
    this._classes = classes || [];
    this._content = content || '';
    this._children = [];
  }

  appendChild(child) {
    if (child instanceof HTMLElement || child instanceof FacadeElement) {
      this._children.push(child);
    } else {
      console.warn('Cannot append child', child);
    }
  }

  addClass(className) {
    if (this._classes.indexOf(className) === -1) {
      this._classes.push(className);      
    }
  }

  renderChild(child) {
    if (child instanceof FacadeElement) {
      return child.render();
    } else {
      return child;
    }
  }

  _attachClasses(elm) {
    this._classes.forEach((className) => {
      elm.classList.add(className);
    });
  }

  render() {
    let defaultElm = document.createElement('div');
    this._attachClasses(defaultElm);
    defaultElm.id = this._id;
    defaultElm.textContent = this._content;
    this._children.forEach((child) => {
      defaultElm.appendChild(this.renderChild(child));
    });
    return defaultElm;
  }
}