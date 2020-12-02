'use-strict';

const http = require('http');
const fs = require('fs');
const lib = require('../src/lib');
const Tuple = require('../src/tuples');
const Canvas = require('../src/canvas');
const Color = require('../src/colors');

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  let projectile = new lib.Projectile(Tuple.point(0, 1, 0), Tuple.multiply(Tuple.vector(1, 1.8, 0).normalize(), 11.25));
  let environment = new lib.Environment(Tuple.vector(0, -0.1, 0), Tuple.vector(-0.01, 0, 0));

  let canvas = new Canvas(900, 550);
  let height = canvas.height;

  res.write('Generating data...');
  while (projectile.position.y > 0) {
    canvas.writePixel(Math.round(projectile.position.x), height - Math.round(projectile.position.y), new Color(1, 0.5, 0.5));
    projectile = lib.tick(environment, projectile);
  }

  fs.writeFile('projectile.ppm', canvas.canvasToPpm(), function (err) {
    if (err) {
      throw err;
    }
  });

  res.end('File written.');
}).listen(8080);
