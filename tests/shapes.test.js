const { TestScheduler } = require('jest');
const Material = require('../src/materials');
const Matrix = require('../src/matrices');
const Ray = require('../src/rays');
const TestShape = require('../src/test_shapes');
const { Axis, rotation, scaling, translation } = require('../src/transformations');
const Tuple = require('../src/tuples');

test('The default transformation', () => {
  let s = new TestShape();

  expect(Matrix.areEqual(s.transform, Matrix.identity(4))).toBeTruthy();
});

test('Assigning a transformation', () => {
  let s = new TestShape();
  s.setTransform(translation(2, 3, 4));

  expect(Matrix.areEqual(s.transform, translation(2, 3, 4))).toBeTruthy();
});

test('The default material', () => {
  let s = new TestShape();

  let m = s.material;

  expect(Material.areEqual(m, new Material())).toBeTruthy();
});

test('Assigning a material', () => {
  let s = new TestShape();

  let m = s.material;
  m.ambient = 1;
  s.material = m;

  expect(Material.areEqual(s.material, m)).toBeTruthy();
});

test('Intersecting a scaled shape with a ray', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let s = new TestShape();
  s.setTransform(scaling(2, 2, 2));

  let xs = s.intersect(r);

  expect(Tuple.areEqual(s.savedRay.origin, Tuple.point(0, 0, -2.5))).toBeTruthy();
  expect(Tuple.areEqual(s.savedRay.direction, Tuple.vector(0, 0, 0.5))).toBeTruthy();
});

test('Intersecting a translated shape with a ray', () => {
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let s = new TestShape();
  s.setTransform(translation(5, 0, 0));

  let xs = s.intersect(r);

  expect(Tuple.areEqual(s.savedRay.origin, Tuple.point(-5, 0, -5))).toBeTruthy();
  expect(Tuple.areEqual(s.savedRay.direction, Tuple.vector(0, 0, 1))).toBeTruthy();
});

test('Computing the normal on a translated shape', () => {
  let s = new TestShape();
  s.setTransform(translation(0, 1, 0));
  let n = s.normalAt(Tuple.point(0, 1.70711, -0.70711));

  expect(Tuple.areEqual(n, Tuple.vector(0, 0.70711, -0.70711))).toBeTruthy();
});

test('Computing the normal on a transformed sphere', () => {
  let s = new TestShape();
  let m = Matrix.multiply(scaling(1, 0.5, 1), rotation(Math.PI / 5, Axis.Z));
  s.setTransform(m);
  let n = s.normalAt(Tuple.point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));

  expect(Tuple.areEqual(n, Tuple.vector(0, 0.97014, -0.24254))).toBeTruthy();
});