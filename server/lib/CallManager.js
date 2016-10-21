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

'use strict';
const crypto = require('crypto');
const Call = require('./Call');
const logger = require('./Logger').getInstance();
const TypeCall = require('../shared/types/Call');
const TypeFail = require('../shared/types/Fail');

class CallManager {
  constructor(socketManager) {
    this._activeCalls = {};
    this._socketManager = socketManager;
    
    this._socketManager.registerMessageHandler(TypeCall.JOIN.TYPE, this._joinCall.bind(this));
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
      this._socketManager.sendTo(origin, TypeFail.FAIL.TYPE, {
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