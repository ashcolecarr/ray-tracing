'use-strict';

const Light = require('./lights');

class PointLight extends Light {
  constructor(position, intensity) {
    super(position, intensity);
  }

  intensityAt(point, world) {
    return world.isShadowed(this.position, point) ? 0 : 1;
  }

  getSamples() {
    return [this.position];
  }
}

module.exports = PointLight;