'use-strict';

const Matrix = require('./matrices');
const Tuple = require('./tuples');

class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  position(t) {
    return Tuple.add(this.origin, Tuple.multiply(this.direction, t));
  }

  transform(matrix) {
    let originTransform = Matrix.multiplyTuple(matrix, this.origin);
    let directionTransform = Matrix.multiplyTuple(matrix, this.direction);

    return new Ray(originTransform, directionTransform);
  }
}

module.exports = Ray;