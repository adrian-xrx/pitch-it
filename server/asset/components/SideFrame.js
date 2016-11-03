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

export default class SideFrame extends FacadeElement {
  constructor(id, classes, title, contentElements) {
    super(id, ["side-frame","hide"].concat(classes), "");
    this._title = title || '';
    if (contentElements && contentElements.length > 0) {
      this.update(contentElements);      
    }
    this._children.unshift(this._generateTitleElm());
    this._backdrop;
  }

  setTitle(title) {
    this._title = title;
  }

  _generateTitleElm() {
    return new FacadeElement(undefined, ["side-frame-title"], this._title);
  }

  update(contentElements) {
    let title = this._generateTitleElm();
    this.clear();
    this._children = [title].concat(contentElements);
    this._renderChildren();
  }

  show() {
    this.removeClass("hide");
    this._backdrop = document.createElement('div');
    this._backdrop.classList.add('backdrop');
    this._backdrop.addEventListener('click', () => {
      this.hide();
    })
    document.body.appendChild(this._backdrop);
  }

  hide() {
    this.addClass("hide");
    this._backdrop.remove();
    this._backdrop = undefined;
  }
}