const { TestScheduler } = require('jest');
const lib = require('../src/lib');
const Material = require('../src/materials');
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

test('The normal on a sphere at a point on the x axis', () => {
  let s = new Sphere();
  let n = s.normalAt(Tuple.point(1, 0, 0));

  expect(Tuple.areEqual(n, Tuple.vector(1, 0, 0))).toBeTruthy();
});

test('The normal on a sphere at a point on the y axis', () => {
  let s = new Sphere();
  let n = s.normalAt(Tuple.point(0, 1, 0));

  expect(Tuple.areEqual(n, Tuple.vector(0, 1, 0))).toBeTruthy();
});

test('The normal on a sphere at a point on the z axis', () => {
  let s = new Sphere();
  let n = s.normalAt(Tuple.point(0, 0, 1));

  expect(Tuple.areEqual(n, Tuple.vector(0, 0, 1))).toBeTruthy();
});

test('The normal on a sphere at a nonaxial point', () => {
  let s = new Sphere();
  let n = s.normalAt(Tuple.point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3));

  expect(Tuple.areEqual(n, Tuple.vector(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3))).toBeTruthy();
});

test('The normal is a normalized vector', () => {
  let s = new Sphere();
  let n = s.normalAt(Tuple.point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3));

  expect(Tuple.areEqual(n, n.normalize())).toBeTruthy();
});

test('Computing the normal on a translated sphere', () => {
  let s = new Sphere();
  s.setTransform(transformation.translation(0, 1, 0));
  let n = s.normalAt(Tuple.point(0, 1.70711, -0.70711));

  expect(Tuple.areEqual(n, Tuple.vector(0, 0.70711, -0.70711)));
});

test('Computing the normal on a transformed sphere', () => {
  let s = new Sphere();
  let m = Matrix.multiply(transformation.scaling(1, 0.5, 1), 
    transformation.rotation(Math.PI / 5, transformation.Axis.Z));
  s.setTransform(m);
  let n = s.normalAt(Tuple.point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));

  expect(Tuple.areEqual(n, Tuple.vector(0, 0.97014, -0.24254)));
});

test('A sphere has a default material', () => {
  let s = new Sphere();
  let m = s.material;

  expect(Material.areEqual(m, new Material())).toBeTruthy();
});

test('A sphere may be assigned a material', () => {
  let s = new Sphere();
  let m = new Material();
  m.ambient = 1;
  s.material = m;

  expect(Material.areEqual(s.material, m)).toBeTruthy();
});