const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Intersection = require('../src/intersections');
const Sphere = require('../src/spheres');
const Ray = require('../src/rays');
const Tuple = require('../src/tuples');
const transformation = require('../src/transformations');

test('An intersection encapsulates t and object', () => {
  let s = new Sphere();
  let i = new Intersection(3.5, s);

  expect(i.t).toBeCloseTo(3.5, lib.PRECISION);
  expect(i.object instanceof Sphere).toBeTruthy();
});

test('Aggregating intersections', () => {
  let s = new Sphere();
  let i1 = new Intersection(1, s);
  let i2 = new Intersection(2, s);
  let xs = Intersection.intersections(i1, i2);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(1, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(2, lib.PRECISION);
});

test('The hit, when all intersections have positive t', () => {
  let s = new Sphere();
  let i1 = new Intersection(1, s);
  let i2 = new Intersection(2, s);
  let xs = Intersection.intersections(i2, i1);

  let i = Intersection.hit(xs);

  expect(i.t).toBeCloseTo(i1.t, lib.PRECISION);
  expect(i.object instanceof Sphere).toBeTruthy();
});

test('The hit, when some intersections have negative t', () => {
  let s = new Sphere();
  let i1 = new Intersection(-1, s);
  let i2 = new Intersection(1, s);
  let xs = Intersection.intersections(i2, i1);

  let i = Intersection.hit(xs);

  expect(i.t).toBeCloseTo(i2.t, lib.PRECISION);
  expect(i.object instanceof Sphere).toBeTruthy();
});

test('The hit, when all intersections have negative t', () => {
  let s = new Sphere();
  let i1 = new Intersection(-2, s);
  let i2 = new Intersection(-1, s);
  let xs = Intersection.intersections(i2, i1);

  let i = Intersection.hit(xs);

  expect(i).toBeNull();
});

test('The hit is always the lowest nonnegative intersection', () => {
  let s = new Sphere();
  let i1 = new Intersection(5, s);
  let i2 = new Intersection(7, s);
  let i3 = new Intersection(-3, s);
  let i4 = new Intersection(2, s);
  let xs = Intersection.intersections(i1, i2, i3, i4);

  let i = Intersection.hit(xs);

  expect(i.t).toBeCloseTo(i4.t, lib.PRECISION);
  expect(i.object instanceof Sphere).toBeTruthy();
});

test('Precomputing the state of an intersection', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let shape = new Sphere();
  let i = new Intersection(4, shape);

  let comps = i.prepareComputations(r);

  expect(comps.t).toBeCloseTo(i.t, lib.PRECISION);
  expect(comps.object instanceof Sphere).toBeTruthy();
  expect(Tuple.areEqual(comps.point, Tuple.point(0, 0, -1))).toBeTruthy();
  expect(Tuple.areEqual(comps.eyeV, Tuple.vector(0, 0, -1))).toBeTruthy();
  expect(Tuple.areEqual(comps.normalV, Tuple.vector(0, 0, -1))).toBeTruthy();
});

test('The hit, when an intersection occurs on the outside', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let shape = new Sphere();
  let i = new Intersection(4, shape);

  let comps = i.prepareComputations(r);

  expect(comps.inside).toBeFalsy();
});

test('The hit, when an intersection occurs on the inside', () => {
  let r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
  let shape = new Sphere();
  let i = new Intersection(1, shape);

  let comps = i.prepareComputations(r);

  expect(Tuple.areEqual(comps.point, Tuple.point(0, 0, 1))).toBeTruthy();
  expect(Tuple.areEqual(comps.eyeV, Tuple.vector(0, 0, -1))).toBeTruthy();
  expect(comps.inside).toBeTruthy();
  expect(Tuple.areEqual(comps.normalV, Tuple.vector(0, 0, -1))).toBeTruthy();
});

test('The hit should offset the point', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let shape = new Sphere();
  shape.transform = transformation.translation(0, 0, 1);
  let i = new Intersection(5, shape);

  let comps = i.prepareComputations(r);

  expect(comps.overPoint.z < -lib.EPSILON / 2).toBeTruthy();
  expect(comps.point.z > comps.overPoint.z).toBeTruthy();
});