'use-strict';

const Light = require('./lights');
const Sequence = require('../sequences');
const Tuple = require('../tuples');

class AreaLight extends Light {
  constructor(corner, fullUVec, uSteps, fullVVec, vSteps, intensity) {
    super(Tuple.point(1, 0, 0.5), intensity);
    this.corner = corner;
    this.uVec = Tuple.divide(fullUVec, uSteps);
    this.uSteps = uSteps;
    this.vVec = Tuple.divide(fullVVec, vSteps);
    this.vSteps = vSteps;
    this.samples = uSteps * vSteps;
    this.jitterBy = new Sequence();
  }

  pointOnLight(u, v) {
    let uVecVal = Tuple.multiply(this.uVec, (u + this.jitterBy.next()));
    let vVecVal = Tuple.multiply(this.vVec, (v + this.jitterBy.next()));

    return Tuple.add(this.corner, Tuple.add(uVecVal, vVecVal));
  }

  intensityAt(point, world) {
    let total = 0;

    for (let v = 0; v < this.vSteps; v++) {
      for (let u = 0; u < this.uSteps; u++) {
        let lightPosition = this.pointOnLight(u, v);
        if (!world.isShadowed(lightPosition, point)) {
          total += 1;
        }
      }
    }

    return total / this.samples;
  }

  getSamples() {
    let samples = [];
    for (let v = 0; v < this.vSteps; v++) {
      for (let u = 0; u < this.uSteps; u++) {
        samples.push(this.pointOnLight(u, v));
      }
    }

    return samples;
  }
}

module.exports = AreaLight;