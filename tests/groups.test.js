const { TestScheduler } = require('jest');
const Cylinder = require('../src/shapes/cylinders');
const Group = require('../src/shapes/groups');
const Matrix = require('../src/matrices');
const Ray = require('../src/rays');
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

test('A group has a bounding box that contains its children', () => {
  let s = new Sphere();
  s.setTransform(Matrix.multiply(translation(2, 5, -3), scaling(2, 2, 2)));
  let c = new Cylinder();
  c.minimum = -2;
  c.maximum = 2;
  c.setTransform(Matrix.multiply(translation(-4, -1, 4), scaling(0.5, 1, 0.5)));
  let shape = new Group();
  shape.addChild(s);
  shape.addChild(c);

  let box = shape.boundsOf();

  expect(Tuple.areEqual(box.min, Tuple.point(-4.5, -3, -5))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(4, 7, 4.5))).toBeTruthy();
});

test('Intersecting ray+group doesn\'t test children if box is missed', () => {
  let child = new TestShape();
  let shape = new Group();
  shape.addChild(child);
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 1, 0));

  let xs = shape.intersect(r);

  expect(child.savedRay).toBeNull();
});

test('Intersecting ray+group tests children if box is hit', () => {
  let child = new TestShape();
  let shape = new Group();
  shape.addChild(child);
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));

  let xs = shape.intersect(r);

  expect(child.savedRay).not.toBeNull();
});

test('Partitioning a group\'s children', () => {
  let s1 = new Sphere();
  s1.setTransform(translation(-2, 0, 0));
  let s2 = new Sphere();
  s2.setTransform(translation(2, 0, 0));
  let s3 = new Sphere();
  let g = new Group();
  g.addChild(s1);
  g.addChild(s2);
  g.addChild(s3);

  let [left, right] = g.partitionChildren();

  expect(g.children.length).toBe(1);
  expect(g.children[0].id).toBe(s3.id);
  expect(left[0].id).toBe(s1.id);
  expect(right[0].id).toBe(s2.id);
});

test('Creating a sub-group from a list of children', () => {
  let s1 = new Sphere();
  let s2 = new Sphere();
  let g = new Group();

  g.makeSubgroup([s1, s2]);

  expect(g.children.length).toBe(1);
  expect(g.children[0] instanceof Group).toBeTruthy();
  expect(g.children[0].children[0].id).toBe(s1.id);
  expect(g.children[0].children[1].id).toBe(s2.id);
});

test('Subdividing a group partitions its children', () => {
  let s1 = new Sphere();
  s1.setTransform(translation(-2, -2, 0));
  let s2 = new Sphere();
  s2.setTransform(translation(-2, 2, 0));
  let s3 = new Sphere();
  s3.setTransform(scaling(4, 4, 4));
  let g = new Group();
  g.addChild(s1);
  g.addChild(s2);
  g.addChild(s3);

  g.divide(1);

  expect(g.children[0].id).toBe(s3.id);
  let subgroup = g.children[1];
  expect(subgroup instanceof Group).toBeTruthy();
  expect(subgroup.children.length).toBe(2);
  expect(subgroup.children[0] instanceof Group).toBeTruthy();
  expect(subgroup.children[0].children[0].id).toBe(s1.id);
  expect(subgroup.children[1] instanceof Group).toBeTruthy();
  expect(subgroup.children[1].children[0].id).toBe(s2.id);
});

test('Subdividing a group partitions its children', () => {
  let s1 = new Sphere();
  s1.setTransform(translation(-2, 0, 0));
  let s2 = new Sphere();
  s2.setTransform(translation(2, 1, 0));
  let s3 = new Sphere();
  s3.setTransform(translation(2, -1, 0));
  let subgroup = new Group();
  subgroup.addChild(s1);
  subgroup.addChild(s2);
  subgroup.addChild(s3);
  let s4 = new Sphere();
  let g = new Group();
  g.addChild(subgroup);
  g.addChild(s4);

  g.divide(3);

  expect(g.children[0].id).toBe(subgroup.id);
  expect(g.children[1].id).toBe(s4.id);
  expect(g.children[0].children.length).toBe(2);
  expect(g.children[0].children[0] instanceof Group).toBeTruthy();
  expect(g.children[0].children[0].children[0].id).toBe(s1.id);
  expect(g.children[0].children[1] instanceof Group).toBeTruthy();
  expect(g.children[0].children[1].children[0].id).toBe(s2.id);
  expect(g.children[0].children[1].children[1].id).toBe(s3.id);
});