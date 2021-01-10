'use-strict';

const BoundingBox = require('../bounds');
const Intersection = require('../intersections');
const lib = require('../lib');
const Shape = require('./shapes');
const Tuple = require('../tuples');

class Cube extends Shape {
  constructor() {
    super();
  }

  localIntersect(ray) {
    let xts = this.checkAxis(ray.origin.x, ray.direction.x);
    let xtMin = xts[0];
    let xtMax = xts[1];
    let yts = this.checkAxis(ray.origin.y, ray.direction.y);
    let ytMin = yts[0];
    let ytMax = yts[1];
    let zts = this.checkAxis(ray.origin.z, ray.direction.z);
    let ztMin = zts[0];
    let ztMax = zts[1];

    let tMin = Math.max(xtMin, ytMin, ztMin);
    let tMax = Math.min(xtMax, ytMax, ztMax);

    if (tMin > tMax) {
      return [];
    }

    return Intersection.intersections(new Intersection(tMin, this), new Intersection(tMax, this));
  }

  checkAxis(origin, direction) {
    let tMinNumerator = -1 - origin;
    let tMaxNumerator = 1 - origin;

    let tMin;
    let tMax;
    if (Math.abs(direction) >= lib.EPSILON) {
      tMin = tMinNumerator / direction;  
      tMax = tMaxNumerator / direction;  
    } else {
      tMin = tMinNumerator * Infinity;  
      tMax = tMaxNumerator * Infinity;  
    }

    // Swap the values.
    if (tMin > tMax) {
      return [tMax, tMin];
    }

    return [tMin, tMax];
  }

  localNormalAt(point, hit) {
    let maxC = Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z));

    if (lib.nearEqual(maxC, Math.abs(point.x))) {
      return Tuple.vector(point.x, 0, 0);
    } else if (lib.nearEqual(maxC, Math.abs(point.y))) {
      return Tuple.vector(0, point.y, 0);
    }

    return Tuple.vector(0, 0, point.z);
  }

  boundsOf() {
    return new BoundingBox(Tuple.point(-1, -1, -1), Tuple.point(1, 1, 1));
  }
}

module.exports = Cube;