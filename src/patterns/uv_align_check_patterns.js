'use-strict';

const Pattern = require('./patterns');

class UVAlignCheckPattern extends Pattern {
  constructor(main, ul, ur, bl, br) {
    super(main, main);
    this.main = main;
    this.ul = ul;
    this.ur = ur;
    this.bl = bl;
    this.br = br;
  }

  patternAt(point) {
    if ((Math.floor(point.x) + Math.floor(point.y) + Math.floor(point.z)) % 2 === 0) {
      return this.a;
    } else {
      return this.b;
    }
  }

  uvPatternAt(u, v) {
    if (v > 0.8) {
      if (u < 0.2) {
        return this.ul;
      }

      if (u > 0.8) {
        return this.ur;
      }
    } else if (v < 0.2) {
      if (u < 0.2) {
        return this.bl;
      }

      if (u > 0.8) {
        return this.br;
      }
    }

    return this.main;
  }
}

module.exports = UVAlignCheckPattern;