'use-strict';

const BoundingBox = require('../bounds');
const Shape = require('./shapes');

class Group extends Shape {
  constructor(name = 'default') {
    super();
    this.children = [];
    this.name = name;
  }

  localIntersect(ray) {
    if (this.boundsOf().intersects(ray)) {
      let intersections = [];

      this.children.forEach(c => { 
        let xs = c.intersect(ray);
        
        if (xs) {
          intersections.push(...xs);
        }
      });
      intersections.sort((x, y) => (x.t > y.t) ? 1 : -1);
  
      return intersections;
    } else {
      return [];
    }
  }

  localNormalAt(point, hit) {
    throw new Error('The localNormalAt function should not be called for groups.');
  }

  addChild(shape) {
    shape.parent = this;
    this.children.push(shape);
  }

  boundsOf() {
    let box = new BoundingBox();

    this.children.forEach(c => {
      let cBox = c.parentSpaceBoundsOf();

      box.addBox(cBox);
    });

    return box;
  }
}

module.exports = Group;