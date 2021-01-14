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

  sphericalMap() {
    let theta = Math.atan2(this.x, this.z);

    let vec = Tuple.vector(this.x, this.y, this.z);
    let radius = vec.magnitude();

    let phi = Math.acos(this.y / radius);

    let rawU = theta / (2 * Math.PI);

    let u = 1 - (rawU + 0.5);

    let v = 1 - phi / Math.PI;

    return [u, v];
  }

  planarMap() {
    /* Taken from the Mozilla page: "To obtain a modulo (and not a
     * remainder) in JavaScript, in place of a % n, 
     * use ((a % n ) + n ) % n.
     */
    let u = lib.modulo(this.x, 1);
    let v = lib.modulo(this.z, 1);

    return [u, v];
  }

  cylindricalMap() {
    let theta = Math.atan2(this.x, this.z);
    let rawU = theta / (2 * Math.PI);
    let u = 1 - (rawU + 0.5);

    let v = ((this.y % 1) + 1) % 1;

    return [u, v];
  }

  faceFromPoint() {
    let absX = Math.abs(this.x);
    let absY = Math.abs(this.y);
    let absZ = Math.abs(this.z);
    let coord = Math.max(absX, absY, absZ);

    if (lib.nearEqual(coord, this.x)) {
      return 'right';
    }

    if (lib.nearEqual(coord, -this.x)) {
      return 'left';
    }

    if (lib.nearEqual(coord, this.y)) {
      return 'up';
    }

    if (lib.nearEqual(coord, -this.y)) {
      return 'down';
    }

    if (lib.nearEqual(coord, this.z)) {
      return 'front';
    }

    return 'back';
  }

  cubeUVFront() {
    let u = lib.modulo(this.x + 1, 2) / 2;
    let v = lib.modulo(this.y + 1, 2) / 2;

    return [u, v];
  }

  cubeUVBack() {
    let u = lib.modulo(1 - this.x, 2) / 2;
    let v = lib.modulo(this.y + 1, 2) / 2;

    return [u, v];
  }

  cubeUVLeft() {
    let u = lib.modulo(this.z + 1, 2) / 2;
    let v = lib.modulo(this.y + 1, 2) / 2;

    return [u, v];
  }

  cubeUVRight() {
    let u = lib.modulo(1 - this.z, 2) / 2;
    let v = lib.modulo(this.y + 1, 2) / 2;

    return [u, v];
  }

  cubeUVUp() {
    let u = lib.modulo(this.x + 1, 2) / 2;
    let v = lib.modulo(1 - this.z, 2) / 2;

    return [u, v];
  }

  cubeUVDown() {
    let u = lib.modulo(this.x + 1, 2) / 2;
    let v = lib.modulo(this.z + 1, 2) / 2;

    return [u, v];
  }
}

module.exports = Tuple;