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

import FacadeElement from './FacadeElement';

export default class FacadeView {
  constructor(domTarget, children) {
    this._domTarget = domTarget;
    this._root = new FacadeElement();
    this._children = [];
  }

  render() {
    let target = this.getTargetElement();
    this.clear(target);
    target.appendChild(this._root.render());
  }

  clear(target) {
    let firstChild = target.firstChild;
    while (firstChild) {
      target.removeChild(firstChild);
      firstChild = target.firstChild;
    }
  }

  getTargetElement() {
    if (typeof this._domTarget === 'string') {
      return document.querySelector(this._domTarget)
    } else {
      return this._domTarget;
    }
  }

  appendChild(child) {
    this._root.appendChild(child);
  }
}