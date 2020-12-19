'use-strict';

class Computations {
  constructor(t, object, point, eyeV, normalV, inside) {
    this.t = t;
    this.object = object;
    this.point = point;
    this.eyeV = eyeV;
    this.normalV = normalV;
    this.inside = inside;
  }
}

module.exports = Computations;