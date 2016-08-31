/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */
'use strict';

const assert = require('assert');
const SocketCache = require('../server/lib/SocketCache');

describe('SocketCache', function () {
  var instance;
  beforeEach(function () {
    instance = new SocketCache();
  });
  it('should generate a random key', function () {
    let key = instance.generateKey();
    assert.equal(typeof key, 'string');
    assert.notEqual(key, '');
  });
  it('should add a new socket to the cache and get it by key', function () {
    let key = instance.generateKey();
    instance.add(key, {name: 'mockSocket'});
    let sock = instance.get(key);
    assert.equal(sock.name, 'mockSocket');
  });
  it('should list all socket ids in the cache', function () {
    let key1 = instance.generateKey();
    instance.add(key1, {name: 'mockSocket'});
    let key2 = instance.generateKey();
    instance.add(key2, {name: 'mockSocket2'});
    let sockList = instance.list();
    assert.equal(sockList.length, 2);
    assert.notEqual(sockList.indexOf(key1), -1);
    assert.notEqual(sockList.indexOf(key2), -1);
  });
  it('should remove a socket from the cache', function () {
    let key = instance.generateKey();
    instance.add(key, {name: 'mockSocket'});
    instance.remove(key);
    let sock = instance.get(key);
    assert.equal(typeof sock, 'undefined');
  });
});