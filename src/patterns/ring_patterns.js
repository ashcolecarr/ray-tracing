'use-strict';

const Pattern = require('./patterns');

class RingPattern extends Pattern {
  constructor(a, b) {
    super(a, b);
  }

  patternAt(point) {
    if (Math.floor(Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.z, 2))) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }
}

module.exports = RingPattern;