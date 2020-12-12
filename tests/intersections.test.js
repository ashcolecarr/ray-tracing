const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Intersection = require('../src/intersections');
const Sphere = require('../src/spheres');

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