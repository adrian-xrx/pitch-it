/**
 * BSD-Licensed, J-Pi
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