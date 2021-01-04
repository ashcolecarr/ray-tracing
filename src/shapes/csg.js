'use-strict';

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
    let leftXS = this.left.intersect(ray);
    let rightXS = this.right.intersect(ray);

    let xs = [];
    xs.push(...leftXS);
    xs.push(...rightXS);
    xs.sort((x, y) => (x.t > y.t) ? 1 : -1);

    return this.filterIntersections(xs);
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
}

module.exports = CSG;