'use-strict';

const Pattern = require('./patterns');

class UVImagePattern extends Pattern {
  constructor(canvas) {
    super(null, null);
    this.canvas = canvas;
  }

  patternAt(point) {
    if ((Math.floor(point.x) + Math.floor(point.y) + Math.floor(point.z)) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }

  uvPatternAt(u, v) {
    let vFlipped = 1 - v;

    let x = u * (this.canvas.width - 1);
    let y = vFlipped * (this.canvas.height - 1);

    return this.canvas.pixelAt(Math.round(x), Math.round(y));
  }
}

module.exports = UVImagePattern;