'use-strict';

const Pattern = require('./patterns');

class StripedPattern extends Pattern {
  constructor(a, b) {
    super(a, b);
  }

  patternAt(point) {
    if (Math.floor(point.x) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }
}

module.exports = StripedPattern;