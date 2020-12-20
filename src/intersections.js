'use-strict';

const Computations = require('./computations');
const lib = require('./lib');
const Tuple = require('./tuples');

class Intersection {
  constructor(t, object) {
    this.t = t;
    this.object = object;
  }

  static intersections(...ints) {
    let intersections = [];
    ints.forEach(int => intersections.push(int));

    intersections.sort((x, y) => (x.t > y.t) ? 1 : -1);

    return intersections;
  }

  static hit(intersections) {
    // The list of intersections should be already sorted.
    let positiveIntersections = intersections.filter(i => i.t > 0);

    if (positiveIntersections.length === 0) {
      return null;
    }

    return positiveIntersections[0];
  }

  prepareComputations(ray) {
    let point = ray.position(this.t);
    let eyeV = Tuple.negate(ray.direction);
    let normalV = this.object.normalAt(point);

    let inside;
    if (Tuple.dot(normalV, eyeV) < 0) {
      inside = true;
      normalV = Tuple.negate(normalV);
    } else {
      inside = false;
    }

    let overPoint = Tuple.add(point, Tuple.multiply(normalV, lib.EPSILON));

    return new Computations(this.t, this.object, point, eyeV, normalV, inside,
      overPoint);
  }
}

module.exports = Intersection;