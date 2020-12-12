const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Matrix = require('../src/matrices');
const Ray = require('../src/rays');
const Sphere = require('../src/spheres');
const transformation = require('../src/transformations');
const Tuple = require('../src/tuples');

test('A ray intersects a sphere at two points', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.intersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(4, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(6, lib.PRECISION);
});

test('A ray intersects a sphere at a tangent', () => {
  let r = new Ray(Tuple.point(0, 1, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.intersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(5, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(5, lib.PRECISION);
});

test('A ray misses a sphere', () => {
  let r = new Ray(Tuple.point(0, 2, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.intersect(r);

  expect(xs.length).toBe(0);
});

test('A ray originates inside a sphere', () => {
  let r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.intersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(-1, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(1, lib.PRECISION);
});

test('A sphere is behind a ray', () => {
  let r = new Ray(Tuple.point(0, 0, 5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.intersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(-6, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(-4, lib.PRECISION);
});

test('Intersect sets the object on the intersection', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.intersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].object instanceof Sphere).toBeTruthy();
  expect(xs[1].object instanceof Sphere).toBeTruthy();
});

test('A sphere\'s default transformation', () => {
  let s = new Sphere();

  expect(Matrix.areEqual(s.transform, Matrix.identity(4)));
});

test('Changing a sphere\'s transformation', () => {
  let s = new Sphere();
  let t = transformation.translation(2, 3, 4);

  s.setTransform(t);

  expect(Matrix.areEqual(s.transform, t));
});

test('Intersecting a scaled sphere with a ray', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  s.setTransform(transformation.scaling(2, 2, 2));
  let xs = s.intersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(3, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(7, lib.PRECISION);
});

test('Intersecting a translated sphere with a ray', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  s.setTransform(transformation.translation(5, 0, 0));
  let xs = s.intersect(r);

  expect(xs.length).toBe(0);
});