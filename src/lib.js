'use-strict';

const nodeCanvas = require('canvas');
const fs = require('fs');

module.exports = {
  EPSILON: 0.00001,
  PRECISION: 5,

  shapeId: 0,
  matrixId: 0,
  cachedInverses: [],

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
  },

  writePpmFile: function (filename, canvas) {
    fs.writeFile(filename, canvas.canvasToPpm(), function (err) {
      if (err) {
        throw err;
      }
    });
  },

  generateShapeId: function () {
    this.shapeId++;

    return this.shapeId;
  },

  generateMatrixId: function () {
    this.matrixId++;

    return this.matrixId;
  },

  readObjFile: function(filename) {
    try {
      let data = fs.readFileSync(filename, 'utf8');

      return data;
    } catch(e) {
      throw e;
    }
  }
}