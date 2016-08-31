/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

import message_types from '../../shared/Message_Types';

export default class DrawHandler {
  constructor(socket, recieveDrawingCallback) {
    this._socket = socket;
    this._recieveDrawingCallback = recieveDrawingCallback;
    this._socket.registerMessageHandler(message_types.DRAW_DRAWING, this._drawReceived.bind(this));
  }
  
  sendDrawing(callID, data) {
    this._socket.send({
      type: message_types.DRAW_DRAWING,
      callID: callID,
      data: data
    });
  }
  
  _drawReceived(msg) {
    console.log('Recieved call data');
    this._recieveDrawingCallback(msg.data);
  }
}