'use-strict';

class Intersection {
  constructor(t, object) {
    this.t = t;
    this.object = object;
  }

  static intersections(...ints) {
    let intersections = [];
    ints.forEach(int => intersections.push(int));

    intersections.sort((x, y) => (x.t > y.t) ? 1 : -1);

    return intersections;
  }

  static hit(intersections) {
    // The list of intersections should be already sorted.
    let positiveIntersections = intersections.filter(i => i.t > 0);

    if (positiveIntersections.length === 0) {
      return null;
    }

    return positiveIntersections[0];
  }
}

module.exports = Intersection;