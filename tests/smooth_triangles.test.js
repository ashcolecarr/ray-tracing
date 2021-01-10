const { TestScheduler } = require('jest');
const Intersection = require('../src/intersections');
const lib = require('../src/lib');
const Ray = require('../src/rays');
const SmoothTriangle = require('../src/shapes/smooth_triangles');
const Tuple = require('../src/tuples');

test('Constructing a smooth triangle', () => {
  let p1 = Tuple.point(0, 1, 0);
  let p2 = Tuple.point(-1, 0, 0);
  let p3 = Tuple.point(1, 0, 0);
  let n1 = Tuple.vector(0, 1, 0);
  let n2 = Tuple.vector(-1, 0, 0);
  let n3 = Tuple.vector(1, 0, 0);

  let tri = new SmoothTriangle(p1, p2, p3, n1, n2, n3);

  expect(Tuple.areEqual(tri.p1, p1)).toBeTruthy();
  expect(Tuple.areEqual(tri.p2, p2)).toBeTruthy();
  expect(Tuple.areEqual(tri.p3, p3)).toBeTruthy();
  expect(Tuple.areEqual(tri.n1, n1)).toBeTruthy();
  expect(Tuple.areEqual(tri.n2, n2)).toBeTruthy();
  expect(Tuple.areEqual(tri.n3, n3)).toBeTruthy();
});

test('An intersection with a smooth triangle stores u/v', () => {
  let p1 = Tuple.point(0, 1, 0);
  let p2 = Tuple.point(-1, 0, 0);
  let p3 = Tuple.point(1, 0, 0);
  let n1 = Tuple.vector(0, 1, 0);
  let n2 = Tuple.vector(-1, 0, 0);
  let n3 = Tuple.vector(1, 0, 0);
  let tri = new SmoothTriangle(p1, p2, p3, n1, n2, n3);

  let r = new Ray(Tuple.point(-0.2, 0.3, -2), Tuple.vector(0, 0, 1));
  let xs = tri.localIntersect(r);

  expect(xs[0].u).toBeCloseTo(0.45, lib.PRECISION);
  expect(xs[0].v).toBeCloseTo(0.25, lib.PRECISION);
});

test('A smooth triangle uses u/v to interpolate the normal', () => {
  let p1 = Tuple.point(0, 1, 0);
  let p2 = Tuple.point(-1, 0, 0);
  let p3 = Tuple.point(1, 0, 0);
  let n1 = Tuple.vector(0, 1, 0);
  let n2 = Tuple.vector(-1, 0, 0);
  let n3 = Tuple.vector(1, 0, 0);
  let tri = new SmoothTriangle(p1, p2, p3, n1, n2, n3);

  let i = Intersection.intersectionWithUV(1, tri, 0.45, 0.25);
  let n = tri.normalAt(Tuple.point(0, 0, 0), i);

  expect(Tuple.areEqual(n, Tuple.vector(-0.5547, 0.83205, 0))).toBeTruthy();
});

test('Preparing the normal on a smooth triangle', () => {
  let p1 = Tuple.point(0, 1, 0);
  let p2 = Tuple.point(-1, 0, 0);
  let p3 = Tuple.point(1, 0, 0);
  let n1 = Tuple.vector(0, 1, 0);
  let n2 = Tuple.vector(-1, 0, 0);
  let n3 = Tuple.vector(1, 0, 0);
  let tri = new SmoothTriangle(p1, p2, p3, n1, n2, n3);

  let i = Intersection.intersectionWithUV(1, tri, 0.45, 0.25);
  let r = new Ray(Tuple.point(-0.2, 0.3, -2), Tuple.vector(0, 0, 1));
  let xs = Intersection.intersections(i);
  let comps = i.prepareComputations(r, xs);

  expect(Tuple.areEqual(comps.normalV, Tuple.vector(-0.5547, 0.83205, 0))).toBeTruthy();
});

test('A smooth triangle has a bounding box', () => {
  let p1 = Tuple.point(-3, 7, 2);
  let p2 = Tuple.point(6, 2, -4);
  let p3 = Tuple.point(2, -1, -1);
  let n1 = Tuple.vector(-3, 7, 2);
  let n2 = Tuple.vector(6, 2, -4);
  let n3 = Tuple.vector(2, -1, -1);
  let shape = new SmoothTriangle(p1, p2, p3, n1, n2, n3);

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-3, -1, -4))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(6, 7, 2))).toBeTruthy();
});