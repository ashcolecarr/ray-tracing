'use-strict';

const nodeCanvas = require('canvas');
const Tuple = require('../src/tuples');

module.exports = {
  EPSILON: 0.00001,
  PRECISION: 5,

  Projectile: class {
    constructor(position, velocity) {
      this.position = position;
      this.velocity = velocity;
    }
  },

  Environment: class {
    constructor(gravity, wind) {
      this.gravity = gravity;
      this.wind = wind;
    }
  },

  nearEqual: function (a, b) {
    return Math.abs(a - b) < this.EPSILON;
  },

  tick: function (env, proj) {
    let position = Tuple.add(proj.position, proj.velocity);
    let velocity = Tuple.add(proj.velocity, Tuple.add(env.gravity, env.wind));

    return new this.Projectile(position, velocity);
  },

  generateScreenCanvasData: function (canvas) {
    // Draw canvas data to the screen canvas.
    let imageCanvas = nodeCanvas.createCanvas(canvas.width, canvas.height);
    let context = imageCanvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < canvas.pixels.length; i++) {
      data[4 * i] = 255 * canvas.pixels[i].red;
      data[4 * i + 1] = 255 * canvas.pixels[i].green;
      data[4 * i + 2] = 255 * canvas.pixels[i].blue;
      data[4 * i + 3] = 255; // Transparency
    }
    context.putImageData(imageData, 0, 0);

    return imageCanvas.toDataURL();
  }
}