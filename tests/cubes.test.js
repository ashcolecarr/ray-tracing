const { TestScheduler } = require('jest');
const Cube = require('../src/shapes/cubes');
const lib = require('../src/lib');
const Ray = require('../src/rays');
const Tuple = require('../src/tuples');

test('A ray intersects a cube', () => {
  let rays = [new Ray(Tuple.point(5, 0.5, 0), Tuple.vector(-1, 0, 0)), 
    new Ray(Tuple.point(-5, 0.5, 0), Tuple.vector(1, 0, 0)),
    new Ray(Tuple.point(0.5, 5, 0), Tuple.vector(0, -1, 0)),
    new Ray(Tuple.point(0.5, -5, 0), Tuple.vector(0, 1, 0)),
    new Ray(Tuple.point(0.5, 0, 5), Tuple.vector(0, 0, -1)),
    new Ray(Tuple.point(0.5, 0, -5), Tuple.vector(0, 0, 1)),
    new Ray(Tuple.point(0, 0.5, 0), Tuple.vector(0, 0, 1))];
  let ts = [[4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [4, 6], [-1, 1]];
  let c = new Cube();

  for (let i = 0; i < rays.length; i++) {
    let r = rays[i];
    let xs = c.localIntersect(r);

    expect(xs.length).toBe(2);
    expect(xs[0].t).toBeCloseTo(ts[i][0], lib.PRECISION);
    expect(xs[1].t).toBeCloseTo(ts[i][1], lib.PRECISION);
  }
});

test('A ray misses a cube', () => {
  let rays = [new Ray(Tuple.point(-2, 0, 0), Tuple.vector(0.2673, 0.5345, 0.8018)), 
    new Ray(Tuple.point(0, -2, 0), Tuple.vector(0.8018, 0.2673, 0.5345)),
    new Ray(Tuple.point(0, 0, -2), Tuple.vector(0.5345, 0.8018, 0.2673)),
    new Ray(Tuple.point(2, 0, 2), Tuple.vector(0, 0, -1)),
    new Ray(Tuple.point(0, 2, 2), Tuple.vector(0, -1, 0)),
    new Ray(Tuple.point(2, 2, 0), Tuple.vector(-1, 0, 0))];
  let c = new Cube();

  for (let i = 0; i < rays.length; i++) {
    let r = rays[i];
    let xs = c.localIntersect(r);

    expect(xs.length).toBe(0);
  }
});

test('The normal on the surface of a cube', () => {
  let ps = [Tuple.point(1, 0.5, -0.8), Tuple.point(-1, -0.2, 0.9),
    Tuple.point(-0.4, 1, -0.1), Tuple.point(0.3, -1, -0.7),
    Tuple.point(-0.6, 0.3, 1), Tuple.point(0.4, 0.4, -1),
    Tuple.point(1, 1, 1), Tuple.point(-1, -1, -1)];
  let normals = [Tuple.vector(1, 0, 0), Tuple.vector(-1, 0, 0),
    Tuple.vector(0, 1, 0), Tuple.vector(0, -1, 0),
    Tuple.vector(0, 0, 1), Tuple.vector(0, 0, -1),
    Tuple.vector(1, 0, 0), Tuple.vector(-1, 0, 0)];
  let c = new Cube();

  for (let i = 0; i < ps.length; i++) {
    let p = ps[i];
    
    let normal = c.localNormalAt(p);

    expect(Tuple.areEqual(normal, normals[i])).toBeTruthy();
  }
});

test('A cube has a bounding box', () => {
  let shape = new Cube();

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-1, -1, -1))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(1, 1, 1))).toBeTruthy();
});