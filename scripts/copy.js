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

let targetPath = path.join(__dirname, '..', './dist');
let toCopy = [
  './package.json',
  './README.md',
  './server/asset/index.html',
  './shared',
  './pitch-it',
  './server/launch.js',
  './server/AssetServer.js'
];

function createPath(toCreate) {
  try {
    fs.accessSync(toCreate, fs.F_OK);
  } catch (err) {
    if (err.code === 'ENOENT') {
      let dirPath = path.dirname(toCreate);
      createPath(dirPath);
      fs.mkdirSync(toCreate);
    }
  }
}

function copyFile(source, target) {
  console.log('Copy ' + source + '\n  to ' + target);
  let dirPath = path.dirname(target);
  createPath(dirPath);
  let content = fs.readFileSync(source);
  fs.writeFileSync(target, content);
}

function copyDir(source, targetBase, target) {
  let pathList = fs.readdirSync(source);
  for (let i = 0; i < pathList.length; i++) {
    let sourcePath = path.join(source, pathList[i]);
    if (isFilePath(sourcePath)) {
      copyFile(sourcePath, path.join(targetBase, target, pathList[i]));
    } else {
      copyDir(sourcePath, path.join(targetBase, target), pathList[i]);
    }
  }
}

function isFilePath(path) {
  let copyStat = fs.statSync(path);
  return copyStat.isFile();
}

for (let i = 0; i < toCopy.length; i++) {
  let copyPath = path.join(__dirname, '..', toCopy[i]);
  if (isFilePath(copyPath)) {
    copyFile(copyPath, path.join(targetPath, toCopy[i]));
  } else {
    copyDir(copyPath, targetPath, toCopy[i]);
  }
}