/**
 * BSD-Licensed
 * @author J-Pi
 */

'use strict';
import message_types from '../../shared/Message_Types';
import config from '../config';

export default class Call {
  constructor(socket, target, remoteStreamAdded) {
    window.PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    window.SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
    window.IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

    this._socket = socket;
    this._remoteStreamAddedCallback = remoteStreamAdded;
    this._connection = new PeerConnection({
      iceServers: config.stun.concat(config.turn)
    });
    
    this._connection.onaddstream = this._onRemoteStreamAdded.bind(this);
    this._connection.onicecandidate = this._onIceCandidateAdded.bind(this);
    
    this._socket.registerMessageHandler(message_types.RTC_ICE_CANDIDATE, this._gotIceCandidate.bind(this));
    this._socket.registerMessageHandler(message_types.RTC_OFFER, this._gotOffer.bind(this));
    this._socket.registerMessageHandler(message_types.RTC_ANSWER, this._gotAnswer.bind(this));
    
    this._socket.registerMessageHandler(message_types.CALL_CREATE, this._createCall.bind(this));
    this._socket.registerMessageHandler(message_types.CALL_ESTABLISH, this._establishCall.bind(this));
    this._socket.registerMessageHandler(message_types.FAIL, this._failed.bind(this));
    
    // create call if target is defined
    if (target) {
      this._socket.send({
        type: message_types.CALL_CREATE,
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
      type: message_types.CALL_JOIN,
      callID: this._callID
    });
  }
  
  _onIceCandidateAdded(evt) {
    if (evt && evt.candidate) {
      this._socket.send({
        type: message_types.RTC_ICE_CANDIDATE,
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
    navigator.getUserMedia({video: true, audio: true}, (stream) => {
      this._connection.addStream(stream);
      this._connection.createOffer((offer) => {
        this._connection.setLocalDescription(new SessionDescription(offer), () => {
          this._socket.send({
            type: message_types.RTC_OFFER,
            callID: this._callID,
            offer: offer
          });
        }, this._error.bind(this));
      }, this._error.bind(this));
    }, this._error.bind(this));
  }
  
  _gotOffer(msg) {
    if (msg.offer) {
      let videoConstrains = {
        width: {
          min: 200,
          ideal: 300,
          max: 400
        },
        height: {
          min: 200,
          ideal: 300,
          max: 400
        },
      }
      navigator.getUserMedia({video: videoConstrains, audio: true}, (stream) => {
        this._connection.addStream(stream);
        this._connection.setRemoteDescription(new SessionDescription(msg.offer), () => {
          this._connection.createAnswer((answer) => {
            this._connection.setLocalDescription(new SessionDescription(answer), () => {
              this._socket.send({
                type: message_types.RTC_ANSWER,
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
      this._connection.setRemoteDescription(new SessionDescription(msg.answer));
    }
  }
  
  _gotIceCandidate(msg) {
    if (msg.candidate) {
      this._connection.addIceCandidate(new IceCandidate(msg.candidate));  
    }
  }
  
  _error(err) {
    console.error('Error occured: ' + err);
  }
  
  _failed(msg) {
    console.error('Call failed: ' + msg.reason);
  }
}