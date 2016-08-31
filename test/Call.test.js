/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

'use strict';

const assert = require('assert');
const Call = require('../server/lib/Call');
const message_types = require('../server/shared/message_types');

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
      assert.equal(funcResults['123'].type, message_types.CALL_ESTABLISH);
      assert.equal(funcResults['123'].data.task, 'offer');
      assert.notEqual(typeof funcResults['123'], 'undefined');
      assert.equal(funcResults['321'].type, message_types.CALL_ESTABLISH);
      assert.equal(funcResults['321'].data.task, 'answer');
    });
    it('should send an offer', function () {
      callInstance.sendOffer('offer');
      assert.equal(Object.keys(funcResults).length, 1);
      assert.notEqual(typeof funcResults['321'], 'undefined');
      assert.equal(funcResults['321'].type, message_types.RTC_OFFER);
      assert.equal(funcResults['321'].data.offer, 'offer');
    });
    it('should send an answer', function () {
      callInstance.sendAnswer('answer');
      assert.equal(Object.keys(funcResults).length, 1);
      assert.notEqual(typeof funcResults['123'], 'undefined');
      assert.equal(funcResults['123'].type, message_types.RTC_ANSWER);
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
      assert.equal(funcResult.type, message_types.DRAW_DRAWING);
      assert.equal(funcResult.data.data, 'draw');
    });
    it('should broadcast the drawing from the participants', function () {
      callInstance.broadcastDraw('321',{data: 'draw'});
      assert.equal(funcResults.length, 1);
      let funcResult = funcResults[0];
      assert.equal(funcResult.targets.length, 1);
      assert.equal(funcResult.targets[0], '123');
      assert.equal(funcResult.type, message_types.DRAW_DRAWING);
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
      assert.equal(funcResult.type, message_types.DRAW_DRAWING);
      assert.equal(funcResult.data.data, 'draw');
    });
  });
});