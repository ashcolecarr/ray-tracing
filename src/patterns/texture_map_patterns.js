'use-strict';

const Pattern = require('./patterns');

class TextureMapPattern extends Pattern {
  constructor(uvPattern, uvMapType) {
    super(uvPattern.a, uvPattern.b);
    this.uvPattern = uvPattern;
    this.uvMapType = uvMapType;
  }

  patternAt(point) {
    let [u, v] = this.uvMap(point);

    return this.uvPattern.uvPatternAt(u, v);
  }

  uvMap(point) {
    switch (this.uvMapType) {
      case 'spherical':
        return point.sphericalMap();
      case 'planar':
        return point.planarMap();
      case 'cylindrical':
        return point.cylindricalMap();
      default:
        return [0, 0];
    }
  }
}

module.exports = TextureMapPattern;