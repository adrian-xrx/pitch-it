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
const logger = require('./Logger').getInstance();
const TypeCall = require('../shared/types/Call');
const TypeRTC = require('../shared/types/RTC');
const TypeDraw = require('../shared/types/Draw');

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
      this._socketManager.sendTo(this._owner, TypeCall.ESTABLISH.TYPE, {
        task: 'offer'
      });

      this._socketManager.sendTo(this._participants, TypeCall.ESTABLISH.TYPE, {
        task: 'answer'
      });
    } else {
      logger.error('Cannot establish call with ' + this._owner + ' and ' + this._participants);
    }
  }
  
  sendOffer(offer) {
    if (offer && this._participants.length > 0 && this._participants[0]) {
      this._socketManager.sendTo(this._participants, TypeRTC.OFFER.TYPE, {
        offer: offer
      });
    } else {
      logger.error('Cannot send offer');
    }
  }
  sendAnswer(answer) {
    if (answer && this._owner) {
      this._socketManager.sendTo(this._owner,  TypeRTC.ANSWER.TYPE, {
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
    this._socketManager.sendTo(targets, TypeDraw.DRAWING.TYPE, {
      data: msg.data
    });
  }
}

module.exports = Call;