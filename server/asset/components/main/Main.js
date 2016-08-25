/**
 * BSD-Licensed, J-Pi
 */

import React from 'react';
import './main.less';

import config from '../../config';
import message_types from '../../../shared/Message_Types';

import Header from '../header/Header';
import RoomList from '../roomList/RoomList';
import Video from '../video/Video';
import Draw from '../draw/Draw';
import CallRespond from '../callRespond/CallRespond';

import Call from '../../lib/Call';
import DrawHandler from '../../lib/DrawHandler';
import ClientSocket from '../../lib/ClientSocket';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      contacts: [],
      stream: null,
      joinData: null,
      user: {}
    };
    this._socket = new ClientSocket(config.socket.host, config.socket.port, () => {
      this._socket.send({
        type: message_types.REGISTER,
        username: window.username
      });
    });

    this._socket.registerMessageHandler(message_types.REGISTER, this._onRegistered.bind(this));

    this._socket.registerMessageHandler(message_types.CONTACT_LIST, this._displayContacts.bind(this));
    this._socket.registerMessageHandler(message_types.CALL_OFFER, this._joinOffer.bind(this));
    
    this._drawHandler = new DrawHandler(this._socket, this._receiveDraw.bind(this));
  }
  _remoteStreamAdded(stream) {
    this.setState({
      remoteStream: stream 
    });
  }
  _onRegistered(msg) {
    if (msg.user) {
      this.setState({
        user: {
          id: msg.user.id,
          name: msg.user.name
        }
      });
    }
  }
  _displayContacts(msg) {
    this.setState({
      contacts: msg.contacts
    });
  }
  _createCall(contact) {
    if (contact && contact.id) {
      console.log('Create Call -> ' + contact.id);
      this._call = new Call(this._socket, contact.id, this._remoteStreamAdded.bind(this));
    }
  }
  _joinOffer(callData) {
    console.log(callData);
    this.setState({
      joinData: callData
    });
    this._call = new Call(this._socket, undefined, this._remoteStreamAdded.bind(this));
    this._call.setCallId(callData.callID);
  }
  _joinCall() {
    this.setState({
      joinData: {}
    });
    this._call.join();
  }
  _declineCall() {
    this.setState({
      joinData: {}
    });
    console.log('Decline call');
  }
  _sendDraw(drawData) {
    if (this._call) {
      this._drawHandler.sendDrawing(this._call.getCallId(), drawData); 
    }
  }
  _receiveDraw(drawData) {
    this.refs.drawArea.performDraw(drawData);
  }
  render () {
    if (this.state.remoteStream) {
      return (
        <div className="main">
          <Header user={this.state.user}/>
          <Video stream={this.state.remoteStream} noVideo="No Stream" />
          <Draw
            ref="drawArea"
            width="600px"
            height="200px"
            onDraw={this._sendDraw.bind(this)}/>
        </div>
      );
    } else {
      return (
        <div className="main">
          <Header user={this.state.user}/>
          <RoomList
            header="Rooms"
            data={this.state.contacts}
            onItemClicked={this._createCall.bind(this)}/>
          <CallRespond
            data={this.state.joinData}
            accept={this._joinCall.bind(this)}
            decline={this._declineCall.bind(this)}/>
        </div>
      );
    }
  }
}