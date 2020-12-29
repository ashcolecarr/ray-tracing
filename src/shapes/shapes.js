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
    this.castsShadow = true;
    this.parent = null;
  }

  static areEqual(a, b) {
    return a.id === b.id;
  }

  intersect(ray) {
    let localRay = ray.transform(this.transform.inverse());

    return this.localIntersect(localRay);
  }

  setTransform(transform) {
    this.transform = transform;
  }

  normalAt(worldPoint) {
    let localPoint = this.worldToObject(worldPoint);
    let localNormal = this.localNormalAt(localPoint);

    return this.normalToWorld(localNormal);
  }

  localIntersect(ray) {
    throw new Error('Not Implemented: Use the localIntersect method of the concrete class.');
  }

  localNormalAt(point) {
    throw new Error('Not Implemented: Use the localNormalAt method of the concrete class.');
  }

  worldToObject(point) {
    let newPoint = point;
    if (this.parent !== null) {
      newPoint = this.parent.worldToObject(point);
    }

    return Matrix.multiplyTuple(this.transform.inverse(), newPoint);
  }

  normalToWorld(normal) {
    let newNormal = Matrix.multiplyTuple(this.transform.inverse().transpose(), normal);
    newNormal.w = 0;
    newNormal = newNormal.normalize();

    if (this.parent !== null) {
      newNormal = this.parent.normalToWorld(newNormal);
    }

    return newNormal;
  }

  getMaterial() {
    if (this.parent !== null) {
      return this.parent.getMaterial();
    }

    return this.material;
  }
}

module.exports = Shape;