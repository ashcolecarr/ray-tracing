'use-strict';

const Intersection = require('../intersections');
const lib = require('../lib');
const Shape = require('./shapes');
const Tuple = require('../tuples');

class Plane extends Shape {
  constructor() {
    super();
  }

  localIntersect(ray) {
    if (Math.abs(ray.direction.y) < lib.EPSILON) {
      return [];
    }

    let t = -ray.origin.y / ray.direction.y;

    return Intersection.intersections(new Intersection(t, this));
  }

  setTransform(transform) {
    this.transform = transform;
  }

  localNormalAt(point) {
    return Tuple.vector(0, 1, 0);
  }
}

module.exports = Plane;