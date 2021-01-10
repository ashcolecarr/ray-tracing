const { TestScheduler } = require('jest');
const Cone = require('../src/shapes/cones');
const lib = require('../src/lib');
const Ray = require('../src/rays');
const Tuple = require('../src/tuples');

test('Intersecting a cone with a ray', () => {
  let rays = [new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1)), 
    new Ray(Tuple.point(0, 0, -5), Tuple.vector(1, 1, 1)),
    new Ray(Tuple.point(1, 1, -5), Tuple.vector(-0.5, -1, 1))];
  let ts = [[5, 5], [8.66025, 8.66025], [4.55006, 49.44994]];
  let shape = new Cone();

  for (let i = 0; i < rays.length; i++) {
    let direction = rays[i].direction.normalize();
    let r = new Ray(rays[i].origin, direction);
    let xs = shape.localIntersect(r);

    expect(xs.length).toBe(2);
    expect(xs[0].t).toBeCloseTo(ts[i][0], lib.PRECISION);
    expect(xs[1].t).toBeCloseTo(ts[i][1], lib.PRECISION);
  }
});

test('Intersecting a cone with a ray parallel to one of its halves', () => {
  let shape = new Cone();
  let direction = Tuple.vector(0, 1, 1).normalize();
  let r = new Ray(Tuple.point(0, 0, -1), direction);

  let xs = shape.localIntersect(r);

  expect(xs.length).toBe(1);
  expect(xs[0].t).toBeCloseTo(0.35355, lib.PRECISION);
});

test('Intersecting a cone\'s end caps', () => {
  let rays = [new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 1, 0)), 
    new Ray(Tuple.point(0, 0, -0.25), Tuple.vector(0, 1, 1)),
    new Ray(Tuple.point(0, 0, -0.25), Tuple.vector(0, 1, 0))];
  let counts = [0, 2, 4];
  let shape = new Cone();
  shape.minimum = -0.5;
  shape.maximum = 0.5;
  shape.closed = true;

  for (let i = 0; i < rays.length; i++) {
    let direction = rays[i].direction.normalize();
    let r = new Ray(rays[i].origin, direction);
    let xs = shape.localIntersect(r);

    expect(xs.length).toBe(counts[i]);
  }
});

test('Computing the normal vector on a cone', () => {
  let ps = [Tuple.point(0, 0, 0), Tuple.point(1, 1, 1), Tuple.point(-1, -1, 0)];
  let normals = [Tuple.vector(0, 0, 0), Tuple.vector(1, -Math.sqrt(2), 1), 
    Tuple.vector(-1, 1, 0)];
  let shape = new Cone();

  for (let i = 0; i < ps.length; i++) {
    let p = ps[i];
    
    let n = shape.localNormalAt(p);

    expect(Tuple.areEqual(n, normals[i])).toBeTruthy();
  }
});

test('An unbounded cone has a bounding box', () => {
  let shape = new Cone();

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-Infinity, -Infinity, -Infinity))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(Infinity, Infinity, Infinity))).toBeTruthy();
});

test('A bounded cone has a bounding box', () => {
  let shape = new Cone();
  shape.minimum = -5;
  shape.maximum = 3;

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-5, -5, -5))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(5, 3, 5))).toBeTruthy();
});