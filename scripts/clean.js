/**
 *    Copyright 2016, the creators of pitch-it
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * be found in the LICENSE file in the root directory
 * 
 */

const fs = require('fs');
const path = require('path');

let distDir = path.join(__dirname, '../dist');

console.log('Clean ' + distDir);

function removeDir(dirPath) {
  let content = fs.readdirSync(dirPath);
  if (content.length > 0) {
    for (let i = 0; i < content.length; i++) {
      removeDirOrFile(path.join(dirPath,content[i]));
    }
  }
  fs.rmdirSync(dirPath);
}

function removeFile(filePath) {
  fs.unlinkSync(filePath);
}

function removeDirOrFile(dirFilePath) {
  let checkContent = fs.statSync(dirFilePath);
  if (checkContent.isDirectory()) {
    removeDir(dirFilePath);
  } else {
    removeFile(dirFilePath);
  }
}

function cleanDir(dirPath) {
  try {
    let content = fs.readdirSync(dirPath);
    for (let i = 0; i < content.length; i++) {
      removeDirOrFile(path.join(dirPath,content[i]));
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(err);
    }
  }
}

cleanDir(distDir);

console.log('Cleaned ' + distDir);