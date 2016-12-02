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
import Button from './Button';

export default class DialogFrame extends FacadeElement {
  constructor(id, classes, title, contentElements, okCallback, cancelCallback) {
    super(id, ["dialog-frame"].concat(classes), "");
    this._title = title || '';
    this._okCallback = okCallback;
    this._cancelCallback = cancelCallback;
    this._okLabel = 'Ok';
    this._cancelLabel = (cancelCallback) ? 'Cancel' : undefined;
    if (contentElements && contentElements.length > 0) {
      this.update(contentElements);      
    }
    this._children.unshift(this._generateTitleElm());
    this._children = this._children.concat(this._generateFooterButtons());
    this._backdrop;
  }

  setTitle(title) {
    this._title = title;
  }

  setOkLabel(okLabel) {
    this._okLabel = okLabel;
  }

  setCancelLabel(cancelLabel) {
    this._cancelLabel = cancelLabel;
  }

  _generateTitleElm() {
    return new FacadeElement(undefined, ["dialog-frame-title"], this._title);
  }

  _generateFooterButtons() {
    let okButton = new Button(undefined, ["primary"], this._okLabel);
    okButton.on('click', (evt) => {
      this.hide();
      this._okCallback(evt)
    });
    let footerButtons = [okButton];
    if (this._cancelCallback) {
      let cancelButton = new Button(undefined, undefined, this._cancelLabel);
      cancelButton.on('click', (evt) => {
        this.hide();
        this._cancelCallback(evt)
      });
      footerButtons.push(cancelButton);
    }
    return footerButtons;
  }

  update(contentElements) {
    let title = this._generateTitleElm();
    this.clear();
    this._children = [title].concat(contentElements, this._generateFooterButtons());
    this._renderChildren();
  }

  show() {
    this.removeClass("hide");
    this.addClass("show");
    this._backdrop = document.createElement('div');
    this._backdrop.classList.add('dialog-backdrop');
    document.body.appendChild(this._backdrop);
  }

  hide() {
    this.removeClass("show");
    this.addClass("hide");
    this._backdrop.remove();
    this._backdrop = undefined;
  }
}