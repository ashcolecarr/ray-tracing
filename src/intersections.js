'use-strict';

const Computations = require('./computations');
const lib = require('./lib');
const Shape = require('./shapes/shapes');
const Tuple = require('./tuples');

class Intersection {
  constructor(t, object) {
    this.t = t;
    this.object = object;
  }

  static areEqual(a, b) {
    return lib.nearEqual(a.t, b.t) && Shape.areEqual(a.object, b.object);
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

  prepareComputations(ray, xs = []) {
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

    let reflectV = ray.direction.reflect(normalV);
    let overPoint = Tuple.add(point, Tuple.multiply(normalV, lib.EPSILON));
    let underPoint = Tuple.subtract(point, Tuple.multiply(normalV, lib.EPSILON));

    let n1;
    let n2;
    let containers = [];
    for (let i = 0; i < xs.length; i++) {
      if (Intersection.areEqual(xs[i], this)) {
        if (containers.length === 0) {
          n1 = 1;
        } else {
          n1 = containers[containers.length - 1].material.refractiveIndex;
        }
      }

      let objectIndex = containers.findIndex(c => c.id === xs[i].object.id);
      if (objectIndex > -1) {
        containers.splice(objectIndex, 1);
      } else {
        containers.push(xs[i].object);
      }

      if (Intersection.areEqual(xs[i], this)) {
        if (containers.length === 0) {
          n2 = 1;
        } else {
          n2 = containers[containers.length - 1].material.refractiveIndex;
        }

        break;
      }
    }  

    return new Computations(this.t, this.object, point, eyeV, normalV, inside,
      overPoint, reflectV, n1, n2, underPoint);
  }

  static schlick(comps) {
    let cos = Tuple.dot(comps.eyeV, comps.normalV);

    if (comps.n1 > comps.n2) {
      let n = comps.n1 / comps.n2;
      let sin2T = Math.pow(n, 2) * (1 - Math.pow(cos, 2));

      if (sin2T > 1) {
        return 1;
      }

      let cosT = Math.sqrt(1 - sin2T);
      cos = cosT;
    }

    let r0 = Math.pow((comps.n1 - comps.n2) / (comps.n1 + comps.n2), 2);

    return r0 + (1 - r0) * Math.pow(1 - cos, 5);
  }
}

module.exports = Intersection;