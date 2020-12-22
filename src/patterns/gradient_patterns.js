'use-strict';

const Color = require('../colors');
const Pattern = require('./patterns');

class GradientPattern extends Pattern {
  constructor(a, b) {
    super(a, b);
  }

  patternAt(point) {
    let distance = Color.subtract(this.b, this.a);
    let fraction = point.x - Math.floor(point.x);

    return Color.add(this.a, Color.multiply(distance, fraction));
  }
}

module.exports = GradientPattern;