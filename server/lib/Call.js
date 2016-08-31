/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

'use strict';
const crypto = require('crypto');
const logger = require('./Logger').getInstance();
const message_types = require('../shared/Message_Types');

class Call {
  constructor(owner, socketManager) {
    this._socketManager = socketManager;
    this._owner = owner;
    this._participants = [];
    this._callID = this._createCallId();
  }
  
  _createCallId() {
    let timestamp = Date.now();
    let random = Math.random() * 1000;
    let hashFunc = crypto.createHash('md5');
    let callID;
    hashFunc.update(timestamp.toString() + random.toString());
    callID = hashFunc.digest('hex');
    callID = callID.substr(0, 5);
    return callID.toUpperCase();
  }
  
  renewCallId() {
    // todo - find better solution to make callId unique so renew function is not needed anymore
    this._callID = _createCallId();
  }
  
  getCallId() {
    return this._callID;
  }
  
  getOwner() {
    return this._owner;
  }
  
  getParticipants() {
    return this._participants;
  }
  
  addParticipant(participant) {
    this._participants.push(participant);
  }
  
  establish() {
    if (this._owner && this._participants.length > 0 && this._participants[0]) {
      this._socketManager.sendTo(this._owner, message_types.CALL_ESTABLISH, {
        task: 'offer'
      });

      this._socketManager.sendTo(this._participants, message_types.CALL_ESTABLISH, {
        task: 'answer'
      });
    } else {
      logger.error('Cannot establish call with ' + this._owner + ' and ' + this._participants);
    }
  }
  
  sendOffer(offer) {
    if (offer && this._participants.length > 0 && this._participants[0]) {
      this._socketManager.sendTo(this._participants, message_types.RTC_OFFER, {
        offer: offer
      });
    } else {
      logger.error('Cannot send offer');
    }
  }
  sendAnswer(answer) {
    if (answer && this._owner) {
      this._socketManager.sendTo(this._owner,  message_types.RTC_ANSWER, {
        answer: answer
      });
    } else {
      logger.error('Cannot send answer');
    }
  }
  broadcastDraw(origin, msg) {
    let targets = [];
    if (origin !== this._owner) {
      targets.push(this._owner);
    }
    let filteredParticipants = this._participants.filter((participant) => {
      return (participant !== origin);
    });
    targets = targets.concat(filteredParticipants);
    this._socketManager.sendTo(targets, message_types.DRAW_DRAWING, {
      data: msg.data
    });
  }
}

module.exports = Call;