'use-strict';

const lib = require('./lib');
const Matrix = require('./matrices');
const Tuple = require('./tuples');

class BoundingBox {
  constructor(min = null, max = null) {
    this.min = Tuple.point(Infinity, Infinity, Infinity);
    this.max = Tuple.point(-Infinity, -Infinity, -Infinity);

    if (min) {
      this.min = min;
    }

    if (max) {
      this.max = max;
    }
  }

  addPoint(point) {
    if (point.x < this.min.x) { this.min.x = point.x };
    if (point.y < this.min.y) { this.min.y = point.y };
    if (point.z < this.min.z) { this.min.z = point.z };

    if (point.x > this.max.x) { this.max.x = point.x };
    if (point.y > this.max.y) { this.max.y = point.y };
    if (point.z > this.max.z) { this.max.z = point.z };
  }

  addBox(box) {
    this.addPoint(box.min);
    this.addPoint(box.max);
  }

  containsPoint(point) {
    return (this.min.x <= point.x && point.x <= this.max.x) &&
      (this.min.y <= point.y && point.y <= this.max.y) &&
      (this.min.z <= point.z && point.z <= this.max.z); 
  }

  containsBox(box) {
    return this.containsPoint(box.min) && this.containsPoint(box.max);
  }

  static transform(box, matrix) {
    let p1 = box.min;
    let p2 = Tuple.point(box.min.x, box.min.y, box.max.z);
    let p3 = Tuple.point(box.min.x, box.max.y, box.min.z);
    let p4 = Tuple.point(box.min.x, box.max.y, box.max.z);
    let p5 = Tuple.point(box.max.x, box.min.y, box.min.z);
    let p6 = Tuple.point(box.max.x, box.min.y, box.max.z);
    let p7 = Tuple.point(box.max.x, box.max.y, box.min.z);
    let p8 = box.max;

    let points = [p1, p2, p3, p4, p5, p6, p7, p8];
    let newBox = new BoundingBox();
    for (let i = 0; i < points.length; i++) {
      newBox.addPoint(Matrix.multiplyTuple(matrix, points[i]));
    }

    return newBox;
  }

  intersects(ray) {
    let xts = this.checkAxis(ray.origin.x, ray.direction.x, this.min.x, this.max.x);
    let xtMin = xts[0];
    let xtMax = xts[1];
    let yts = this.checkAxis(ray.origin.y, ray.direction.y, this.min.y, this.max.y);
    let ytMin = yts[0];
    let ytMax = yts[1];
    let zts = this.checkAxis(ray.origin.z, ray.direction.z, this.min.z, this.max.z);
    let ztMin = zts[0];
    let ztMax = zts[1];

    let tMin = Math.max(xtMin, ytMin, ztMin);
    let tMax = Math.min(xtMax, ytMax, ztMax);

    if (tMin > tMax) {
      return false;
    }

    return true;
  }

  checkAxis(origin, direction, min, max) {
    let tMinNumerator = min - origin;
    let tMaxNumerator = max - origin;

    let tMin;
    let tMax;
    if (Math.abs(direction) >= lib.EPSILON) {
      tMin = tMinNumerator / direction;  
      tMax = tMaxNumerator / direction;  
    } else {
      tMin = tMinNumerator * Infinity;  
      tMax = tMaxNumerator * Infinity;  
    }

    // Swap the values.
    if (tMin > tMax) {
      return [tMax, tMin];
    }

    return [tMin, tMax];
  }

  splitBounds() {
    let dx = this.max.x - this.min.x;
    let dy = this.max.y - this.min.y;
    let dz = this.max.z - this.min.z;
    let greatest = Math.max(dx, dy, dz);

    let [x0, y0, z0] = [this.min.x, this.min.y, this.min.z];
    let [x1, y1, z1] = [this.max.x, this.max.y, this.max.z];

    if (lib.nearEqual(greatest, dx)) {
      x1 = x0 + dx / 2;
      x0 = x1;
    } else if (lib.nearEqual(greatest, dy)) {
      y1 = y0 + dy / 2;
      y0 = y1;
    } else {
      z1 = z0 + dz / 2;
      z0 = z1;
    }

    let midMin = Tuple.point(x0, y0, z0);
    let midMax = Tuple.point(x1, y1, z1);
    
    let left = new BoundingBox(this.min, midMax);
    let right = new BoundingBox(midMin, this.max);

    return [left, right];
  }
}

module.exports = BoundingBox;