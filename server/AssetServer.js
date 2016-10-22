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
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const express = require('express');
const CallManager = require('./lib/CallManager');
const logger = require('./lib/Logger').getInstance();
const SocketManager = require('./lib/SocketManager');
const Call = require('./shared/types/Call');
const RTC = require('./shared/types/RTC');
const Draw = require('./shared/types/Draw');
const Authentication = require('./shared/types/Authentication');

class AssetServer {
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
    this._socketManager.registerMessageHandler(Call.CREATE.TYPE, this._createCallHandler.bind(this));
    this._socketManager.registerMessageHandler(RTC.OFFER.TYPE, this._rtcOfferHandler.bind(this));
    this._socketManager.registerMessageHandler(RTC.ICE_CANDIDATE.TYPE, this._rtcIceCandidateHandler.bind(this));
    this._socketManager.registerMessageHandler(RTC.ANSWER.TYPE, this._rtcAnswerHandler.bind(this));
    this._socketManager.registerMessageHandler(Draw.DRAWING.TYPE, this._drawDrawingHandler.bind(this));
    this._socketManager.registerMessageHandler(Authentication.REGISTER.TYPE, this._register.bind(this));    
  }

  _register(origin, msg) {
    this._socketManager.assignUser(origin, msg.username);
    this._socketManager.broadcastContacts();
  }
  
  _createCallHandler(origin, msg) {
    if (this._socketManager.exist(msg.target)) {
      let callID = this._callManager.registerCall(origin);
      this._socketManager.sendTo(origin, Call.CREATE.TYPE, {
        status: 'pending',
        callID: callID
      });
      this._socketManager.sendTo(msg.target, Call.OFFER.TYPE, {
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

module.exports = AssetServer;