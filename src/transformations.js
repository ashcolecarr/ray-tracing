'use-strict';

const Matrix = require('../src/matrices');
const Tuple = require('./tuples');

module.exports = {
  Axis: Object.freeze({
    X: 1,
    Y: 2,
    Z: 3,
  }),

  translation: function (x, y, z) {
    let matrix = Matrix.identity(4);
    matrix.set(0, 3, x);
    matrix.set(1, 3, y);
    matrix.set(2, 3, z);

    return matrix;
  },

  scaling: function (x, y, z) {
    let matrix = Matrix.identity(4);
    matrix.set(0, 0, x);
    matrix.set(1, 1, y);
    matrix.set(2, 2, z);

    return matrix;
  },

  rotation: function (radians, axis) {
    let matrix = Matrix.identity(4);

    switch (axis) {
      case 1: // X
        matrix.set(1, 1, Math.cos(radians));
        matrix.set(1, 2, -Math.sin(radians));
        matrix.set(2, 1, Math.sin(radians));
        matrix.set(2, 2, Math.cos(radians));
        break;
      case 2: // Y
        matrix.set(0, 0, Math.cos(radians));
        matrix.set(0, 2, Math.sin(radians));
        matrix.set(2, 0, -Math.sin(radians));
        matrix.set(2, 2, Math.cos(radians));
        break;
      case 3: // Z
        matrix.set(0, 0, Math.cos(radians));
        matrix.set(0, 1, -Math.sin(radians));
        matrix.set(1, 0, Math.sin(radians));
        matrix.set(1, 1, Math.cos(radians));
        break;
      default:
        break;
    }

    return matrix;
  },

  shearing: function (xY, xZ, yX, yZ, zX, zY) {
    let matrix = Matrix.identity(4);
    matrix.set(0, 1, xY);
    matrix.set(0, 2, xZ);
    matrix.set(1, 0, yX);
    matrix.set(1, 2, yZ);
    matrix.set(2, 0, zX);
    matrix.set(2, 1, zY);

    return matrix;
  },

  viewTransform: function(from, to, up) {
    let forward = Tuple.subtract(to, from).normalize();
    let upNormal = up.normalize();
    let left = Tuple.cross(forward, upNormal);
    let trueUp = Tuple.cross(left, forward);

    let orientation = new Matrix(4, 4, [left.x, left.y, left.z, 0,
      trueUp.x, trueUp.y, trueUp.z, 0,
      -forward.x, -forward.y, -forward.z, 0,
      0, 0, 0, 1]);

    return Matrix.multiply(orientation, this.translation(-from.x, -from.y, -from.z));
  }
}