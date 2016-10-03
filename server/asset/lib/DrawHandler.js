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

import message_types from '../../shared/Message_Types';

export default class DrawHandler {
  constructor(socket, recieveDrawingCallback, clearDrawingCallback) {
    this._socket = socket;
    this._recieveDrawingCallback = recieveDrawingCallback;
    this._clearDrawingCallback = clearDrawingCallback;
    this._socket.registerMessageHandler(message_types.DRAW_DRAWING, this._drawReceived.bind(this));
    this._socket.registerMessageHandler(message_types.DRAW_CLEAR, this._drawClearReceived.bind(this));
  }
  
  sendDrawing(callID, data) {
    this._socket.send({
      type: message_types.DRAW_DRAWING,
      callID: callID,
      data: data
    });
  }

  sendClear(callID) {
    this._socket.send({
      type: message_types.DRAW_CLEAR,
      callID: callID
    });
  }
  
  _drawReceived(msg) {
    console.log('Recieved draw data');
    this._recieveDrawingCallback(msg.data);
  }

  _drawClearReceived() {
    console.log('Recieved draw clear');
    this._clearDrawingCallback();
  }
}