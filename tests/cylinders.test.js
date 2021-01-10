const { TestScheduler } = require('jest');
const Cylinder = require('../src/shapes/cylinders');
const lib = require('../src/lib');
const Ray = require('../src/rays');
const Tuple = require('../src/tuples');

test('A ray misses a cylinder', () => {
  let rays = [new Ray(Tuple.point(1, 0, 0), Tuple.vector(0, 1, 0)), 
    new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 1, 0)),
    new Ray(Tuple.point(0, 0, -5), Tuple.vector(1, 1, 1))];
  let cyl = new Cylinder();

  for (let i = 0; i < rays.length; i++) {
    let direction = rays[i].direction.normalize();
    let r = new Ray(rays[i].origin, direction);
    let xs = cyl.localIntersect(r);

    expect(xs.length).toBe(0);
  }
});

test('A ray strikes a cylinder', () => {
  let rays = [new Ray(Tuple.point(1, 0, -5), Tuple.vector(0, 0, 1)), 
    new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1)),
    new Ray(Tuple.point(0.5, 0, -5), Tuple.vector(0.1, 1, 1))];
  let ts = [[5, 5], [4, 6], [6.80798, 7.08872]];
  let cyl = new Cylinder();

  for (let i = 0; i < rays.length; i++) {
    let direction = rays[i].direction.normalize();
    let r = new Ray(rays[i].origin, direction);
    let xs = cyl.localIntersect(r);

    expect(xs.length).toBe(2);
    expect(xs[0].t).toBeCloseTo(ts[i][0], lib.PRECISION);
    expect(xs[1].t).toBeCloseTo(ts[i][1], lib.PRECISION);
  }
});

test('Normal vector on a cylinder', () => {
  let ps = [Tuple.point(1, 0, 0), Tuple.point(0, 5, -1),
    Tuple.point(0, -2, 1), Tuple.point(-1, 1, 0)];
  let normals = [Tuple.vector(1, 0, 0), Tuple.vector(0, 0, -1),
    Tuple.vector(0, 0, 1), Tuple.vector(-1, 0, 0)];
  let cyl = new Cylinder();

  for (let i = 0; i < ps.length; i++) {
    let p = ps[i];
    
    let n = cyl.localNormalAt(p);

    expect(Tuple.areEqual(n, normals[i])).toBeTruthy();
  }
});

test('The default minimum and maximum for a cylinder', () => {
  let cyl = new Cylinder();

  expect(cyl.minimum).toBe(-Infinity);
  expect(cyl.maximum).toBe(Infinity);
});

test('Intersecting a constrained cylinder', () => {
  let rays = [new Ray(Tuple.point(0, 1.5, 0), Tuple.vector(0.1, 1, 0)), 
    new Ray(Tuple.point(0, 3, -5), Tuple.vector(0, 0, 1)),
    new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1)),
    new Ray(Tuple.point(0, 2, -5), Tuple.vector(0, 0, 1)),
    new Ray(Tuple.point(0, 1, -5), Tuple.vector(0, 0, 1)),
    new Ray(Tuple.point(0, 1.5, -2), Tuple.vector(0, 0, 1))];
  let counts = [0, 0, 0, 0, 0, 2];
  let cyl = new Cylinder();
  cyl.minimum = 1;
  cyl.maximum = 2;

  for (let i = 0; i < rays.length; i++) {
    let direction = rays[i].direction.normalize();
    let r = new Ray(rays[i].origin, direction);
    let xs = cyl.localIntersect(r);

    expect(xs.length).toBe(counts[i]);
  }
});

test('The default closed value for a cylinder', () => {
  let cyl = new Cylinder();

  expect(cyl.closed).toBeFalsy();
});

test('Intersecting the caps of a closed cylinder', () => {
  let rays = [new Ray(Tuple.point(0, 3, 0), Tuple.vector(0, -1, 0)), 
    new Ray(Tuple.point(0, 3, -2), Tuple.vector(0, -1, 2)),
    new Ray(Tuple.point(0, 4, -2), Tuple.vector(0, -1, 1)),
    new Ray(Tuple.point(0, 0, -2), Tuple.vector(0, 1, 2)),
    new Ray(Tuple.point(0, -1, -2), Tuple.vector(0, 1, 1))];
  let counts = [2, 2, 2, 2, 2];
  let cyl = new Cylinder();
  cyl.minimum = 1;
  cyl.maximum = 2;
  cyl.closed = true;

  for (let i = 0; i < rays.length; i++) {
    let direction = rays[i].direction.normalize();
    let r = new Ray(rays[i].origin, direction);
    let xs = cyl.localIntersect(r);

    expect(xs.length).toBe(counts[i]);
  }
});

test('The normal vector on a cylinder\'s end caps', () => {
  let ps = [Tuple.point(0, 1, 0), Tuple.point(0.5, 1, 0),
    Tuple.point(0, 1, 0.5), Tuple.point(0, 2, 0),
    Tuple.point(0.5, 2, 0), Tuple.point(0, 2, 0.5)];
  let normals = [Tuple.vector(0, -1, 0), Tuple.vector(0, -1, 0), 
    Tuple.vector(0, -1, 0), Tuple.vector(0, 1, 0),
    Tuple.vector(0, 1, 0), Tuple.vector(0, 1, 0)];
  let cyl = new Cylinder();
  cyl.minimum = 1;
  cyl.maximum = 2;
  cyl.closed = true;

  for (let i = 0; i < ps.length; i++) {
    let p = ps[i];
    
    let n = cyl.localNormalAt(p);

    expect(Tuple.areEqual(n, normals[i])).toBeTruthy();
  }
});

test('An unbounded cylinder has a bounding box', () => {
  let shape = new Cylinder();

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-1, -Infinity, -1))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(1, Infinity, 1))).toBeTruthy();
});

test('A bounded cylinder has a bounding box', () => {
  let shape = new Cylinder();
  shape.minimum = -5;
  shape.maximum = 3;

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-1, -5, -1))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(1, 3, 1))).toBeTruthy();
});