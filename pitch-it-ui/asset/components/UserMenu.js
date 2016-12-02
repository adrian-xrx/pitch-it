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
import List from './List';

export default class UserMenu extends FacadeElement {
  constructor(id, classes, content, menuEntries) {
    super(id, ["user-menu"].concat(classes), '');
    this._username = new FacadeElement(undefined, ['label'], this._content);
    this._username.on('click', () => {
      if (this._menuEntries.hasClass('active')) {
        this._menuEntries.removeClass('active');
      } else {
        this._menuEntries.addClass('active');
      }
    });
    super.appendChild(this._username);
    this._menuEntries = new List(undefined, undefined, menuEntries);
    this._menuEntries.on('click', () => this._menuEntries.removeClass('active'));
    super.appendChild(this._menuEntries);
  }

  update(content) {
    this._username.update(content);
  }
}