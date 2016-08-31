/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

'use strict';
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const express = require('express');
const CallManager = require('./lib/CallManager');
const logger = require('./lib/Logger').getInstance();
const SocketManager = require('./lib/SocketManager');
const message_types = require('./shared/Message_Types');

class Server {
  constructor(config) {
    this._app = express();

    let assetPath = path.join(__dirname + '/asset');
    this._app.use(express.static(assetPath));
    
    if (config.https) {
      this._httpsServer = this._setupHttpsServer(config.https.key, config.https.certificate, config.https.passphrase);
    }

    this._httpServer = http.createServer();
    if (this._httpsServer) {
      this._setupSocketServer(this._httpsServer);
      this._httpsServer.on('request', this._app);
      logger.info('Start https at port ' + config.https.port);
      this._httpsServer.listen(config.https.port, () => {
        logger.debug('https running');
      });
      let httpApp = express();
      httpApp.use((req, res) => {
        let createRedirectUrl = 'https://' + req.hostname;
        createRedirectUrl += (req.port) ? ':' + req.port : '';
        createRedirectUrl += req.originalUrl;
        res.redirect(301, createRedirectUrl);
      });
      this._httpServer.on('request', httpApp);
    } else {
      this._setupSocketServer(this._httpServer);
      this._httpServer.on('request', this._app);
    }
    
    logger.info('Start http at port ' + config.port);
    this._httpServer.listen(config.port, () => {
      logger.debug('http running');
    });
  }

  _setupHttpsServer(keyPath, certPath, passphrase) {
      try {
        let key = fs.readFileSync(keyPath).toString();
        let cert = fs.readFileSync(certPath).toString();
        let credentials = {
          key: key,
          cert: cert,
          passphrase: passphrase || null
        };
        return https.createServer(credentials);
      } catch (err) {
        logger.error("Error reading https certificate or key: " + err);
      }
  }

  _setupSocketServer(server) {
    this._socketManager = new SocketManager(server);
    this._callManager = new CallManager(this._socketManager);
    
    this._registerMessageHandlers();
  }
  
  _registerMessageHandlers() {
    this._socketManager.registerMessageHandler(message_types.CALL_CREATE, this._createCallHandler.bind(this));
    this._socketManager.registerMessageHandler(message_types.RTC_OFFER, this._rtcOfferHandler.bind(this));
    this._socketManager.registerMessageHandler(message_types.RTC_ICE_CANDIDATE, this._rtcIceCandidateHandler.bind(this));
    this._socketManager.registerMessageHandler(message_types.RTC_ANSWER, this._rtcAnswerHandler.bind(this));
    this._socketManager.registerMessageHandler(message_types.DRAW_DRAWING, this._drawDrawingHandler.bind(this));
    this._socketManager.registerMessageHandler(message_types.REGISTER, this._register.bind(this));    
  }

  _register(origin, msg) {
    this._socketManager.assignUser(origin, msg.username);
    this._socketManager.broadcastContacts();
  }
  
  _createCallHandler(origin, msg) {
    if (this._socketManager.exist(msg.target)) {
      let callID = this._callManager.registerCall(origin);
      this._socketManager.sendTo(origin, message_types.CALL_CREATE, {
        status: 'pending',
        callID: callID
      });
      this._socketManager.sendTo(msg.target, message_types.CALL_OFFER, {
        callID: callID,
        caller: this._socketManager.getUserOf(origin)
      }); 
    } else {
      this._socketManager.sendErrorTo(origin, 'Target does not exist');
    }
  }
  
  _rtcOfferHandler(origin, msg) {
    let call = this._callManager.getCall(msg.callID);
    if (call) {
      call.sendOffer(msg.offer);
    } else {
      this._socketManager.sendErrorTo(origin, 'Call does not exist ' + msg.callID);
    }
  }
  
  _rtcIceCandidateHandler(origin, msg) {
    let call = this._callManager.getCall(msg.callID);
    if (call) {
      var owner = call.getOwner(),
          participants = call.getParticipants();
      if (origin === owner) {
        this._socketManager.sendTo(participants, msg.type, msg);
      } else {
        this._socketManager.sendTo(owner, msg.type, msg);
      }
    } else {
      this._socketManager.sendErrorTo(origin, 'Call does not exist ' + msg.callID);
    }
  }
  
  _rtcAnswerHandler(origin, msg) {
    let call = this._callManager.getCall(msg.callID);
    if (call) {
      call.sendAnswer(msg.answer);
    } else {
      this._socketManager.sendErrorTo(origin, 'Call does not exist ' + msg.callID);
    }
  }
  
  _drawDrawingHandler(origin, msg) {
    let call = this._callManager.getCall(msg.callID);
    if (call) {
      call.broadcastDraw(origin, msg);
    } else {
      this._socketManager.sendErrorTo(origin, 'Call does not exist ' + msg.callID);
    }
  }
}

module.exports = Server;