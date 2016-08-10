const fs = require('fs');
const path = require('path');

let targetPath = path.join(__dirname, '..', './dist');
let toCopy = [
  './package.json',
  './README.md',
  './server/asset/index.html',
  './server/lib',
  './server/shared',
  './server/run.js',
  './server/Server.js'
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
    copyFile(path.join(source, pathList[i]), path.join(targetBase, target, pathList[i]));
  }
}

for (let i = 0; i < toCopy.length; i++) {
  let copyPath = path.join(__dirname, '..', toCopy[i]);
  let copyStat = fs.statSync(copyPath);
  if (copyStat.isFile()) {
    copyFile(copyPath, path.join(targetPath, toCopy[i]));
  } else {
    copyDir(copyPath, targetPath, toCopy[i]);
  }
}