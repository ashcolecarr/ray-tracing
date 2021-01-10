'use-strict';

const BoundingBox = require('../bounds');
const Shape = require('./shapes');
const Tuple = require('../tuples');

/**
 * For testing purposes. Not meant to be used directly.
 */
class TestShape extends Shape {
  constructor() {
    super();
    this.savedRay = null;
  }

  localIntersect(ray) {
    this.savedRay = ray;

    return null;
  }

  setTransform(transform) {
    this.transform = transform;
  }

  localNormalAt(point, hit) {
    return Tuple.vector(point.x, point.y, point.z);
  }

  boundsOf() {
    return new BoundingBox(Tuple.point(-1, -1, -1), Tuple.point(1, 1, 1));
  }
}

module.exports = TestShape;