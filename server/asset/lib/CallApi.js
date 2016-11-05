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
import Message from '../../../shared/Message';
import config from '../config';

export default class CallApi {

  static get ICE_CANDIDATE() {
    return window.mozRTCIceCandidate || window.RTCIceCandidate;
  }

  static get SESSION_DESCRIPTION() {
    return window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
  }
  
  static get PEER_CONNECTION () {
    return window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  }

  static get ACTIVE() {
    return 'active';
  }

  static get PENDING() {
    return 'pending';
  }

  constructor(clientSocket) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    this._socket = clientSocket;
    this._socket.on(Message.CALL_OFFER, (msg) => this._gotOffer(msg));
    this._socket.on(Message.CALL_REJECT, (msg) => this._gotRejection(msg));
    this._socket.on(Message.CALL_ACCEPT, (msg) => this._gotAcceptance(msg));
    this._socket.on(Message.RTC_OFFER, (msg) => this._gotRTCOffer(msg));
    this._socket.on(Message.RTC_ANSWER, (msg) => this._gotRTCAnswer(msg));
    this._socket.on(Message.RTC_ICE_CANDIDATE, (msg) => this._gotRTCIceCandidate(msg));
    this._participant;
    this._pendingParticipant;
  }

  set offerCallback(offerCallback) {
    this._offerCallback = offerCallback;
  }

  set acceptCallback(acceptCallback) {
    this._acceptCallback = acceptCallback;
  }

  set rejectCallback(rejectCallback) {
    this._rejectCallback = rejectCallback;
  }

  set activeCallback(activeCallback) {
    this._activeCallback = activeCallback;
  }

  set hangupCallback(hangupCallback) {
    this._hangupCalblack = hangupCallback;
  }

  getParticipants() {
    let participants = [];
    if (this._participant) {
      participants.push({
        name: this._participant,
        state: CallApi.ACTIVE
      });
    }
    if (this._pendingParticipant) {
      participants.push({
        name: this._pendingParticipant,
        state: CallApi.PENDING
      });
    }
    return participants;
  }

  _initRTCConnection() {
    let iceServers = [];
    if (config.stun) {
      iceServers = iceServers.concat(config.stun);
    }
    if (config.turn) {
      iceServers = iceServers.concat(config.turn);
    }
    this._connection = new CallApi.PEER_CONNECTION({
      iceServers: iceServers
    });
    this._connection.onaddstream = (obj) => this._onRemoteStreamAdded(obj);
    this._connection.onicecandidate = (evt) => this._onIceCandidateAdded(evt);
  }
  
  offerCall(target) {
    if (!this._pendingParticipant && !this._participant) {
      this._pendingParticipant = target;
      let msg = new Message(Message.CALL_OFFER, {target: target});
      this._socket.send(msg);
    } else {
      console.error('Only one participant is supported per call');
    }
  }

  _gotOffer(msg) {
    this._pendingParticipant = msg.origin;
    if (this._offerCallback) {
      this._offerCallback(msg.origin);
    }
  }

  acceptCall() {
    this._participant = this._pendingParticipant;
    this._pendingParticipant = undefined;
    this._initRTCConnection();
    let msg = new Message(Message.CALL_ACCEPT, {target: this._participant});
    this._socket.send(msg);
  }

  _gotAcceptance(msg) {
    this._participant = this._pendingParticipant;
    this._pendingParticipant = undefined;
    this._initRTCConnection();
    this.rtcOffer();
  }

  rejectCall() {
    let msg = new Message(Message.CALL_REJECT, {target: this._pendingParticipant});
    this._socket.send(msg);
    this._pendingParticipant = undefined;
  }

  _gotRejection(msg) {
    this._pendingParticipant = undefined;
    if(this._rejectCallback) {
      this._rejectCallback();
    }
  }

  hangupCall() { 
    // send hangup, stop audio and cleanup
    // destroy peer connection, remove participant, ...
  }

  _gotHangup() {
    // todo - top audio and cleanup
    // destroy peer connection, remove participant, ...
  }

  rtcOffer(target) {
    navigator.getUserMedia({audio: true}, (stream) => {
      this._connection.addStream(stream);
      this._connection.createOffer((offer) => {
        this._connection.setLocalDescription(new CallApi.SESSION_DESCRIPTION(offer), () => {
          let msg = new Message(Message.RTC_OFFER, {target: this._participant, offer: offer});
          this._socket.send(msg);
        }, (err) => console.error(err));
      }, (err) => console.error(err));
    }, (err) => console.error(err));
  }

  _gotRTCOffer(msg) {
    if (msg.data.offer) {
      navigator.getUserMedia({audio: true}, (stream) => {
        this._connection.addStream(stream);
        this._connection.setRemoteDescription(new CallApi.SESSION_DESCRIPTION(msg.data.offer), () => {
          this.rtcAnswer();
        }, (err) => console.error(err));
      }, (err) => console.error(err));
    }
  }

  rtcAnswer() {
    this._connection.createAnswer((answer) => {
      this._connection.setLocalDescription(new CallApi.SESSION_DESCRIPTION(answer), () => {
        let msg = new Message(Message.RTC_ANSWER, {target: this._participant, answer: answer});
        this._socket.send(msg);
      }, (err) => console.error(err));
    }, (err) => console.error(err));
  }

  _gotRTCAnswer(msg) {
    if (msg.data.answer) {
      this._connection.setRemoteDescription(new CallApi.SESSION_DESCRIPTION(msg.data.answer));
    }
  }

  rtcIceCandidate(candidate) {
    if (candidate) {
      let msg = new Message(Message.RTC_ICE_CANDIDATE, {target: this._participant, candidate: candidate});
      this._socket.send(msg);
    }
  }

  _gotRTCIceCandidate(msg) {
    if (msg.data.candidate) {
      try {
        this._connection.addIceCandidate(new CallApi.ICE_CANDIDATE(msg.data.candidate));  
      } catch(err) {
        console.error('ICE candidate could not be added', err);
      }
    }
  }
  
  _onIceCandidateAdded(evt) {
    if (evt && evt.candidate) {
      this.rtcIceCandidate(evt.candidate);
    }
  }
  
  _onRemoteStreamAdded(obj) {
    let stream = window.URL.createObjectURL(obj.stream);
    this._audioStream = new Audio(stream);
    this._audioStream.play();
    if (this._activeCallback) {
      this._activeCallback();
    }
  }
}