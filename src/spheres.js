'use-strict';

const Intersection = require('./intersections');
const lib = require('./lib');
const Matrix = require('./matrices');
const Tuple = require('./tuples');

class Sphere {
  constructor() {
    this.id = lib.generateId();
    this.transform = Matrix.identity(4);
  }

  intersect(ray) {
    let ray2 = ray.transform(this.transform.inverse());

    let sphereToRay = Tuple.subtract(ray2.origin, Tuple.point(0, 0, 0));

    let a = Tuple.dot(ray2.direction, ray2.direction);
    let b = 2 * Tuple.dot(ray2.direction, sphereToRay);
    let c = Tuple.dot(sphereToRay, sphereToRay) - 1;

    let discriminant = (b * b) - (4 * a * c);
    if (discriminant < 0) {
      return [];
    }

    let t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    let t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    return Intersection.intersections(new Intersection(t1, this), new Intersection(t2, this));
  }

  setTransform(transform) {
    this.transform = transform;
  }
}

module.exports = Sphere;