const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Tuple = require('../src/tuples');

test('A tuple with w = 1.0 is a point', () => {
  let a = new Tuple(4.3, -4.2, 3.1, 1.0);

  expect(a.x).toBeCloseTo(4.3, lib.PRECISION);
  expect(a.y).toBeCloseTo(-4.2, lib.PRECISION);
  expect(a.z).toBeCloseTo(3.1, lib.PRECISION);
  expect(a.w).toBeCloseTo(1.0, lib.PRECISION);
  expect(a.isPoint()).toBeTruthy();
  expect(a.isVector()).toBeFalsy();
});

test('A tuple with w = 0.0 is a vector', () => {
  let a = new Tuple(4.3, -4.2, 3.1, 0.0);

  expect(a.x).toBeCloseTo(4.3, lib.PRECISION);
  expect(a.y).toBeCloseTo(-4.2, lib.PRECISION);
  expect(a.z).toBeCloseTo(3.1, lib.PRECISION);
  expect(a.w).toBeCloseTo(0.0, lib.PRECISION);
  expect(a.isPoint()).toBeFalsy();
  expect(a.isVector()).toBeTruthy();
});

test('point() creates tuples with w = 1', () => {
  let p = Tuple.point(4, -4, 3);

  expect(p.x).toBeCloseTo(4, lib.PRECISION);
  expect(p.y).toBeCloseTo(-4, lib.PRECISION);
  expect(p.z).toBeCloseTo(3, lib.PRECISION);
  expect(p.w).toBeCloseTo(1, lib.PRECISION);
});

test('vector() creates tuples with w = 0', () => {
  let v = Tuple.vector(4, -4, 3);

  expect(v.x).toBeCloseTo(4, lib.PRECISION);
  expect(v.y).toBeCloseTo(-4, lib.PRECISION);
  expect(v.z).toBeCloseTo(3, lib.PRECISION);
  expect(v.w).toBeCloseTo(0, lib.PRECISION);
});

test('Adding two tuples', () => {
  let a1 = new Tuple(3, -2, 5, 1);
  let a2 = new Tuple(-2, 3, 1, 0);

  let actual = Tuple.add(a1, a2);

  expect(actual.x).toBeCloseTo(1, lib.PRECISION);
  expect(actual.y).toBeCloseTo(1, lib.PRECISION);
  expect(actual.z).toBeCloseTo(6, lib.PRECISION);
  expect(actual.w).toBeCloseTo(1, lib.PRECISION);
});

test('Subtracting two points', () => {
  let p1 = Tuple.point(3, 2, 1);
  let p2 = Tuple.point(5, 6, 7);

  let actual = Tuple.subtract(p1, p2);

  expect(actual.x).toBeCloseTo(-2, lib.PRECISION);
  expect(actual.y).toBeCloseTo(-4, lib.PRECISION);
  expect(actual.z).toBeCloseTo(-6, lib.PRECISION);
  expect(actual.w).toBeCloseTo(0, lib.PRECISION);
});

test('Subtracting a vector from a point', () => {
  let p = Tuple.point(3, 2, 1);
  let v = Tuple.vector(5, 6, 7);

  let actual = Tuple.subtract(p, v);

  expect(actual.x).toBeCloseTo(-2, lib.PRECISION);
  expect(actual.y).toBeCloseTo(-4, lib.PRECISION);
  expect(actual.z).toBeCloseTo(-6, lib.PRECISION);
  expect(actual.w).toBeCloseTo(1, lib.PRECISION);
});

test('Subtracting two vectors', () => {
  let v1 = Tuple.point(3, 2, 1);
  let v2 = Tuple.point(5, 6, 7);

  let actual = Tuple.subtract(v1, v2);

  expect(actual.x).toBeCloseTo(-2, lib.PRECISION);
  expect(actual.y).toBeCloseTo(-4, lib.PRECISION);
  expect(actual.z).toBeCloseTo(-6, lib.PRECISION);
  expect(actual.w).toBeCloseTo(0, lib.PRECISION);
});

test('Subtracting a vector from the zero vector', () => {
  let zero = Tuple.vector(0, 0, 0);
  let v = Tuple.vector(1, -2, 3);

  let actual = Tuple.subtract(zero, v);

  expect(actual.x).toBeCloseTo(-1, lib.PRECISION);
  expect(actual.y).toBeCloseTo(2, lib.PRECISION);
  expect(actual.z).toBeCloseTo(-3, lib.PRECISION);
  expect(actual.w).toBeCloseTo(0, lib.PRECISION);
});

test('Negating a tuple', () => {
  let a = new Tuple(1, -2, 3, -4);

  let actual = Tuple.negate(a);

  expect(actual.x).toBeCloseTo(-1, lib.PRECISION);
  expect(actual.y).toBeCloseTo(2, lib.PRECISION);
  expect(actual.z).toBeCloseTo(-3, lib.PRECISION);
  expect(actual.w).toBeCloseTo(4, lib.PRECISION);
});

test('Multiplying a tuple by a scalar', () => {
  let a = new Tuple(1, -2, 3, -4);

  let actual = Tuple.multiply(a, 3.5);

  expect(actual.x).toBeCloseTo(3.5, lib.PRECISION);
  expect(actual.y).toBeCloseTo(-7, lib.PRECISION);
  expect(actual.z).toBeCloseTo(10.5, lib.PRECISION);
  expect(actual.w).toBeCloseTo(-14, lib.PRECISION);
});

test('Multiplying a tuple by a fraction', () => {
  let a = new Tuple(1, -2, 3, -4);

  let actual = Tuple.multiply(a, 0.5);

  expect(actual.x).toBeCloseTo(0.5, lib.PRECISION);
  expect(actual.y).toBeCloseTo(-1, lib.PRECISION);
  expect(actual.z).toBeCloseTo(1.5, lib.PRECISION);
  expect(actual.w).toBeCloseTo(-2, lib.PRECISION);
});

test('Dividing a tuple by a scalar', () => {
  let a = new Tuple(1, -2, 3, -4);

  let actual = Tuple.divide(a, 2);

  expect(actual.x).toBeCloseTo(0.5, lib.PRECISION);
  expect(actual.y).toBeCloseTo(-1, lib.PRECISION);
  expect(actual.z).toBeCloseTo(1.5, lib.PRECISION);
  expect(actual.w).toBeCloseTo(-2, lib.PRECISION);
});

test('Computing the magnitude of vector(1, 0, 0)', () => {
  let v = Tuple.vector(1, 0, 0);

  let actual = v.magnitude();

  expect(actual).toBeCloseTo(1, lib.PRECISION);
});

test('Computing the magnitude of vector(0, 1, 0)', () => {
  let v = Tuple.vector(0, 1, 0);

  let actual = v.magnitude();

  expect(actual).toBeCloseTo(1, lib.PRECISION);
});

test('Computing the magnitude of vector(0, 0, 1)', () => {
  let v = Tuple.vector(0, 0, 1);

  let actual = v.magnitude();

  expect(actual).toBeCloseTo(1, lib.PRECISION);
});

test('Computing the magnitude of vector(1, 2, 3)', () => {
  let v = Tuple.vector(1, 2, 3);

  let actual = v.magnitude();

  expect(actual).toBeCloseTo(Math.sqrt(14), lib.PRECISION);
});

test('Computing the magnitude of vector(-1, -2, -3)', () => {
  let v = Tuple.vector(-1, -2, -3);

  let actual = v.magnitude();

  expect(actual).toBeCloseTo(Math.sqrt(14), lib.PRECISION);
});

test('Normalizing vector(4, 0, 0) gives (1, 0, 0)', () => {
  let v = Tuple.vector(4, 0, 0);

  let actual = v.normalize();

  expect(actual.x).toBeCloseTo(1, lib.PRECISION);
  expect(actual.y).toBeCloseTo(0, lib.PRECISION);
  expect(actual.z).toBeCloseTo(0, lib.PRECISION);
  expect(actual.w).toBeCloseTo(0, lib.PRECISION);
});

test('Normalizing vector(1, 2, 3)', () => {
  let v = Tuple.vector(1, 2, 3);

  let actual = v.normalize();

  expect(actual.x).toBeCloseTo(0.26726, lib.PRECISION);
  expect(actual.y).toBeCloseTo(0.53452, lib.PRECISION);
  expect(actual.z).toBeCloseTo(0.80178, lib.PRECISION);
  expect(actual.w).toBeCloseTo(0, lib.PRECISION);
});

test('The magnitude of a normalized vector', () => {
  let v = Tuple.vector(1, 2, 3);
  let norm = v.normalize();

  let actual = norm.magnitude();

  expect(actual).toBeCloseTo(1, lib.PRECISION);
});

test('The dot product of two tuples', () => {
  let a = Tuple.vector(1, 2, 3);
  let b = Tuple.vector(2, 3, 4);

  let actual = Tuple.dot(a, b);

  expect(actual).toBeCloseTo(20, lib.PRECISION);
});

test('The cross product of two vectors', () => {
  let a = Tuple.vector(1, 2, 3);
  let b = Tuple.vector(2, 3, 4);

  let actual1 = Tuple.cross(a, b);
  let actual2 = Tuple.cross(b, a);

  expect(actual1.x).toBeCloseTo(-1, lib.PRECISION);
  expect(actual1.y).toBeCloseTo(2, lib.PRECISION);
  expect(actual1.z).toBeCloseTo(-1, lib.PRECISION);
  expect(actual1.w).toBeCloseTo(0, lib.PRECISION);

  expect(actual2.x).toBeCloseTo(1, lib.PRECISION);
  expect(actual2.y).toBeCloseTo(-2, lib.PRECISION);
  expect(actual2.z).toBeCloseTo(1, lib.PRECISION);
  expect(actual2.w).toBeCloseTo(0, lib.PRECISION);
});

test('Reflecting a vector approaching at 45 degrees', () => {
  let v = Tuple.vector(1, -1, 0);
  let n = Tuple.vector(0, 1, 0);
  let r = v.reflect(n);

  expect(Tuple.areEqual(r, Tuple.vector(1, 1, 0))).toBeTruthy();
});

test('Reflecting a vector off a slanted surface', () => {
  let v = Tuple.vector(0, -1, 0);
  let n = Tuple.vector(Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0);
  let r = v.reflect(n);

  expect(Tuple.areEqual(r, Tuple.vector(1, 0, 0))).toBeTruthy();
});