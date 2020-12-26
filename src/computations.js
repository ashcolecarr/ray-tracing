'use-strict';

class Computations {
  constructor(t, object, point, eyeV, normalV, inside, overPoint, 
    reflectV, n1, n2, underPoint) {

    this.t = t;
    this.object = object;
    this.point = point;
    this.eyeV = eyeV;
    this.normalV = normalV;
    this.inside = inside;
    this.overPoint = overPoint;
    this.reflectV = reflectV;
    this.n1 = n1;
    this.n2 = n2;
    this.underPoint = underPoint;
  }
}

module.exports = Computations;