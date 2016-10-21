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

const assert = require('assert');
const Call = require('../../server/lib/Call');
const TypeCall = require('../../server/shared/types/Call');
const TypeRTC = require('../../server/shared/types/RTC');
const TypeDraw = require('../../server/shared/types/Draw');

describe('Call', function () {
  var callInstance, socketManagerMock;

  beforeEach(function () {
    socketManagerMock = {
      sendTo: function () {}
    }
    callInstance = new Call('123', socketManagerMock);
  });

  it('should get the CallId', function () {
    let callId = callInstance.getCallId();
    assert.equal(typeof callId, 'string');
    assert.equal(callId.length, 5);
  });
  it('should get the Owner', function () {
    let owner = callInstance.getOwner();
    assert.equal(owner, '123');
  });
  it('should add and get the participants', function () {
    callInstance.addParticipant('321');
    let participants = callInstance.getParticipants();
    assert.equal(participants.length, 1);
    assert.equal(participants[0], '321');
  });
  describe('Call handling', function () {
    var funcResults;
    beforeEach(function () {
      callInstance.addParticipant('321');
      funcResults = {};
      socketManagerMock.sendTo = function (target, type, data) {
        funcResults[target] = {type: type, data: data};
      };
    })
    it('should establish a call', function () {
      callInstance.establish();
      assert.equal(Object.keys(funcResults).length, 2);
      assert.notEqual(typeof funcResults['123'], 'undefined');
      assert.equal(funcResults['123'].type, TypeCall.ESTABLISH.TYPE);
      assert.equal(funcResults['123'].data.task, 'offer');
      assert.notEqual(typeof funcResults['123'], 'undefined');
      assert.equal(funcResults['321'].type, TypeCall.ESTABLISH.TYPE);
      assert.equal(funcResults['321'].data.task, 'answer');
    });
    it('should send an offer', function () {
      callInstance.sendOffer('offer');
      assert.equal(Object.keys(funcResults).length, 1);
      assert.notEqual(typeof funcResults['321'], 'undefined');
      assert.equal(funcResults['321'].type, TypeRTC.OFFER.TYPE);
      assert.equal(funcResults['321'].data.offer, 'offer');
    });
    it('should send an answer', function () {
      callInstance.sendAnswer('answer');
      assert.equal(Object.keys(funcResults).length, 1);
      assert.notEqual(typeof funcResults['123'], 'undefined');
      assert.equal(funcResults['123'].type, TypeRTC.ANSWER.TYPE);
      assert.equal(funcResults['123'].data.answer, 'answer');
    });
  });
  describe('Draw handling', function () {
    var funcResults;
    beforeEach(function () {
      callInstance.addParticipant('321');
      funcResults = [];
      socketManagerMock.sendTo = function (targets, type, data) {
        funcResults.push({
          targets: targets,
          type: type,
          data: data
        });
      };
    });
    it('should broadcast the drawing from the owner', function () {
      callInstance.broadcastDraw('123',{data: 'draw'});
      assert.equal(funcResults.length, 1);
      let funcResult = funcResults[0];
      assert.equal(funcResult.targets.length, 1);
      assert.equal(funcResult.targets[0], '321');
      assert.equal(funcResult.type, TypeDraw.DRAWING.TYPE);
      assert.equal(funcResult.data.data, 'draw');
    });
    it('should broadcast the drawing from the participants', function () {
      callInstance.broadcastDraw('321',{data: 'draw'});
      assert.equal(funcResults.length, 1);
      let funcResult = funcResults[0];
      assert.equal(funcResult.targets.length, 1);
      assert.equal(funcResult.targets[0], '123');
      assert.equal(funcResult.type, TypeDraw.DRAWING.TYPE);
      assert.equal(funcResult.data.data, 'draw');
    });
    it('should broadcast the drawing from the participants (multiple participants)', function () {
      callInstance.addParticipant('456');
      callInstance.broadcastDraw('321',{data: 'draw'});
      assert.equal(funcResults.length, 1);
      let funcResult = funcResults[0];
      assert.equal(funcResult.targets.length, 2);
      assert.equal(funcResult.targets[0], '123');
      assert.equal(funcResult.targets[1], '456');
      assert.equal(funcResult.type, TypeDraw.DRAWING.TYPE);
      assert.equal(funcResult.data.data, 'draw');
    });
  });
});