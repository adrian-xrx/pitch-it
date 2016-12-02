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

const Logger = require('../../shared/Logger');
const Message = require('../../shared/Message');

class Forwarder {

  static forwardMessageTo(targetSocket, msg, originSocket) {
    if (originSocket && targetSocket && msg) {
      Logger.debug('Forward ' + msg.type + ' from ' + originSocket.user + ' to ' + targetSocket.user);
      let forwardMessage = new Message(msg.type, msg.data);
      forwardMessage.origin = originSocket.user;
      targetSocket.send(forwardMessage.serialize());
    } else {
      Logger.error("Message counld not be forwarded, one of the parameters is undefined");
    }
  }
}

module.exports = Forwarder;