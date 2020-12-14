'use-strict';

class Light {
  constructor(position, intensity) {
    this.position = position;
    this.intensity = intensity;
  }

  static pointLight(position, intensity) {
    return new Light(position, intensity);
  }
}

module.exports = Light;