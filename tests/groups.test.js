const { TestScheduler } = require('jest');
const Matrix = require('../src/matrices');
const Ray = require('../src/rays');
const Group = require('../src/shapes/groups');
const Sphere = require('../src/shapes/spheres');
const TestShape = require('../src/shapes/test_shapes');
const Tuple = require('../src/tuples');
const { scaling, translation } = require('../src/transformations');

test('Creating a new group', () => {
  let g = new Group();

  expect(Matrix.areEqual(g.transform, Matrix.identity(4))).toBeTruthy();
  expect(g.children.length).toBe(0);
});

test('Add a child to a group', () => {
  let g = new Group();
  let s = new TestShape();

  g.addChild(s);

  expect(g.children.length).toBe(1);
  expect(g.children.findIndex(c => c.id === s.id) > -1).toBeTruthy();
  expect(s.parent.id).toBe(g.id);
});

test('Intersecting a ray with an empty group', () => {
  let g = new Group();
  let r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));

  let xs = g.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('Intersecting a ray with a nonempty group', () => {
  let g = new Group();
  let s1 = new Sphere();
  let s2 = new Sphere();
  s2.setTransform(translation(0, 0, -3));
  let s3 = new Sphere();
  s3.setTransform(translation(5, 0, 0));
  g.addChild(s1);
  g.addChild(s2);
  g.addChild(s3);
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));

  let xs = g.localIntersect(r);

  expect(xs.length).toBe(4);
  expect(xs[0].object.id).toBe(s2.id);
  expect(xs[1].object.id).toBe(s2.id);
  expect(xs[2].object.id).toBe(s1.id);
  expect(xs[3].object.id).toBe(s1.id);
});

test('Intersecting a transformed group', () => {
  let g = new Group();
  g.setTransform(scaling(2, 2, 2));
  let s = new Sphere();
  s.setTransform(translation(5, 0, 0));
  g.addChild(s);
  let r = new Ray(Tuple.point(10, 0, -10), Tuple.vector(0, 0, 1));

  let xs = g.intersect(r);

  expect(xs.length).toBe(2);
});