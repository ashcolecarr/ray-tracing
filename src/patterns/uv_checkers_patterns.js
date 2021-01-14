'use-strict';

const Pattern = require('./patterns');

class UVCheckersPattern extends Pattern {
  constructor(width, height, a, b) {
    super(a, b);
    this.width = width;
    this.height = height;
  }

  patternAt(point) {
    if ((Math.floor(point.x) + Math.floor(point.y) + Math.floor(point.z)) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }

  uvPatternAt(u, v) {
    let u2 = Math.floor(u * this.width);
    let v2 = Math.floor(v * this.height);

    if ((u2 + v2) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }
}

module.exports = UVCheckersPattern;