'use-strict';

const Intersection = require('../intersections');
const lib = require('../lib');
const Shape = require('./shapes');
const Tuple = require('../tuples');

class Cylinder extends Shape {
  constructor() {
    super();
    this.minimum = -Infinity;
    this.maximum = Infinity;
    this.closed = false;
  }

  localIntersect(ray) {
    let xs = [];

    let a = Math.pow(ray.direction.x, 2) + Math.pow(ray.direction.z, 2);
    if (!lib.nearEqual(a, 0)) {
      let b = 2 * ray.origin.x * ray.direction.x + 2 * ray.origin.z * ray.direction.z;
      let c = Math.pow(ray.origin.x, 2) + Math.pow(ray.origin.z, 2) - 1;

      let disc = Math.pow(b, 2) - 4 * a * c;
      if (disc < 0) {
        return [];
      }

      let t0 = (-b - Math.sqrt(disc)) / (2 * a);
      let t1 = (-b + Math.sqrt(disc)) / (2 * a);
      if (t0 > t1) {
        let temp = t0;
        t0 = t1;
        t1 = temp;
      }

      let y0 = ray.origin.y + t0 * ray.direction.y;
      if (this.minimum < y0 && y0 < this.maximum) {
        xs.push(new Intersection(t0, this));
      }

      let y1 = ray.origin.y + t1 * ray.direction.y;
      if (this.minimum < y1 && y1 < this.maximum) {
        xs.push(new Intersection(t1, this));
      }
    }

    this.intersectCaps(ray, xs);

    return xs;
  }

  checkCap(ray, t) {
    let x = ray.origin.x + t * ray.direction.x;
    let z = ray.origin.z + t * ray.direction.z;

    let val = Math.pow(x, 2) + Math.pow(z, 2);
    return val < 1 || lib.nearEqual(val, 1);
  }

  intersectCaps(ray, xs) {
    if (!this.closed || lib.nearEqual(ray.direction.y, 0)) {
      return;
    }

    let t = (this.minimum - ray.origin.y) / ray.direction.y;
    if (this.checkCap(ray, t)) {
      xs.push(new Intersection(t, this));
    }

    t = (this.maximum - ray.origin.y) / ray.direction.y;
    if (this.checkCap(ray, t)) {
      xs.push(new Intersection(t, this));
    }
  }

  localNormalAt(point) {
    let dist = Math.pow(point.x, 2) + Math.pow(point.z, 2);
    if (dist < 1 && point.y >= this.maximum - lib.EPSILON) {
      return Tuple.vector(0, 1, 0);
    } else if (dist < 1 && point.y <= this.minimum + lib.EPSILON) {
      return Tuple.vector(0, -1, 0);
    } else {
      return Tuple.vector(point.x, 0, point.z);
    }
  }
}

module.exports = Cylinder;