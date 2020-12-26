const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Matrix = require('../src/matrices');
const Ray = require('../src/rays');
const Sphere = require('../src/shapes/spheres');
const Tuple = require('../src/tuples');

test('A ray intersects a sphere at two points', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.localIntersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(4, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(6, lib.PRECISION);
});

test('A ray intersects a sphere at a tangent', () => {
  let r = new Ray(Tuple.point(0, 1, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.localIntersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(5, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(5, lib.PRECISION);
});

test('A ray misses a sphere', () => {
  let r = new Ray(Tuple.point(0, 2, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('A ray originates inside a sphere', () => {
  let r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.localIntersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(-1, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(1, lib.PRECISION);
});

test('A sphere is behind a ray', () => {
  let r = new Ray(Tuple.point(0, 0, 5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.localIntersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(-6, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(-4, lib.PRECISION);
});

test('Intersect sets the object on the localIntersection', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let s = new Sphere();
  let xs = s.localIntersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].object instanceof Sphere).toBeTruthy();
  expect(xs[1].object instanceof Sphere).toBeTruthy();
});

test('The normal on a sphere at a point on the x axis', () => {
  let s = new Sphere();
  let n = s.localNormalAt(Tuple.point(1, 0, 0));

  expect(Tuple.areEqual(n, Tuple.vector(1, 0, 0))).toBeTruthy();
});

test('The normal on a sphere at a point on the y axis', () => {
  let s = new Sphere();
  let n = s.localNormalAt(Tuple.point(0, 1, 0));

  expect(Tuple.areEqual(n, Tuple.vector(0, 1, 0))).toBeTruthy();
});

test('The normal on a sphere at a point on the z axis', () => {
  let s = new Sphere();
  let n = s.localNormalAt(Tuple.point(0, 0, 1));

  expect(Tuple.areEqual(n, Tuple.vector(0, 0, 1))).toBeTruthy();
});

test('The normal on a sphere at a nonaxial point', () => {
  let s = new Sphere();
  let n = s.localNormalAt(Tuple.point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3));

  expect(Tuple.areEqual(n, Tuple.vector(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3))).toBeTruthy();
});

test('The normal is a normalized vector', () => {
  let s = new Sphere();
  let n = s.localNormalAt(Tuple.point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3));

  expect(Tuple.areEqual(n, n.normalize())).toBeTruthy();
});

test('A helper for producing a sphere with a glassy material', () => {
  let s = Sphere.glassSphere();

  expect(Matrix.areEqual(s.transform, Matrix.identity(4))).toBeTruthy();
  expect(s.material.transparency).toBeCloseTo(1, lib.PRECISION);
  expect(s.material.refractiveIndex).toBeCloseTo(1.5, lib.PRECISION);
});