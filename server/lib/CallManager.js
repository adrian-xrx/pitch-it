/**
 * BSD-Licensed, J-Pi
 */

'use strict';
const crypto = require('crypto');
const Call = require('./Call');
const logger = require('./Logger').getInstance();
const message_types = require('../shared/Message_Types');

class CallManager {
  constructor(socketManager) {
    this._activeCalls = {};
    this._socketManager = socketManager;
    
    this._socketManager.registerMessageHandler(message_types.CALL_JOIN, this._joinCall.bind(this));
  }
  
  registerCall(owner) {
    let call = new Call(owner, this._socketManager);
    let callID = call.getCallId();
    while (this.exist(callID)) {
      call.renewCallId();
      callID = call.getCallId();
    }
    logger.info('Created Call with ID ' + callID);
    this._activeCalls[callID] = call;
    return callID;
  }
  
  _joinCall(origin, msg) {
    logger.debug('Join call ' + msg.callID);
    if (this.exist(msg.callID)) {
      var call = this._activeCalls[msg.callID];
      call.addParticipant(origin);
      call.establish();
    } else {
      logger.warn('Call does not exist -> ' + msg.callID);
      this._socketManager.sendTo(origin, message_types.FAIL, {
        reason: 'Call does not exist -> ' + msg.callID
      });
    }
  }
  
  exist(callID) {
    if (this._activeCalls[callID]) {
      return true;
    } else {
      return false;
    }
  }
  
  getCall(callID) {
    return this._activeCalls[callID];
  }
}

module.exports = CallManager;