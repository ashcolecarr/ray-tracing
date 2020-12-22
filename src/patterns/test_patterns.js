'use-strict';

const Color = require('../colors');
const Pattern = require('./patterns');

/**
 * For testing purposes. Not meant to be used directly.
 */
class TestPattern extends Pattern {
  constructor(a, b) {
    super(a, b);
  }

  static stripePattern(a, b) {
    return new TestPattern(a, b);
  }

  patternAt(point) {
    return new Color(point.x, point.y, point.z);
  }
}

module.exports = TestPattern;