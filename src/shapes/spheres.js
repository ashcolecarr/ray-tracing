'use-strict';

const BoundingBox = require('../bounds');
const Intersection = require('../intersections');
const Shape = require('./shapes');
const Tuple = require('../tuples');

class Sphere extends Shape {
  constructor() {
    super();
  }

  localIntersect(ray) {
    let sphereToRay = Tuple.subtract(ray.origin, Tuple.point(0, 0, 0));

    let a = Tuple.dot(ray.direction, ray.direction);
    let b = 2 * Tuple.dot(ray.direction, sphereToRay);
    let c = Tuple.dot(sphereToRay, sphereToRay) - 1;

    let discriminant = (b * b) - (4 * a * c);
    if (discriminant < 0) {
      return [];
    }

    let t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    let t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    return Intersection.intersections(new Intersection(t1, this), new Intersection(t2, this));
  }

  localNormalAt(point, hit) {
    return Tuple.subtract(point, Tuple.point(0, 0, 0));
  }

  static glassSphere() {
    let sphere = new Sphere();
    sphere.material.transparency = 1;
    sphere.material.refractiveIndex = 1.5;

    return sphere;
  }

  boundsOf() {
    return new BoundingBox(Tuple.point(-1, -1, -1), Tuple.point(1, 1, 1));
  }
}

module.exports = Sphere;