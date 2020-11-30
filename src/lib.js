'use-strict';

module.exports = {
  EPSILON: 0.00001,
  PRECISION: 5,

  nearEqual: function (a, b) {
    return Math.abs(a - b) < this.EPSILON;
  }
}