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

export default class ListItem extends FacadeElement {
  constructor(id, classes, listObject) {
    super(id, ["list-item"].concat(classes), "");
    this._listObject = listObject;
  }

  _attachEvents(elm) {
    let events = Object.keys(this._events);
    events.forEach((e) => {
      if (e && this._events[e]) {
        let callback = this._events[e];
        elm.addEventListener(e, (domEvt) => {
          callback(domEvt, this._listObject);
        });
      }
    });
  }

  render() {
    this._compiled = document.createElement('li');
    this._attachClasses(this._compiled);
    this._attachEvents(this._compiled);
    this._compiled.id = this._id;
    this._compiled.textContent = this._listObject.label;
    this._compiled.title = this._listObject.tooltip || this._listObject.label;
    return this._compiled;
  }
}