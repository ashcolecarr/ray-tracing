const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Matrix = require('../src/matrices');
const transformation = require('../src/transformations');
const Tuple = require('../src/tuples');

test('Multiplying by a translation matrix', () => {
  let transform = transformation.translation(5, -3, 2);
  let p = Tuple.point(-3, 4, 5);

  let expected = Tuple.point(2, 1, 7);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('Multiplying by the inverse of a translation matrix', () => {
  let transform = transformation.translation(5, -3, 2);
  let inv = transform.inverse();
  let p = Tuple.point(-3, 4, 5);

  let expected = Tuple.point(-8, 7, 3);

  let actual = Matrix.multiplyTuple(inv, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('Translation does not affect vectors', () => {
  let transform = transformation.translation(5, -3, 2);
  let v = Tuple.vector(-3, 4, 5);

  let actual = Matrix.multiplyTuple(transform, v);

  expect(Tuple.areEqual(v, actual)).toBeTruthy();
});

test('A scaling matrix applied to a point', () => {
  let transform = transformation.scaling(2, 3, 4);
  let p = Tuple.point(-4, 6, 8);

  let expected = Tuple.point(-8, 18, 32);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('A scaling matrix applied to a vector', () => {
  let transform = transformation.scaling(2, 3, 4);
  let v = Tuple.vector(-4, 6, 8);

  let expected = Tuple.vector(-8, 18, 32);

  let actual = Matrix.multiplyTuple(transform, v);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('Multiplying by the inverse of a scaling matrix', () => {
  let transform = transformation.scaling(2, 3, 4);
  let inv = transform.inverse();
  let v = Tuple.point(-4, 6, 8);

  let expected = Tuple.point(-2, 2, 2);

  let actual = Matrix.multiplyTuple(inv, v);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('Reflection is scaling by a negative value', () => {
  let transform = transformation.scaling(-1, 1, 1);
  let p = Tuple.point(2, 3, 4);

  let expected = Tuple.point(-2, 3, 4);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('Rotating a point around the x axis', () => {
  let p = Tuple.point(0, 1, 0);
  let halfQuarter = transformation.rotation(Math.PI / 4, transformation.Axis.X);
  let fullQuarter = transformation.rotation(Math.PI / 2, transformation.Axis.X);

  let expectedHalfQuarter = Tuple.point(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);
  let expectedFullQuarter = Tuple.point(0, 0, 1);

  let actualHalfQuarter = Matrix.multiplyTuple(halfQuarter, p);
  let actualFullQuarter = Matrix.multiplyTuple(fullQuarter, p);

  expect(Tuple.areEqual(expectedHalfQuarter, actualHalfQuarter)).toBeTruthy();
  expect(Tuple.areEqual(expectedFullQuarter, actualFullQuarter)).toBeTruthy();
});

test('The inverse of an x-rotation rotates in the opposite direction', () => {
  let p = Tuple.point(0, 1, 0);
  let halfQuarter = transformation.rotation(Math.PI / 4, transformation.Axis.X);
  let inv = halfQuarter.inverse();

  let expected = Tuple.point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);

  let actual = Matrix.multiplyTuple(inv, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('Rotating a point around the y axis', () => {
  let p = Tuple.point(0, 0, 1);
  let halfQuarter = transformation.rotation(Math.PI / 4, transformation.Axis.Y);
  let fullQuarter = transformation.rotation(Math.PI / 2, transformation.Axis.Y);

  let expectedHalfQuarter = Tuple.point(Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2);
  let expectedFullQuarter = Tuple.point(1, 0, 0);

  let actualHalfQuarter = Matrix.multiplyTuple(halfQuarter, p);
  let actualFullQuarter = Matrix.multiplyTuple(fullQuarter, p);

  expect(Tuple.areEqual(expectedHalfQuarter, actualHalfQuarter)).toBeTruthy();
  expect(Tuple.areEqual(expectedFullQuarter, actualFullQuarter)).toBeTruthy();
});

test('Rotating a point around the z axis', () => {
  let p = Tuple.point(0, 1, 0);
  let halfQuarter = transformation.rotation(Math.PI / 4, transformation.Axis.Z);
  let fullQuarter = transformation.rotation(Math.PI / 2, transformation.Axis.Z);

  let expectedHalfQuarter = Tuple.point(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
  let expectedFullQuarter = Tuple.point(-1, 0, 0);

  let actualHalfQuarter = Matrix.multiplyTuple(halfQuarter, p);
  let actualFullQuarter = Matrix.multiplyTuple(fullQuarter, p);

  expect(Tuple.areEqual(expectedHalfQuarter, actualHalfQuarter)).toBeTruthy();
  expect(Tuple.areEqual(expectedFullQuarter, actualFullQuarter)).toBeTruthy();
});

test('A shearing transformation moves x in proportion to y', () => {
  let transform = transformation.shearing(0, 1, 0, 0, 0, 0);
  let p = Tuple.point(2, 3, 4);

  let expected = Tuple.point(6, 3, 4);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('A shearing transformation moves x in proportion to z', () => {
  let transform = transformation.shearing(0, 1, 0, 0, 0, 0);
  let p = Tuple.point(2, 3, 4);

  let expected = Tuple.point(6, 3, 4);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('A shearing transformation moves y in proportion to x', () => {
  let transform = transformation.shearing(0, 0, 1, 0, 0, 0);
  let p = Tuple.point(2, 3, 4);

  let expected = Tuple.point(2, 5, 4);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('A shearing transformation moves y in proportion to z', () => {
  let transform = transformation.shearing(0, 0, 0, 1, 0, 0);
  let p = Tuple.point(2, 3, 4);

  let expected = Tuple.point(2, 7, 4);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('A shearing transformation moves z in proportion to x', () => {
  let transform = transformation.shearing(0, 0, 0, 0, 1, 0);
  let p = Tuple.point(2, 3, 4);

  let expected = Tuple.point(2, 3, 6);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('A shearing transformation moves z in proportion to y', () => {
  let transform = transformation.shearing(0, 0, 0, 0, 0, 1);
  let p = Tuple.point(2, 3, 4);

  let expected = Tuple.point(2, 3, 7);

  let actual = Matrix.multiplyTuple(transform, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});

test('Individual transformations are applied in sequence', () => {
  let p = Tuple.point(1, 0, 1);
  let a = transformation.rotation(Math.PI / 2, transformation.Axis.X);
  let b = transformation.scaling(5, 5, 5);
  let c = transformation.translation(10, 5, 7);

  let expected1 = Tuple.point(1, -1, 0);
  let p2 = Matrix.multiplyTuple(a, p);

  let expected2 = Tuple.point(5, -5, 0);
  let p3 = Matrix.multiplyTuple(b, p2);

  let expected3 = Tuple.point(15, 0, 7);
  let p4 = Matrix.multiplyTuple(c, p3);

  expect(Tuple.areEqual(expected1, p2)).toBeTruthy();
  expect(Tuple.areEqual(expected2, p3)).toBeTruthy();
  expect(Tuple.areEqual(expected3, p4)).toBeTruthy();
});

test('Chained transformations must be applied in reverse order', () => {
  let p = Tuple.point(1, 0, 1);
  let a = transformation.rotation(Math.PI / 2, transformation.Axis.X);
  let b = transformation.scaling(5, 5, 5);
  let c = transformation.translation(10, 5, 7);

  let t = Matrix.multiply(c, Matrix.multiply(b, a));

  let expected = Tuple.point(15, 0, 7);

  let actual = Matrix.multiplyTuple(t, p);

  expect(Tuple.areEqual(expected, actual)).toBeTruthy();
});