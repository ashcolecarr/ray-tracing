'use-strict';

const BoundingBox = require('../bounds');
const Group = require('./groups');
const Shape = require('./shapes');

class CSG extends Shape {
  constructor(operation, left, right) {
    super();
    this.operation = operation;
    left.parent = this;
    right.parent = this;
    this.left = left;
    this.right = right;
  }

  localIntersect(ray) {
    if (this.boundsOf().intersects(ray)) {
      let leftXS = this.left.intersect(ray);
      let rightXS = this.right.intersect(ray);

      let xs = [];
      if (leftXS) { xs.push(...leftXS); }
      if (rightXS) { xs.push(...rightXS); }
      xs.sort((x, y) => (x.t > y.t) ? 1 : -1);

      return this.filterIntersections(xs);
    } else {
      return [];
    }
  }

  localNormalAt(point, hit) {
    throw new Error('The localNormalAt function should not be called for CSG.');
  }

  static intersectionAllowed(op, lHit, inL, inR) {
    switch (op) {
      case 'union':
        return (lHit && !inR) || (!lHit && !inL);
      case 'intersection':
        return (lHit && inR) || (!lHit && inL);
      case 'difference':
        return (lHit && !inR) || (!lHit && inL);
      default:
        return false;
    }
  }

  filterIntersections(xs) {
    let inL = false;
    let inR = false;

    let result = [];
    for (let i = 0; i < xs.length; i++) {
      let lHit = CSG.includes(this.left, xs[i].object);

      if (CSG.intersectionAllowed(this.operation, lHit, inL, inR)) {
        result.push(xs[i]);
      }

      if (lHit) {
        inL = !inL;
      } else {
        inR = !inR;
      }
    }

    return result;
  }

  static includes(A, B) {
    if (A instanceof Group) {
      for (child of A.children) {
        if (this.includes(child, B)) {
          return true;
        }
      }

      return false;
    } else if (A instanceof CSG) {
      return this.includes(A.left, B) || this.includes(A.right, B);
    } else {
      return A.id === B.id;
    }
  }

  boundsOf() {
    let box = new BoundingBox();

    let leftBound = this.left.parentSpaceBoundsOf();
    let rightBound = this.right.parentSpaceBoundsOf();

    box.addBox(leftBound);
    box.addBox(rightBound);

    return box;
  }

  divide(threshold) {
    this.left.divide(threshold);
    this.right.divide(threshold);
  }
}

module.exports = CSG;