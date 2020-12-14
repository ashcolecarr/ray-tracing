'use-strict';

const lib = require('./lib');

class Tuple {
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  isPoint() {
    return lib.nearEqual(this.w, 1.0);
  }

  isVector() {
    return lib.nearEqual(this.w, 0.0);
  }

  static areEqual(a, b) {
    return lib.nearEqual(a.x, b.x) && lib.nearEqual(a.y, b.y) &&
      lib.nearEqual(a.z, b.z) && lib.nearEqual(a.w, b.w);
  }

  static point(x, y, z) {
    return new Tuple(x, y, z, 1.0);
  }

  static vector(x, y, z) {
    return new Tuple(x, y, z, 0.0);
  }

  static add(a, b) {
    return new Tuple(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
  }

  static subtract(a, b) {
    return new Tuple(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
  }

  static negate(a) {
    return new Tuple(-a.x, -a.y, -a.z, -a.w);
  }

  static multiply(a, b) {
    return new Tuple(a.x * b, a.y * b, a.z * b, a.w * b);
  }

  static divide(a, b) {
    return new Tuple(a.x / b, a.y / b, a.z / b, a.w / b);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);
  }

  normalize() {
    let mag = this.magnitude();
    return new Tuple(this.x / mag, this.y / mag, this.z / mag, this.w / mag);
  }

  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }

  static cross(a, b) {
    return Tuple.vector(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }

  reflect(normal) {
    return Tuple.subtract(this, Tuple.multiply(normal, 2 * Tuple.dot(this, normal)));
  }
}

module.exports = Tuple;