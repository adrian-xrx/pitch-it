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
import TypeCall from '../../shared/types/Call';
import TypeRTC from '../../shared/types/RTC';
import TypeFail from '../../shared/types/Fail';
import config from '../config';

export default class Call {

  static get ICE_CANDIDATE() {
    return window.mozRTCIceCandidate || window.RTCIceCandidate;
  }

  static get SESSION_DESCRIPTION() {
    return window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
  }
  
  static get PEER_CONNECTION () {
    return window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  }

  constructor(socket, target, remoteStreamAdded) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    this._socket = socket;
    this._remoteStreamAddedCallback = remoteStreamAdded;
    this._connection = new Call.PEER_CONNECTION({
      iceServers: config.stun.concat(config.turn)
    });
    
    this._connection.onaddstream = this._onRemoteStreamAdded.bind(this);
    this._connection.onicecandidate = this._onIceCandidateAdded.bind(this);
    
    this._socket.registerMessageHandler(TypeRTC.ICE_CANDIDATE.TYPE, this._gotIceCandidate.bind(this));
    this._socket.registerMessageHandler(TypeRTC.OFFER.TYPE, this._gotOffer.bind(this));
    this._socket.registerMessageHandler(TypeRTC.ANSWER.TYPE, this._gotAnswer.bind(this));
    
    this._socket.registerMessageHandler(TypeCall.CREATE.TYPE, this._createCall.bind(this));
    this._socket.registerMessageHandler(TypeCall.ESTABLISH.TYPE, this._establishCall.bind(this));
    this._socket.registerMessageHandler(TypeFail.FAIL.TYPE, this._failed.bind(this));
    
    // create call if target is defined
    if (target) {
      this._socket.send({
        type: TypeCall.CREATE.TYPE,
        target: target
      }); 
    }
  }
  
  getCallId() {
    return this._callID;
  }
  
  setCallId(callId) {
    this._callID = callId;
  }
  
  join() {
    console.log('Join call ' + this._callID);
    this._socket.send({
      type: TypeCall.JOIN.TYPE,
      callID: this._callID
    });
  }
  
  _onIceCandidateAdded(evt) {
    if (evt && evt.candidate) {
      this._socket.send({
        type: TypeRTC.ICE_CANDIDATE.TYPE,
        callID: this._callID,
        candidate: evt.candidate
      });
    }
  }
  
  _onRemoteStreamAdded(obj) {
    if (this._remoteStreamAddedCallback) {
      let stream = window.URL.createObjectURL(obj.stream);
      this._remoteStreamAddedCallback(stream);
    }
  }
    
  _createCall (msg) {
    console.log('Call created ' + msg.callID);
    this.setCallId(msg.callID);
  }
  
  _establishCall(msg) {
    if (msg.task === 'offer') {
      this._offer();
    } else {
      console.info('Wait for offer');
    }
  }
  
  _offer() {
    navigator.getUserMedia({audio: true}, (stream) => {
      this._connection.addStream(stream);
      this._connection.createOffer((offer) => {
        this._connection.setLocalDescription(new Call.SESSION_DESCRIPTION(offer), () => {
          this._socket.send({
            type: TypeRTC.OFFER.TYPE,
            callID: this._callID,
            offer: offer
          });
        }, this._error.bind(this));
      }, this._error.bind(this));
    }, this._error.bind(this));
  }
  
  _gotOffer(msg) {
    if (msg.offer) {
      navigator.getUserMedia({audio: true}, (stream) => {
        this._connection.addStream(stream);
        this._connection.setRemoteDescription(new Call.SESSION_DESCRIPTION(msg.offer), () => {
          this._connection.createAnswer((answer) => {
            this._connection.setLocalDescription(new Call.SESSION_DESCRIPTION(answer), () => {
              this._socket.send({
                type: TypeRTC.ANSWER.TYPE,
                callID: this._callID,
                answer: answer
              });
            }, this._error.bind(this));
          }, this._error.bind(this));
        }, this._error.bind(this));
      }, this._error.bind(this));
    }
  }
  
  _gotAnswer(msg) {
    if (msg.answer) {
      this._connection.setRemoteDescription(new Call.SESSION_DESCRIPTION(msg.answer));
    }
  }
  
  _gotIceCandidate(msg) {
    if (msg.candidate) {
      this._connection.addIceCandidate(new Call.ICE_CANDIDATE(msg.candidate));  
    }
  }
  
  _error(err) {
    console.error('Error occured: ' + err);
  }
  
  _failed(msg) {
    console.error('Call failed: ' + msg.reason);
  }
}