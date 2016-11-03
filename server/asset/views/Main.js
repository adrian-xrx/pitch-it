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

import FacadeView from '../lib/FacadeView';
import Logo from '../components/Logo';
import UserMenu from '../components/UserMenu';
import SideFrame from '../components/SideFrame';
import CookieApi from '../lib/CookieApi';
import List from '../components/List';

export default class Main extends FacadeView {
  constructor(domTarget, userApi) {
    super(domTarget);
    this._userApi =  userApi;
    this._root.addClass('main-view');
    super.appendChild(new Logo());
    let username = this._parseUsername();
    this._userMenu = new UserMenu(undefined, undefined, username);
    this._userMenu.on('click', this._sideFrameUserList.bind(this));
    super.appendChild(this._userMenu);
    this._sideFrame = new SideFrame();
    super.appendChild(this._sideFrame);
  }

  _parseUsername() {
    let token = CookieApi.getValue('token');
    return (token) ? token.split('.')[1] : "";
  }

  update() {
    let username = this._parseUsername();
    this._userMenu.update(username);
  }

  _sideFrameUserList() {
    let userListItems = this._userApi.list().map((user) => {
      user.label = user.name;
      return user;
    });
    let userList = new List(undefined, undefined, userListItems);
    userList.onChild('click', this._onUserAdd.bind(this));
    this._sideFrame.setTitle('Users');
    this._sideFrame.update([userList]);
    this._sideFrame.show();
  }

  _onUserAdd(origEvent, item) {
    console.log(item);
  }
}