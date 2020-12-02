'use-strict';

const Tuple = require('../src/tuples');

module.exports = {
  EPSILON: 0.00001,
  PRECISION: 5,

  Projectile: class {
    constructor(position, velocity) {
      this.position = position;
      this.velocity = velocity;
    }
  },

  Environment: class {
    constructor(gravity, wind) {
      this.gravity = gravity;
      this.wind = wind;
    }
  },

  nearEqual: function (a, b) {
    return Math.abs(a - b) < this.EPSILON;
  },

  tick: function (env, proj) {
    let position = Tuple.add(proj.position, proj.velocity);
    let velocity = Tuple.add(proj.velocity, Tuple.add(env.gravity, env.wind));

    return new this.Projectile(position, velocity);
  }
}