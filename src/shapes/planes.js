'use-strict';

const BoundingBox = require('../bounds');
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

  localNormalAt(point, hit) {
    return Tuple.vector(0, 1, 0);
  }

  boundsOf() {
    return new BoundingBox(Tuple.point(-Infinity, 0, -Infinity), Tuple.point(Infinity, 0, Infinity));
  }
}

module.exports = Plane;