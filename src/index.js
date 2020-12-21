'use-strict';

const http = require('http');
const drawing = require('../src/drawing');

console.log('Generating data...');
//let screenData = drawing.drawProjectile();
//let screenData = drawing.drawClock();
//let screenData = drawing.drawFlatCircle();
//let screenData = drawing.draw3DCircle();
//let screenData = drawing.drawSphereScene();
let screenData = drawing.drawSpherePlaneScene();
console.log('Done.');

http.createServer(function (req, res) {
  res.write('<html><head><title>Results</title></head><body>');
  res.write('<img src="' + screenData + '" />');
  res.write('</body></html>');
  res.end();
}).listen(8080);
