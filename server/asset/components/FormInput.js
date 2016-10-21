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

export default class FormInput extends FacadeElement {
  constructor(id, classes, label, value) {
    super(id, classes, value);
    this._label = label;
  }

  render() {
    let elm = document.createElement('div');
    this._attachClasses(elm);
    let labelElm = document.createElement('label');
    labelElm.setAttribute('for', this._id);
    labelElm.textContent = this._label;
    let inputElm = document.createElement('input');
    inputElm.id = this._id;
    inputElm.name =this._id;
    inputElm.value = this._content;
    elm.appendChild(labelElm);
    elm.appendChild(inputElm);
    return elm;
  }
}