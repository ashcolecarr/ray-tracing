'use-strict';

const Intersection = require('../intersections');
const lib = require('../lib');
const Shape = require('./shapes');
const Tuple = require('../tuples');

class Cone extends Shape {
  constructor() {
    super();
    this.minimum = -Infinity;
    this.maximum = Infinity;
    this.closed = false;
  }

  localIntersect(ray) {
    let xs = [];

    let a = Math.pow(ray.direction.x, 2) - Math.pow(ray.direction.y, 2) + 
      Math.pow(ray.direction.z, 2);
    let b = 2 * ray.origin.x * ray.direction.x - 2 * ray.origin.y * ray.direction.y + 
      2 * ray.origin.z * ray.direction.z;
    let c = Math.pow(ray.origin.x, 2) - Math.pow(ray.origin.y, 2) + 
      Math.pow(ray.origin.z, 2);

    if (lib.nearEqual(a, 0) && !lib.nearEqual(b, 0)) {
      let t = -c / (2 * b);

      xs.push(new Intersection(t, this));
    }

    if (!lib.nearEqual(a, 0)) {
      let disc = Math.pow(b, 2) - 4 * a * c;

      if (disc > 0 || lib.nearEqual(disc, 0)) {
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
    }

    this.intersectCaps(ray, xs);

    return xs;
  }

  checkCap(ray, t, y) {
    let x = ray.origin.x + t * ray.direction.x;
    let z = ray.origin.z + t * ray.direction.z;

    let val = Math.pow(x, 2) + Math.pow(z, 2);
    return val < Math.pow(y, 2) || lib.nearEqual(val, Math.pow(y, 2));
  }

  intersectCaps(ray, xs) {
    if (!this.closed || lib.nearEqual(ray.direction.y, 0)) {
      return;
    }

    let tLower = (this.minimum - ray.origin.y) / ray.direction.y;
    if (this.checkCap(ray, tLower, this.minimum)) {
      xs.push(new Intersection(tLower, this));
    }

    let tUpper = (this.maximum - ray.origin.y) / ray.direction.y;
    if (this.checkCap(ray, tUpper, this.maximum)) {
      xs.push(new Intersection(tUpper, this));
    }
  }

  localNormalAt(point) {
    let dist = Math.pow(point.x, 2) + Math.pow(point.z, 2);
    if (dist < Math.pow(this.maximum, 2) && point.y >= this.maximum - lib.EPSILON) {
      return Tuple.vector(0, 1, 0);
    } else if (dist < Math.pow(this.maximum, 2) && point.y <= this.minimum + lib.EPSILON) {
      return Tuple.vector(0, -1, 0);
    } else {
      let y = Math.sqrt(dist);
      return Tuple.vector(point.x, point.y > 0 ? -y : y, point.z);
    }
  }
}

module.exports = Cone;