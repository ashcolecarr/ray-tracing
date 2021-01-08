'use-strict';

class Sequence {
  constructor(...nums) {
    this.nums = nums;
    this.current = 0;
  }

  next() {
    if (this.nums.length > 0) {
      let num = this.nums[this.current];

      this.current++;
      if (this.current === this.nums.length) {
        this.current = 0;
      }

      return num;
    } else {
      return Math.round((Math.random() + Number.EPSILON) * 100) / 100;
    }
  }
}

module.exports = Sequence;