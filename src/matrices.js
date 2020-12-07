'use-strict';

const lib = require('./lib');
const Tuple = require('./tuples');

class Matrix {
  constructor(rows, columns, values) {
    this.rows = rows;
    this.columns = columns;
    this.values = values;
  }

  get(x, y) {
    return this.values[this.columns * x + y];
  }

  set(x, y, value) {
    this.values[this.columns * x + y] = value;
  }

  static areEqual(a, b) {
    if (a.rows === b.rows && a.columns === b.columns) {
      for (let i = 0; i < a.values.length; i++) {
        if (!lib.nearEqual(a.values[i], b.values[i])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  static multiply(a, b) {
    let m = new Matrix(a.rows, b.columns, new Array(a.rows * b.columns).fill(0));
    
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < b.columns; j++) {
        for (let k = 0; k < a.columns; k++) {
          let newValue = m.get(i, j) + a.get(i, k) * b.get(k, j);
          m.set(i, j, newValue);
        }
      }
    }

    return m;
  }

  static multiplyTuple(a, b) {
    let vector = this.multiply(a, new Matrix(a.rows, 1, [b.x, b.y, b.z, b.w]));

    return new Tuple(vector.get(0, 0), vector.get(1, 0), vector.get(2, 0), vector.get(3, 0));
  }

  static identity(size) {
    let identity = new Matrix(size, size, new Array(size * size).fill(0));
    for (let i = 0; i < size; i++) {
      identity.set(i, i, 1);
    }

    return identity;
  }

  transpose() {
    let transposed = new Matrix(this.rows, this.columns, new Array(this.rows * this.columns).fill(0));

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        transposed.set(i, j, this.get(j, i));
      }
    }

    return transposed;
  }

  determinant() {
    if (this.rows === 2 && this.columns === 2) {
      return this.get(0, 0) * this.get(1, 1) - this.get(0, 1) * this.get(1, 0);
    }

    let determinant = 0;
    for (let i = 0; i < this.columns; i++) {
      determinant += this.get(0, i) * this.cofactor(0, i);
    }

    return determinant;
  }

  submatrix(row, column) {
    let submatrix = new Matrix(this.rows - 1, this.columns - 1, 
      new Array((this.rows - 1) * (this.columns - 1)).fill(0));

    let submatrixRowCount = 0;
    for (let i = 0; i < this.rows; i++) {
      if (i === row) {
        continue;
      }

      let submatrixColumnCount = 0;
      for (let j = 0; j < this.columns; j++) {
        if (j === column) {
          continue;
        }

        submatrix.set(submatrixRowCount, submatrixColumnCount, this.get(i, j));
        submatrixColumnCount++;
      }
      submatrixRowCount++;
    }

    return submatrix;
  }

  minor(row, column) {
    let submatrix = this.submatrix(row, column);

    return submatrix.determinant();
  }

  cofactor(row, column) {
    let minor = this.minor(row, column);

    if ((row + column) % 2 === 1) {
      return minor *= -1;
    } else {
      return minor;
    }
  }

  inverse() {
    // If a matrix's determinant is zero, then it is not invertible.
    let determinant = this.determinant();
    if (lib.nearEqual(determinant, 0)) {
      throw new Error('Matrix is not invertible');
    }

    let inverse = new Matrix(this.rows, this.columns, new Array(this.rows * this.columns).fill(0));
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let cofactor = this.cofactor(i, j);

        inverse.set(j, i, cofactor / determinant)
      }
    }

    return inverse;
  }
}

module.exports = Matrix;