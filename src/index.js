'use-strict';

const http = require('http');
const Tuple = require('../src/tuples');

class Projectile {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
  }
}

class Environment {
  constructor(gravity, wind) {
    this.gravity = gravity;
    this.wind = wind;
  }
}

function tick(env, proj) {
  let position = Tuple.add(proj.position, proj.velocity);
  let velocity = Tuple.add(Tuple.add(proj.velocity, env.gravity), env.wind);

  return new Projectile(position, velocity);
}

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  let p = new Projectile(Tuple.point(0, 1, 0), Tuple.vector(1, 1, 0).normalize());
  let e = new Environment(Tuple.vector(0, -0.1, 0), Tuple.vector(-0.01, 0, 0));

  let pos = tick(e, p);
  while (pos.position.y > 0) {
    console.log(`X: ${pos.position.x} Y: ${pos.position.y} Z: ${pos.position.z}`);
    res.write(`X: ${pos.position.x} Y: ${pos.position.y} Z: ${pos.position.z}\n`);
    pos = tick(e, pos);
  }
  res.end();
}).listen(8080);
