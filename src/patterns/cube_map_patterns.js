'use-strict';

const Pattern = require('./patterns');

class CubeMapPattern extends Pattern {
  constructor(left, front, right, back, up, down) {
    super(left.main, left.main);
    this.faces = [left, front, right, back, up, down];
  }

  patternAt(point) {
    let face = point.faceFromPoint();

    let [u, v] = [0, 0];
    let faceIndex = -1;
    switch (face) {
      case 'left':
        [u, v] = point.cubeUVLeft();
        faceIndex = 0;
        break;
      case 'right':
        [u, v] = point.cubeUVRight();
        faceIndex = 2;
        break;
      case 'front':
        [u, v] = point.cubeUVFront();
        faceIndex = 1;
        break;
      case 'back':
        [u, v] = point.cubeUVBack();
        faceIndex = 3;
        break;
      case 'up':
        [u, v] = point.cubeUVUp();
        faceIndex = 4;
        break;
      default: // 'down'
        [u, v] = point.cubeUVDown();
        faceIndex = 5;
        break;
    }

    return this.faces[faceIndex].uvPatternAt(u, v);
  }
}

module.exports = CubeMapPattern;