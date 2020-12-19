'use-strict';

const Canvas = require('./canvas');
const lib = require('./lib');
const Matrix = require('./matrices');
const Ray = require('./rays');
const Tuple = require('./tuples');

class Camera {
  constructor(hSize, vSize, fieldOfView) {
    let halfView = Math.tan(fieldOfView / 2);
    let aspect = hSize / vSize;

    let halfWidth, halfHeight;
    if (aspect > 1 || lib.nearEqual(aspect, 1)) {
      halfWidth = halfView;
      halfHeight = halfView / aspect;
    } else {
      halfWidth = halfView * aspect;
      halfHeight = halfView;
    }

    let pixelSize = (halfWidth * 2) / hSize;

    this.hSize = hSize;
    this.vSize = vSize;
    this.fieldOfView = fieldOfView;
    this.transform = Matrix.identity(4);
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
    this.pixelSize = pixelSize;
  }

  rayForPixel(px, py) {
    let xOffset = (px + 0.5) * this.pixelSize;
    let yOffset = (py + 0.5) * this.pixelSize;

    let worldX = this.halfWidth - xOffset;
    let worldY = this.halfHeight - yOffset;

    let pixel = Matrix.multiplyTuple(this.transform.inverse(), 
      Tuple.point(worldX, worldY, -1));
    let origin = Matrix.multiplyTuple(this.transform.inverse(), 
      Tuple.point(0, 0, 0));
    let direction = Tuple.subtract(pixel, origin).normalize();

    return new Ray(origin, direction);
  }

  render(world) {
    let image = new Canvas(this.hSize, this.vSize);

    for (let y = 0; y < this.vSize; y++) {
      for (let x = 0; x < this.hSize; x++) {
        let ray = this.rayForPixel(x, y);
        let color = world.colorAt(ray);

        image.writePixel(x, y, color);
      }
    }

    return image;
  }
}

module.exports = Camera;