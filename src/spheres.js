'use-strict';

const Intersection = require('./intersections');
const lib = require('./lib');
const Material = require('./materials');
const Matrix = require('./matrices');
const Shape = require('./shapes');
const Tuple = require('./tuples');

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

  setTransform(transform) {
    this.transform = transform;
  }

  localNormalAt(point) {
    //let objectPoint = Matrix.multiplyTuple(this.transform.inverse(), point);
    //let objectNormal = Tuple.subtract(objectPoint, Tuple.point(0, 0, 0));
    //let worldNormal = Matrix.multiplyTuple(this.transform.inverse().transpose(), objectNormal);
    //worldNormal.w = 0;

    //return worldNormal.normalize();
    return Tuple.subtract(point, Tuple.point(0, 0, 0));
  }
}

module.exports = Sphere;