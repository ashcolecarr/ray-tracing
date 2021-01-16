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

  static canvasFromPpm(ppm) {
    let allLines = ppm.split(/\r?\n/);
    let lines = allLines.filter(line => line.trim()[0] !== '#');
    if (lines[0] !== 'P3') {
      return null;
    }

    let dimensions = lines[1].trim().split(/\s+/);
    let width = dimensions[0];
    let height = dimensions[1];
    let canvas = new Canvas(parseInt(width), parseInt(height));

    let scale = parseInt(lines[2].trim());

    let rgbValues = [];
    for (let i = 3; i < lines.length; i++) {
      if (lines[i].trim().length > 0) {
        let values = lines[i].trim().split(/\s+/);
        rgbValues.push(...values);
      }
    }

    let x = 0;
    let y = 0;
    for (let i = 0; i < rgbValues.length - 2; i += 3) {
      let red = parseInt(rgbValues[i]) / scale;
      let green = parseInt(rgbValues[i + 1]) / scale;
      let blue = parseInt(rgbValues[i + 2]) / scale;

      canvas.writePixel(x, y, new Color(red, green, blue));
      x++;
      if (x === canvas.width) {
        y++;
        x = 0;
      }
    }

    return canvas;
  }
}

module.exports = Canvas;