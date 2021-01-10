const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Ray = require('../src/rays');
const Triangle = require('../src/shapes/triangles');
const Tuple = require('../src/tuples');

test('Constructing a triangle', () => {
  let p1 = Tuple.point(0, 1, 0);
  let p2 = Tuple.point(-1, 0, 0);
  let p3 = Tuple.point(1, 0, 0);
  let t = new Triangle(p1, p2, p3);

  expect(Tuple.areEqual(t.p1, p1)).toBeTruthy();
  expect(Tuple.areEqual(t.p2, p2)).toBeTruthy();
  expect(Tuple.areEqual(t.p3, p3)).toBeTruthy();
  expect(Tuple.areEqual(t.e1, Tuple.vector(-1, -1, 0))).toBeTruthy();
  expect(Tuple.areEqual(t.e2, Tuple.vector(1, -1, 0))).toBeTruthy();
  expect(Tuple.areEqual(t.normal, Tuple.vector(0, 0, -1))).toBeTruthy();
});

test('Finding the normal on a triangle', () => {
  let t = new Triangle(Tuple.point(0, 1, 0), Tuple.point(-1, 0, 0), Tuple.point(1, 0, 0));

  let n1 = t.localNormalAt(Tuple.point(0, 0.5, 0));
  let n2 = t.localNormalAt(Tuple.point(-0.5, 0.75, 0));
  let n3 = t.localNormalAt(Tuple.point(0.5, 0.25, 0));

  expect(Tuple.areEqual(n1, t.normal)).toBeTruthy();
  expect(Tuple.areEqual(n2, t.normal)).toBeTruthy();
  expect(Tuple.areEqual(n3, t.normal)).toBeTruthy();
});

test('Intersecting a ray parallel to the triangle', () => {
  let t = new Triangle(Tuple.point(0, 1, 0), Tuple.point(-1, 0, 0), Tuple.point(1, 0, 0));
  let r = new Ray(Tuple.point(0, -1, -2), Tuple.vector(0, 1, 0));

  let xs = t.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('A ray misses the p1-p3 edge', () => {
  let t = new Triangle(Tuple.point(0, 1, 0), Tuple.point(-1, 0, 0), Tuple.point(1, 0, 0));
  let r = new Ray(Tuple.point(1, 1, -2), Tuple.vector(0, 0, 1));

  let xs = t.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('A ray misses the p1-p2 edge', () => {
  let t = new Triangle(Tuple.point(0, 1, 0), Tuple.point(-1, 0, 0), Tuple.point(1, 0, 0));
  let r = new Ray(Tuple.point(-1, 1, -2), Tuple.vector(0, 0, 1));

  let xs = t.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('A ray misses the p2-p3 edge', () => {
  let t = new Triangle(Tuple.point(0, 1, 0), Tuple.point(-1, 0, 0), Tuple.point(1, 0, 0));
  let r = new Ray(Tuple.point(0, -1, -2), Tuple.vector(0, 0, 1));

  let xs = t.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('A ray strikes a triangle', () => {
  let t = new Triangle(Tuple.point(0, 1, 0), Tuple.point(-1, 0, 0), Tuple.point(1, 0, 0));
  let r = new Ray(Tuple.point(0, 0.5, -2), Tuple.vector(0, 0, 1));

  let xs = t.localIntersect(r);

  expect(xs.length).toBe(1);
  expect(xs[0].t).toBeCloseTo(2, lib.PRECISION);
});

test('A triangle has a bounding box', () => {
  let p1 = Tuple.point(-3, 7, 2);
  let p2 = Tuple.point(6, 2, -4);
  let p3 = Tuple.point(2, -1, -1);
  let shape = new Triangle(p1, p2, p3);

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-3, -1, -4))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(6, 7, 2))).toBeTruthy();
});