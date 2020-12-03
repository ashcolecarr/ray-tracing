'use-strict';

const Color = require('./colors');

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = Array(width * height).fill(new Color(0, 0, 0));
  }

  writePixel(x, y, color) {
    this.pixels[y * this.width + x] = color;
  }

  pixelAt(x, y) {
    return this.pixels[y * this.width + x];
  }

  canvasToPpm() {
    const MAX_LINE_LENGTH = 70;
    // Write the ppm header data.
    let ppmData = new String(`P3\n${this.width} ${this.height}\n255\n`);

    // Write the pixel data.
    let pixelColor = new String('');
    let i;
    for (i = 0; i < this.pixels.length; i++) {
      let red = `${this.scaleColor(this.pixels[i].red)}`;
      let green = `${this.scaleColor(this.pixels[i].green)}`;
      let blue = `${this.scaleColor(this.pixels[i].blue)}`;

      // Some programs don't work correctly if the line length is too long.
      if (pixelColor.length + red.length >= MAX_LINE_LENGTH) {
        pixelColor = pixelColor.slice(0, -1);
        pixelColor += '\n';
        ppmData += pixelColor;
        pixelColor = '';
      }
      pixelColor += `${red} `;

      if (pixelColor.length + green.length >= MAX_LINE_LENGTH) {
        pixelColor = pixelColor.slice(0, -1);
        pixelColor += '\n';
        ppmData += pixelColor;
        pixelColor = '';
      }
      pixelColor += `${green} `;

      if (pixelColor.length + blue.length >= MAX_LINE_LENGTH) {
        pixelColor = pixelColor.slice(0, -1);
        pixelColor += '\n';
        ppmData += pixelColor;
        pixelColor = '';
      }
      pixelColor += `${blue} `;

      if ((i + 1) % this.width == 0) {
        pixelColor = pixelColor.slice(0, -1);
        pixelColor += '\n';
        ppmData += pixelColor;
        pixelColor = '';
      }
    }

    return ppmData;
  }

  scaleColor(color) {
    const MAX_COLOR = 255;

    // Clamp color as needed.
    if (color > 1) {
      return MAX_COLOR;
    } else if (color < 0) {
      return 0;
    }

    let scaledColor = color * MAX_COLOR;
    return Math.round(scaledColor);
  }
}

module.exports = Canvas;