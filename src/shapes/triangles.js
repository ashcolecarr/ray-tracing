'use-strict';

const BoundingBox = require('../bounds');
const Intersection = require('../intersections');
const lib = require('../lib');
const Shape = require('./shapes');
const Tuple = require('../tuples');

class Triangle extends Shape {
  constructor(p1, p2, p3) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.e1 = Tuple.subtract(p2, p1);
    this.e2 = Tuple.subtract(p3, p1);
    this.normal = Tuple.cross(this.e2, this.e1).normalize();
  }

  localIntersect(ray) {
    let dirCrossE2 = Tuple.cross(ray.direction, this.e2);
    let det = Tuple.dot(this.e1, dirCrossE2);
    if (Math.abs(det) < lib.EPSILON) {
      return [];
    }

    let f = 1 / det;
    let p1ToOrigin = Tuple.subtract(ray.origin, this.p1);
    let u = f * Tuple.dot(p1ToOrigin, dirCrossE2);
    if (u < 0 || u > 1) {
      return [];
    }

    let originCrossE1 = Tuple.cross(p1ToOrigin, this.e1);
    let v = f * Tuple.dot(ray.direction, originCrossE1);
    if (v < 0 || (u + v) > 1) {
      return [];
    }

    let t = f * Tuple.dot(this.e2, originCrossE1);
    return Intersection.intersections(new Intersection(t, this));
  }

  localNormalAt(point, hit) {
    return this.normal;
  }

  boundsOf() {
    let box = new BoundingBox();
    box.addPoint(this.p1);
    box.addPoint(this.p2);
    box.addPoint(this.p3);

    return box;
  }
}

module.exports = Triangle;