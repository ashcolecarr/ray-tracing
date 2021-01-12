const { TestScheduler } = require('jest');
const Group = require('../src/shapes/groups');
const Material = require('../src/materials');
const Matrix = require('../src/matrices');
const Ray = require('../src/rays');
const Sphere = require('../src/shapes/spheres');
const TestShape = require('../src/shapes/test_shapes');
const Tuple = require('../src/tuples');
const { Axis, rotation, scaling, translation } = require('../src/transformations');

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

test('A shape has a parent attribute', () => {
  let s = new TestShape();

  expect(s.parent).toBeNull();
});

test('Converting a point from world to object space', () => {
  let g1 = new Group();
  g1.setTransform(rotation(Math.PI / 2, Axis.Y));
  let g2 = new Group();
  g2.setTransform(scaling(2, 2, 2));
  g1.addChild(g2);
  let s = new Sphere();
  s.setTransform(translation(5, 0, 0));
  g2.addChild(s);

  let p = s.worldToObject(Tuple.point(-2, 0, -10));

  expect(Tuple.areEqual(p, Tuple.point(0, 0, -1))).toBeTruthy();
});

test('Converting a normal from object to world space', () => {
  let g1 = new Group();
  g1.setTransform(rotation(Math.PI / 2, Axis.Y));
  let g2 = new Group();
  g2.setTransform(scaling(1, 2, 3));
  g1.addChild(g2);
  let s = new Sphere();
  s.setTransform(translation(5, 0, 0));
  g2.addChild(s);

  let n = s.normalToWorld(Tuple.vector(Math.sqrt(3) / 3, Math.sqrt(3) / 3,
    Math.sqrt(3) / 3));

  expect(Tuple.areEqual(n, Tuple.vector(0.28571, 0.42857, -0.85714))).toBeTruthy();
});

test('Finding the normal on a child object', () => {
  let g1 = new Group();
  g1.setTransform(rotation(Math.PI / 2, Axis.Y));
  let g2 = new Group();
  g2.setTransform(scaling(1, 2, 3));
  g1.addChild(g2);
  let s = new Sphere();
  s.setTransform(translation(5, 0, 0));
  g2.addChild(s);

  let n = s.normalAt(Tuple.point(1.7321, 1.1547, -5.5774));

  expect(Tuple.areEqual(n, Tuple.vector(0.2857, 0.42854, -0.85716))).toBeTruthy();
});

test('Test shape has (arbitrary) bounds', () => {
  let shape = new TestShape();

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-1, -1, -1))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(1, 1, 1))).toBeTruthy();
});

test('Querying a shape\'s bouding box in its parent\'s space', () => {
  let shape = new Sphere();
  shape.setTransform(Matrix.multiply(translation(1, -3, 5), scaling(0.5, 2, 4)));

  let box = shape.parentSpaceBoundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(0.5, -5, 1))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(1.5, -1, 9))).toBeTruthy();
});

test('Subdividing a primitive does nothing', () => {
  let shape = new Sphere();

  shape.divide(1);

  expect(shape instanceof Sphere).toBeTruthy();
});