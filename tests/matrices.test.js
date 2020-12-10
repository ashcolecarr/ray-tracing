const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Matrix = require('../src/matrices');
const Tuple = require('../src/tuples');

test('Constructing and inspecting a 4x4 matrix', () => {
  let m = new Matrix(4, 4, [1, 2, 3, 4, 5.5, 6.5, 7.5, 8.5, 9, 10, 11, 12, 13.5, 14.5, 15.5, 16.5]);

  expect(m.get(0, 0)).toBeCloseTo(1, lib.PRECISION);
  expect(m.get(0, 3)).toBeCloseTo(4, lib.PRECISION);
  expect(m.get(1, 0)).toBeCloseTo(5.5, lib.PRECISION);
  expect(m.get(1, 2)).toBeCloseTo(7.5, lib.PRECISION);
  expect(m.get(2, 2)).toBeCloseTo(11, lib.PRECISION);
  expect(m.get(3, 0)).toBeCloseTo(13.5, lib.PRECISION);
  expect(m.get(3, 2)).toBeCloseTo(15.5, lib.PRECISION);
});

test('A 2x2 matrix ought to be representable', () => {
  let m = new Matrix(2, 2, [-3, 5, 1, -2]);

  expect(m.get(0, 0)).toBeCloseTo(-3, lib.PRECISION);
  expect(m.get(0, 1)).toBeCloseTo(5, lib.PRECISION);
  expect(m.get(1, 0)).toBeCloseTo(1, lib.PRECISION);
  expect(m.get(1, 1)).toBeCloseTo(-2, lib.PRECISION);
});

test('A 3x3 matrix ought to be representable', () => {
  let m = new Matrix(3, 3, [-3, 5, 0, 1, -2, -7, 0, 1, 1]);

  expect(m.get(0, 0)).toBeCloseTo(-3, lib.PRECISION);
  expect(m.get(1, 1)).toBeCloseTo(-2, lib.PRECISION);
  expect(m.get(2, 2)).toBeCloseTo(1, lib.PRECISION);
});

test('Matrix equality with identical matrices', () => {
  let a = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
  let b = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);

  expect(Matrix.areEqual(a, b)).toBeTruthy();
});

test('Matrix equality with different matrices', () => {
  let a = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
  let b = new Matrix(4, 4, [2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

  expect(Matrix.areEqual(a, b)).toBeFalsy();
});

test('Multiplying two matrices', () => {
  let a = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
  let b = new Matrix(4, 4, [-2, 1, 2, 3, 3, 2, 1, -1, 4, 3, 6, 5, 1, 2, 7, 8]);

  let actual = Matrix.multiply(a, b);

  expect(actual.get(0, 0)).toBeCloseTo(20, lib.PRECISION);
  expect(actual.get(0, 1)).toBeCloseTo(22, lib.PRECISION);
  expect(actual.get(0, 2)).toBeCloseTo(50, lib.PRECISION);
  expect(actual.get(0, 3)).toBeCloseTo(48, lib.PRECISION);
  expect(actual.get(1, 0)).toBeCloseTo(44, lib.PRECISION);
  expect(actual.get(1, 1)).toBeCloseTo(54, lib.PRECISION);
  expect(actual.get(1, 2)).toBeCloseTo(114, lib.PRECISION);
  expect(actual.get(1, 3)).toBeCloseTo(108, lib.PRECISION);
  expect(actual.get(2, 0)).toBeCloseTo(40, lib.PRECISION);
  expect(actual.get(2, 1)).toBeCloseTo(58, lib.PRECISION);
  expect(actual.get(2, 2)).toBeCloseTo(110, lib.PRECISION);
  expect(actual.get(2, 3)).toBeCloseTo(102, lib.PRECISION);
  expect(actual.get(3, 0)).toBeCloseTo(16, lib.PRECISION);
  expect(actual.get(3, 1)).toBeCloseTo(26, lib.PRECISION);
  expect(actual.get(3, 2)).toBeCloseTo(46, lib.PRECISION);
  expect(actual.get(3, 3)).toBeCloseTo(42, lib.PRECISION);
});

test('A matrix multiplied by a tuple', () => {
  let a = new Matrix(4, 4, [1, 2, 3, 4, 2, 4, 4, 2, 8, 6, 4, 1, 0, 0, 0, 1]);
  let b = new Tuple(1, 2, 3, 1);

  let actual = Matrix.multiplyTuple(a, b);

  expect(actual.x).toBeCloseTo(18, lib.PRECISION);
  expect(actual.y).toBeCloseTo(24, lib.PRECISION);
  expect(actual.z).toBeCloseTo(33, lib.PRECISION);
  expect(actual.w).toBeCloseTo(1, lib.PRECISION);
});

test('Multiplying a matrix by the identity matrix', () => {
  let a = new Matrix(4, 4, [0, 1, 2, 4, 1, 2, 4, 8, 2, 4, 8, 16, 4, 8, 16, 32]);
  
  let actual = Matrix.multiply(a, Matrix.identity(4));

  expect(Matrix.areEqual(a, actual)).toBeTruthy();
});

test('Transposing a matrix', () => {
  let a = new Matrix(4, 4, [0, 9, 3, 0, 9, 8, 0, 8, 1, 8, 5, 3, 0, 0, 5, 8]);

  let expected = new Matrix(4, 4, [0, 9, 1, 0, 9, 8, 8, 0, 3, 0, 5, 5, 0, 8, 3, 8]);

  let actual = a.transpose();

  expect(Matrix.areEqual(expected, actual)).toBeTruthy();
});

test('Transposing the identity matrix', () => {
  let a = Matrix.identity(4).transpose();

  expect(Matrix.areEqual(a, Matrix.identity(4))).toBeTruthy();
});

test('Calculating the determinant of a 2x2 matrix', () => {
  let a = new Matrix(2, 2, [1, 5, -3, 2]);

  expect(a.determinant()).toBeCloseTo(17, lib.PRECISION);
});

test('A submatrix of a 3x3 matrix is a 2x2 matrix', () => {
  let a = new Matrix(3, 3, [1, 5, 0, -3, 2, 7, 0, 6, -3]);

  let expected = new Matrix(2, 2, [-3, 2, 0, 6]);

  let actual = a.submatrix(0, 2);

  expect(Matrix.areEqual(expected, actual)).toBeTruthy();
});

test('A submatrix of a 4x4 matrix is a 3x3 matrix', () => {
  let a = new Matrix(4, 4, [-6, 1, 1, 6, -8, 5, 8, 6, -1, 0, 8, 2, -7, 1, -1, 1]);

  let expected = new Matrix(3, 3, [-6, 1, 6, -8, 8, 6, -7, -1, 1]);

  let actual = a.submatrix(2, 1);

  expect(Matrix.areEqual(expected, actual)).toBeTruthy();
});

test('Calculating a minor of a 3x3 matrix', () => {
  let a = new Matrix(3, 3, [3, 5, 0, 2, -1, -7, 6, -1, 5]);
  let b = a.submatrix(1, 0);

  let actual1 = b.determinant();
  let actual2 = a.minor(1, 0);

  expect(actual1).toBeCloseTo(25, lib.PRECISION);
  expect(actual2).toBeCloseTo(25, lib.PRECISION);
});

test('Calculating a cofactor of a 3x3 matrix', () => {
  let a = new Matrix(3, 3, [3, 5, 0, 2, -1, -7, 6, -1, 5]);

  let actual1 = a.minor(0, 0);
  let actual2 = a.cofactor(0, 0);
  let actual3 = a.minor(1, 0);
  let actual4 = a.cofactor(1, 0);

  expect(actual1).toBeCloseTo(-12, lib.PRECISION);
  expect(actual2).toBeCloseTo(-12, lib.PRECISION);
  expect(actual3).toBeCloseTo(25, lib.PRECISION);
  expect(actual4).toBeCloseTo(-25, lib.PRECISION);
});

test('Calculating the determinant of a 3x3 matrix', () => {
  let a = new Matrix(3, 3, [1, 2, 6, -5, 8, -4, 2, 6, 4]);

  let actual1 = a.cofactor(0, 0);
  let actual2 = a.cofactor(0, 1);
  let actual3 = a.cofactor(0, 2);
  let actual4 = a.determinant();

  expect(actual1).toBeCloseTo(56, lib.PRECISION);
  expect(actual2).toBeCloseTo(12, lib.PRECISION);
  expect(actual3).toBeCloseTo(-46, lib.PRECISION);
  expect(actual4).toBeCloseTo(-196, lib.PRECISION);
});

test('Calculating the determinant of a 4x4 matrix', () => {
  let a = new Matrix(4, 4, [-2, -8, 3, 5, -3, 1, 7, 3, 1, 2, -9, 6, -6, 7, 7, -9]);

  let actual1 = a.cofactor(0, 0);
  let actual2 = a.cofactor(0, 1);
  let actual3 = a.cofactor(0, 2);
  let actual4 = a.cofactor(0, 3);
  let actual5 = a.determinant();

  expect(actual1).toBeCloseTo(690, lib.PRECISION);
  expect(actual2).toBeCloseTo(447, lib.PRECISION);
  expect(actual3).toBeCloseTo(210, lib.PRECISION);
  expect(actual4).toBeCloseTo(51, lib.PRECISION);
  expect(actual5).toBeCloseTo(-4071, lib.PRECISION);
});

test('Testing an invertible matrix for invertibility', () => {
  let a = new Matrix(4, 4, [6, 4, 4, 4, 5, 5, 7, 6, 4, -9, 3, -7, 9, 1, 7, -6]);

  let actual = a.determinant();

  expect(actual).toBeCloseTo(-2120, lib.PRECISION);
  expect(() => { a.inverse() }).not.toThrow('Matrix is not invertible');
});

test('Testing a noninvertible matrix for invertibility', () => {
  let a = new Matrix(4, 4, [-4, 2, -2, -3, 9, 6, 2, 6, 0, -5, 1, -5, 0, 0, 0, 0]);

  let actual = a.determinant();

  expect(actual).toBeCloseTo(0, lib.PRECISION);
  expect(() => { a.inverse() }).toThrow('Matrix is not invertible');
});

test('Calculating the inverse of a matrix', () => {
  let a = new Matrix(4, 4, [-5, 2, 6, -8, 1, -5, 1, 8, 7, 7, -6, -7, 1, -3, 7, 4]);
  let b = a.inverse();

  let expected = new Matrix(4, 4, [0.21805, 0.45113, 0.24060, -0.04511, 
    -0.80827, -1.45677, -0.44361, 0.52068, -0.07895, -0.22368, -0.05263, 0.19737, 
    -0.52256, -0.81391, -0.30075, 0.30639]);

  let actual1 = a.determinant();
  let actual2 = a.cofactor(2, 3);
  let actual3 = b.get(3, 2);
  let actual4 = a.cofactor(3, 2);
  let actual5 = b.get(2, 3);

  expect(actual1).toBeCloseTo(532, lib.PRECISION);
  expect(actual2).toBeCloseTo(-160, lib.PRECISION);
  expect(actual3).toBeCloseTo(-160 / 532, lib.PRECISION);
  expect(actual4).toBeCloseTo(105, lib.PRECISION);
  expect(actual5).toBeCloseTo(105 / 532, lib.PRECISION);
  expect(Matrix.areEqual(expected, b)).toBeTruthy();
});

test('Calculating the inverse of another matrix', () => {
  let a = new Matrix(4, 4, [8, -5, 9, 2, 7, 5, 6, 1, -6, 0, 9, 6, -3, 0, -9, -4]);
  let b = a.inverse();

  let expected = new Matrix(4, 4, [-0.15385, -0.15385, -0.28205, -0.53846, 
    -0.07692, 0.12308, 0.02564, 0.03077, 0.35897, 0.35897, 0.43590, 0.92308, 
    -0.69231, -0.69231, -0.76923, -1.92308]);

  expect(Matrix.areEqual(expected, b)).toBeTruthy();
});

test('Calculating the inverse of a matrix', () => {
  let a = new Matrix(4, 4, [9, 3, 0, 9, -5, -2, -6, -3, -4, 9, 6, 4, -7, 6, 6, 2]);
  let b = a.inverse();

  let expected = new Matrix(4, 4, [-0.04074, -0.07778, 0.14444, -0.22222, 
    -0.07778, 0.03333, 0.36667, -0.33333, -0.02901, -0.14630, -0.10926, 0.12963, 
    0.17778, 0.06667, -0.26667, 0.33333]);

  expect(Matrix.areEqual(expected, b)).toBeTruthy();
});

test('Multiplying a product by its inverse', () => {
  let a = new Matrix(4, 4, [3, -9, 7, 3, 3, -8, 2, -9, -4, 4, 4, 1, -6, 5, -1, 1]);
  let b = new Matrix(4, 4, [8, 2, 2, 2, 3, -1, 7, 0, 7, 0, 5, 4, 6, -2, 0, 5]);
  let c = Matrix.multiply(a, b);

  let actual = Matrix.multiply(c, b.inverse());

  expect(Matrix.areEqual(a, actual)).toBeTruthy();;
});