'use-strict';

const lib = require('../lib');
const Material = require('../materials');
const Matrix = require('../matrices');

/**
 * Abstract class Shape not meant to be used directly.
 */
class Shape {
  constructor() {
    this.id = lib.generateShapeId();
    this.transform = Matrix.identity(4);
    this.material = new Material();
  }

  intersect(ray) {
    let localRay = ray.transform(this.transform.inverse());

    return this.localIntersect(localRay);
  }

  setTransform(transform) {
    this.transform = transform;
  }

  normalAt(point) {
    let localPoint = Matrix.multiplyTuple(this.transform.inverse(), point);
    let localNormal = this.localNormalAt(localPoint);
    let worldNormal = Matrix.multiplyTuple(this.transform.inverse().transpose(), localNormal);
    worldNormal.w = 0;

    return worldNormal.normalize();
  }

  localIntersect(ray) {
    throw new Error('Not Implemented: Use the localIntersect method of the concrete class.');
  }

  localNormalAt(point) {
    throw new Error('Not Implemented: Use the localNormalAt method of the concrete class.');
  }
}

module.exports = Shape;