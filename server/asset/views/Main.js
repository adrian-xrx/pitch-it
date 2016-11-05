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
import FacadeElement from '../lib/FacadeElement';
import Logo from '../components/Logo';
import UserMenu from '../components/UserMenu';
import SideFrame from '../components/SideFrame';
import DialogFrame from '../components/DialogFrame';
import CookieApi from '../lib/CookieApi';
import List from '../components/List';
import ParticipantList from '../components/ParticipantList';
import Whiteboard from '../components/Whiteboard';

export default class Main extends FacadeView {
  constructor(domTarget, authApi, userApi, callApi, drawApi) {
    super(domTarget);
    this._userApi = userApi;
    this._callApi = callApi;
    this._drawApi = drawApi;
    this._whiteboard = new Whiteboard(undefined, undefined);
    this._whiteboard.drawCallback = (x, y, close) => this._forwardDrawData(x, y, close);
    super.appendChild(this._whiteboard);
    this._root.addClass('main-view');
    super.appendChild(new Logo());
    let username = this._parseUsername();
    let menuEntries = [{
      label: 'Add Participant',
      action: () => this._sideFrameUserList()
    }, {
      label: 'Clear Whiteboard',
      action: () => this._clearWhiteboard()
    }, {
      label: 'Logout',
      action: () => authApi.logout()
    }];
    this._userMenu = new UserMenu(undefined, undefined, username, menuEntries);
    super.appendChild(this._userMenu);
    this._sideFrame = new SideFrame();
    super.appendChild(this._sideFrame);
    this._dialogFrame = new DialogFrame(undefined, undefined, undefined, undefined, () => this._acceptCall(), () => this._rejectCall());
    super.appendChild(this._dialogFrame);
    this._participantList = new ParticipantList(undefined, undefined, []);
    super.appendChild(this._participantList);

    this._callApi.offerCallback = (origin) => this._recievedOffer(origin);
    this._callApi.activeCallback = () => this._activeCallback();
    this._callApi.rejectCallback = () => this._offerRejected();

    this._drawApi.remoteDrawCallback = (x, y, close) => this._whiteboard.drawRemote(x, y, close);
    this._drawApi.remoteClearCallback = () => this._whiteboard.clear();
  }

  _parseUsername() {
    let token = CookieApi.getValue('token');
    return (token) ? token.split('.')[1] : "";
  }

  init() {
    let username = this._parseUsername();
    this._userMenu.update(username);
    this._sideFrame.reset();
    this._whiteboard.clear();
  }

  _recievedOffer(origin) {
    this._dialogFrame.setTitle('Join');
    this._dialogFrame.setOkLabel('Accept');
    this._dialogFrame.setCancelLabel('Decline');
    this._dialogFrame.update(new FacadeElement(undefined, undefined, `Do you what to join the whiteboard of ${origin}?`));
    this._dialogFrame.show();
  }

  _acceptCall() {
    this._callApi.acceptCall();
    let participants = this._convertParticipants();
    this._participantList.update(participants);
  }

  _activeCallback() {
    let participants = this._convertParticipants();
    this._participantList.update(participants);
  }

  _convertParticipants() {
    let participants = this._callApi.getParticipants().map((participant) => {
      participant.label = participant.name;
      return participant;
    });
    return participants;
  }

  _offerRejected() {
    this._participantList.clear();
  }

  _rejectCall() {
    this._callApi.rejectCall();
  }
  
  _forwardDrawData(x, y, closeType) {
    this._callApi.getParticipants().forEach((participant) => {
      this._drawApi.sendPathData(participant.name, x, y, closeType);
    });
  }

  _clearWhiteboard() {
    this._callApi.getParticipants().forEach((participant) => {
      this._drawApi.sendClear(participant.name);
    });
    this._whiteboard.clear();
  }

  _sideFrameUserList() {
    let userListItems = this._userApi.list().map((user) => {
      user.label = user.name;
      user.action = (evt, item) => {
        this._onUserAdd(evt, item);
      };
      return user;
    });
    let userList = new List(undefined, undefined, userListItems);
    this._sideFrame.setTitle('Users');
    this._sideFrame.update([userList]);
    this._sideFrame.show();
  }

  _onUserAdd(origEvent, item) {
    this._sideFrame.hide();
    this._callApi.offerCall(item.name);
    let participants = this._convertParticipants();
    this._participantList.update(participants);
  }
}