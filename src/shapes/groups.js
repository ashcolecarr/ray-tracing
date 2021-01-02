'use-strict';

const Shape = require('./shapes');

class Group extends Shape {
  constructor() {
    super();
    this.children = [];
    this.name = '';
  }

  localIntersect(ray) {
    let intersections = [];

    this.children.forEach(c => { 
      let xs = c.intersect(ray);
      intersections.push(...xs);
    });
    intersections.sort((x, y) => (x.t > y.t) ? 1 : -1);

    return intersections;
  }

  localNormalAt(point, hit) {
    throw new Error('The localNormalAt function should not be called for groups.');
  }

  addChild(shape) {
    shape.parent = this;
    this.children.push(shape);
  }
}

module.exports = Group;