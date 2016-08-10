const fs = require('fs');
const path = require('path');

let distDir = path.join(__dirname, '../dist');

console.log('Clean ' + distDir);

try {
  fs.rmdirSync(distDir);
} catch (err) {
  if (err.code !== 'ENOENT') {
    console.error(err.code); 
  }
}

console.log('Cleaned ' + distDir);