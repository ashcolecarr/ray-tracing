const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Plane = require('../src/shapes/planes');
const Ray = require('../src/rays');
const Tuple = require('../src/tuples');

test('The normal of a plane is constant everywhere', () => {
  let p = new Plane();
  let n1 = p.localNormalAt(Tuple.point(0, 0, 0));
  let n2 = p.localNormalAt(Tuple.point(10, 0, -10));
  let n3 = p.localNormalAt(Tuple.point(-5, 0, 150));

  expect(Tuple.areEqual(n1, Tuple.vector(0, 1, 0))).toBeTruthy();
  expect(Tuple.areEqual(n2, Tuple.vector(0, 1, 0))).toBeTruthy();
  expect(Tuple.areEqual(n3, Tuple.vector(0, 1, 0))).toBeTruthy();
});

test('Intersect with a ray parallel to the plane', () => {
  let p = new Plane();
  let r = new Ray(Tuple.point(0, 10, 0), Tuple.vector(0, 0, 1));

  let xs = p.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('Intersect with a coplanar ray', () => {
  let p = new Plane();
  let r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));

  let xs = p.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('A ray intersecting a plane from above', () => {
  let p = new Plane();
  let r = new Ray(Tuple.point(0, 1, 0), Tuple.vector(0, -1, 0));

  let xs = p.localIntersect(r);

  expect(xs.length).toBe(1);
  expect(xs[0].t).toBeCloseTo(1, lib.PRECISION);
  expect(xs[0].object instanceof Plane).toBeTruthy();
});

test('A ray intersecting a plane from below', () => {
  let p = new Plane();
  let r = new Ray(Tuple.point(0, -1, 0), Tuple.vector(0, 1, 0));

  let xs = p.localIntersect(r);

  expect(xs.length).toBe(1);
  expect(xs[0].t).toBeCloseTo(1, lib.PRECISION);
  expect(xs[0].object instanceof Plane).toBeTruthy();
});

test('A plane has a bounding box', () => {
  let shape = new Plane();

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-Infinity, 0, -Infinity))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(Infinity, 0, Infinity))).toBeTruthy();
});