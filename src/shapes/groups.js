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

  partitionChildren() {
    let left = [];
    let right = [];
    
    let [leftBox, rightBox] = this.boundsOf().splitBounds();

    for (let i = this.children.length - 1; i >= 0; i--) {
      if (leftBox.containsBox(this.children[i].parentSpaceBoundsOf())) {
        left.push(this.children[i]);
        this.children.splice(i, 1);
      } else if (rightBox.containsBox(this.children[i].parentSpaceBoundsOf())) {
        right.push(this.children[i]);
        this.children.splice(i, 1);
      }
    }

    left.reverse();
    right.reverse();
    return [left, right];
  }

  makeSubgroup(list) {
    let subgroup = new Group();

    for (let item of list) {
      subgroup.addChild(item);
    }

    this.addChild(subgroup);
  }

  divide(threshold) {
    if (threshold <= this.children.length) {
      let [left, right] = this.partitionChildren();

      if (left.length > 0) {
        this.makeSubgroup(left);
      }

      if (right.length > 0) {
        this.makeSubgroup(right);
      }
    }

    for (let child of this.children) {
      child.divide(threshold);
    }
  }
}

module.exports = Group;