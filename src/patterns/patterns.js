'use-strict';

const Matrix = require("../matrices");

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

  patternAtShape(object, point) {
    let objectPoint = Matrix.multiplyTuple(object.transform.inverse(), point);
    let patternPoint = Matrix.multiplyTuple(this.transform.inverse(), objectPoint);

    return this.patternAt(patternPoint);
  }

  patternAt(point) {
    throw new Error('Not Implemented: Use the patternAt method of the concrete class.');
  }
}

module.exports = Pattern;