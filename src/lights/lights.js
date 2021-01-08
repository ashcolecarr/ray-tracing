'use-strict';

/**
 * Abstract class Light not meant to be used directly.
 */
class Light {
  constructor(position, intensity) {
    this.position = position;
    this.intensity = intensity;
    this.samples = 1;
  }

  intensityAt(point, world) {
    throw new Error('Not Implemented: Use the intensityAt method of the concrete class.');
  }

  getSamples() {
    throw new Error('Not Implemented: Use the getSamples method of the concrete class.');
  }
}

module.exports = Light;