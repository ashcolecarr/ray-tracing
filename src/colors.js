'use-strict';

const lib = require('./lib');

class Color {
  constructor(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  static areEqual(a, b) {
    return lib.nearEqual(a.red, b.red) && lib.nearEqual(a.green, b.green) &&
      lib.nearEqual(a.blue, b.blue);
  }

  static add(a, b) {
    return new Color(a.red + b.red, a.green + b.green, a.blue + b.blue);
  }

  static subtract(a, b) {
    return new Color(a.red - b.red, a.green - b.green, a.blue - b.blue);
  }

  static multiply(a, b) {
    // Calculate the Hadamard product.
    if (b instanceof Color) {
      return new Color(a.red * b.red, a.green * b.green, a.blue * b.blue);
    }

    return new Color(a.red * b, a.green * b, a.blue * b);
  }
}

module.exports = Color;