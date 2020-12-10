'use-strict';

const http = require('http');
const drawing = require('../src/drawing');

console.log('Generating data...');
//let screenData = drawing.drawProjectile();
let screenData = drawing.drawClock();
console.log('Done.');

http.createServer(function (req, res) {
  res.write('<html><head><title>Results</title></head><body>');
  res.write('<img src="' + screenData + '" />');
  res.write('</body></html>');
  res.end();
}).listen(8080);
