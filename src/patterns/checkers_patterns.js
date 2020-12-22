'use-strict';

const Pattern = require('./patterns');

class CheckersPattern extends Pattern {
  constructor(a, b) {
    super(a, b);
  }

  patternAt(point) {
    if ((Math.floor(point.x) + Math.floor(point.y) + Math.floor(point.z)) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }
}

module.exports = CheckersPattern;