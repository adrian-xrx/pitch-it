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
import ListItem from './ListItem';
import CallApi from '../lib/CallApi';

export default class ParticipantListItem extends ListItem {
  constructor(id, classes, listObject) {
    super(id, ["participant-list-item"].concat(classes), listObject);
    let labelBox = new FacadeElement(undefined, ["label-box"], this._listObject.label);
    let profileImage;
    if (listObject.state === CallApi.ACTIVE) {
      profileImage = new FacadeElement(undefined, ["profile-image"], this._listObject.label.substring(0,2));
    } else {
      profileImage = new FacadeElement(undefined, ["loading"], '', 'connecting');
    }
    this._children = [labelBox, profileImage];
  }

  render() {
    this._compiled = document.createElement('li');
    this._attachClasses(this._compiled);
    this._attachEvents(this._compiled);
    this._compiled.id = this._id;
    this._renderChildren();
    return this._compiled;
  }
}