'use-strict';

const Color = require('../colors');
const Matrix = require('../matrices');

/**
 * Abstract class Pattern not meant to be used directly.
 */
class Pattern {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.transform = Matrix.identity(4);
  }

  setPatternTransform(transform) {
    this.transform = transform;
  }

  patternAtShape(object, worldPoint) {
    let objectPoint = object.worldToObject(worldPoint);
    let patternPoint = Matrix.multiplyTuple(this.transform.inverse(), objectPoint);

    return this.patternAt(patternPoint);
  }

  patternAt(point) {
    throw new Error('Not Implemented: Use the patternAt method of the concrete class.');
  }

  uvPatternAt(u, v) {
    return new Color(0, 0, 0);
  }
}

module.exports = Pattern;