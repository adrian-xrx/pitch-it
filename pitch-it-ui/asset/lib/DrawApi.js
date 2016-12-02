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

import Message from '../../../shared/Message';

export default class DrawApi {
  constructor(socket) {
    this._socket = socket;
    this._socket.on(Message.DRAW_PATH, (msg) => this._remoteDraw(msg));
    this._socket.on(Message.DRAW_CLEAR, () => this._remoteClear());
  }

  static get CLOSE() {
    return 'close';
  }

  static get KEEEP() {
    return 'keep';
  }

  set remoteDrawCallback(callback) {
    this._remoteDrawCallback = callback;
  }

  set remoteClearCallback(callback) {
    this._remoteClearCallback = callback;
  }

  _remoteDraw(msg) {
    if(this._remoteDrawCallback) {
      this._remoteDrawCallback(msg.data.position.x, msg.data.position.y, msg.data.close);
    }
  }

  _remoteClear() {
    if (this._remoteClearCallback) {
      this._remoteClearCallback();
    }
  }

  sendPathData(target, x, y, closeType) {
    let msg = new Message(Message.DRAW_PATH,{position: {x:x, y:y}, close: closeType, target: target});
    this._socket.send(msg);
  }

  sendClear(target) {
    let msg = new Message(Message.DRAW_CLEAR, {target: target});
    this._socket.send(msg);
  }
}