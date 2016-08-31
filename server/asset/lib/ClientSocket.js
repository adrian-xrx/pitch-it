/**
 * BSD-Licensed
 * @author J-Pi
 */

'use strict';
export default class ClientSocket {
  constructor(host, port, connected, disconnected) {
    this._messageHandlers = {};
    this._connectedCallback = connected;
    this._disconnectedCallback = disconnected;
    let socketURL = (this._isTLS() ? 'wss' : 'ws') + '://' + host + ':' + port;
    this._socket = new WebSocket(socketURL);
    this._socket.onopen = connected;
    this._socket.onclose = disconnected;
    this._socket.onmessage = this._handleMessage.bind(this);
  }
  
  _isTLS() {
    return (window.location.protocol === 'https:')
  }

  _connected() {
    console.log('Connected');
    if (this._connectedCallback) {
      this._connectedCallback();
    }
  }
  
  _disconnected() {
    console.log('disconnected');
    if (this._disconnectedCallback) {
      this._disconnectedCallback();
    }
  }
  
  _handleMessage(msg) {
    msg = JSON.parse(msg.data);
    if (this._messageHandlers[msg.type]) {
      let handlers = this._messageHandlers[msg.type];
      handlers.forEach((handler) => {
        handler(msg.data);
      });
    } else {
      console.warn('No handler found for type ' + msg.type);
    }
  }
  
  send(msg) {
    this._socket.send(JSON.stringify(msg));
  }
  
  registerMessageHandler(type, handler) {
    if (!this._messageHandlers[type]) {
      this._messageHandlers[type] = [];
    }
    this._messageHandlers[type].push(handler);
  }
}
