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

export default class Button extends FacadeElement {
  constructor(id, classes=[], label) {
    super(id, ['btn'].concat(classes), label);
  }

  update(label) {
    this._content = label;
    if (this._compiled) {
      this._compiled.textContent = label;
      this._compiled.title = label;
    }
  }

  render() {
    this._compiled = document.createElement('button');
    this._attachClasses(this._compiled);
    this._attachEvents(this._compiled);
    if (this._id && this._id.length > 0) {
      this._compiled.id = this._id;
    }
    if (this._content && this._compiled && this._content.length > 0) {
      this._compiled.textContent = this._content;    
      this._compiled.title = this._content;
    }
    return this._compiled;
  }
}