/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

'use strict';
const WebSocketServer = require('ws').Server;
const SocketCache = require('./SocketCache');
const logger = require('./Logger').getInstance();
const message_types = require('../shared/Message_Types');

class SocketManager {
  constructor(server) {
    this._messageHandlers = {};
    this._socketCache = new SocketCache();
    
    let wss = new WebSocketServer({server: server});
    wss.on('connection', (ws) => {
      ws.id = this._socketCache.generateKey();
      logger.debug('Socket connected ' + ws.id);
      this._socketCache.add(ws.id, ws);
      ws.on('message', (msg) => {
        this._handleMessage(ws, JSON.parse(msg));
      });
      ws.on('close', () => {
        logger.debug('Disconnected ' + ws.id);
        this._socketCache.remove(ws.id);
        this.broadcastContacts();
      });
    });
  }
  
  registerMessageHandler(type, handler) {
    if (!this._messageHandlers[type]) {
      this._messageHandlers[type] = [];
    }
    this._messageHandlers[type].push(handler);
  }
  
  sendTo(targets, type, data) {
    if (!(targets instanceof Array)) {
      targets = [targets];
    }
    targets.forEach((target) => {
      logger.info('Send message ' + type + ' to ' + target);
      let socket = this._socketCache.get(target);
      if (socket) {
        let dataString = JSON.stringify({
          type: type,
          data: data
        });
        socket.send(dataString);
      } else {
        logger.warn('Socket ' + target + ' does not exist');
      }      
    });
  }
  
  sendErrorTo(targets, reason) {
    this.sendTo(targets, message_types.FAIL, {reason: reason});
  }
  
  exist(socketId) {
    if (this._socketCache.get(socketId)) {
      return true;
    } else {
      return false;
    }
  }
  
  _handleMessage(socket, msg) {
    logger.info('Got message ' + msg.type + ' from ' + socket.id);
    msg.origin = socket.id;
    if (this._messageHandlers[msg.type] && this._messageHandlers[msg.type].length > 0) {
      this._messageHandlers[msg.type].forEach((handler) => {
        handler(socket.id, msg);
      });
    } else {
      logger.warn('No handler defined for type: ' + msg.type);
    }
  }
  
  broadcastContacts() {
    let contacts = this._socketCache.list().map((item) => {
      let sock = this._socketCache.get(item);
      return {
        id: item,
        name: sock.user
      };
    });
    contacts.forEach((contact) => {
      this.sendTo(contact.id, message_types.CONTACT_LIST, {
        contacts: contacts.filter((item) => {
          return (item.id !== contact.id); 
        })
      });
    });
  }

  assignUser(socket, user) {
    this._socketCache.get(socket).user = user;
    this.sendTo(socket, message_types.REGISTER, {
      user: {
        id: socket,
        name: user
      }
    });
  }

  getUserOf(socket) {
    return this._socketCache.get(socket).user;
  }
}

module.exports = SocketManager;