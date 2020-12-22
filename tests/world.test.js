const { TestScheduler } = require('jest');
const Color = require('../src/colors');
const Intersection = require('../src/intersections');
const lib = require('../src/lib');
const Light = require('../src/lights');
const Matrix = require('../src/matrices');
const Ray = require('../src/rays');
const Sphere = require('../src/shapes/spheres');
const transformation = require('../src/transformations');
const Tuple = require('../src/tuples');
const World = require('../src/world');

test('Creating a world', () => {
  let w = new World();

  expect(w.objects).toHaveLength(0);
  expect(w.light).toBeNull();
});

test('The default world', () => {
  let light = Light.pointLight(Tuple.point(-10, 10, -10), new Color(1, 1, 1));
  let s1 = new Sphere();
  s1.material.color = new Color(0.8, 1, 0.6);
  s1.material.diffuse = 0.7;
  s1.material.specular = 0.2;
  let s2 = new Sphere();
  s2.transform = transformation.scaling(0.5, 0.5, 0.5);

  let w = World.defaultWorld();
  
  expect(Tuple.areEqual(light.position, w.light.position)).toBeTruthy();
  expect(Color.areEqual(light.intensity, w.light.intensity)).toBeTruthy();
  expect(Color.areEqual(s1.material.color, w.objects[0].material.color)).toBeTruthy();
  expect(s1.material.diffuse).toBeCloseTo(w.objects[0].material.diffuse, lib.PRECISION);
  expect(s1.material.specular).toBeCloseTo(w.objects[0].material.specular, lib.PRECISION);
  expect(Matrix.areEqual(s2.transform, w.objects[1].transform)).toBeTruthy();
});

test('Intersect a world with a ray', () => {
  let w = World.defaultWorld();
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));

  let xs = w.intersectWorld(r);

  expect(xs.length).toBe(4);
  expect(xs[0].t).toBeCloseTo(4, lib.PRECISION);
  expect(xs[1].t).toBeCloseTo(4.5, lib.PRECISION);
  expect(xs[2].t).toBeCloseTo(5.5, lib.PRECISION);
  expect(xs[3].t).toBeCloseTo(6, lib.PRECISION);
});

test('Shading an intersection', () => {
  let w = World.defaultWorld();
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let shape = w.objects[0];
  let i = new Intersection(4, shape);

  let comps = i.prepareComputations(r);
  let c = w.shadeHit(comps);

  expect(Color.areEqual(c, new Color(0.38066, 0.47583, 0.2855))).toBeTruthy();
});

test('Shading an intersection from the inside', () => {
  let w = World.defaultWorld();
  w.light = Light.pointLight(Tuple.point(0, 0.25, 0), new Color(1, 1, 1));
  let r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
  let shape = w.objects[1];
  let i = new Intersection(0.5, shape);

  let comps = i.prepareComputations(r);
  let c = w.shadeHit(comps);

  expect(Color.areEqual(c, new Color(0.90498, 0.90498, 0.90498))).toBeTruthy();
});

test('The color when a ray misses', () => {
  let w = World.defaultWorld();
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 1, 0));

  let c = w.colorAt(r);

  expect(Color.areEqual(c, new Color(0, 0, 0))).toBeTruthy();
});

test('The color when a ray hits', () => {
  let w = World.defaultWorld();
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));

  let c = w.colorAt(r);

  expect(Color.areEqual(c, new Color(0.38066, 0.47583, 0.2855))).toBeTruthy();
});

test('The color with an intersection behind the ray', () => {
  let w = World.defaultWorld();
  w.objects[0].material.ambient = 1;
  w.objects[1].material.ambient = 1;;
  let r = new Ray(Tuple.point(0, 0, 0.75), Tuple.vector(0, 0, -1));

  let c = w.colorAt(r);

  expect(Color.areEqual(c, w.objects[1].material.color)).toBeTruthy();
});

test('There is no shadow when nothing is collinear with point and light', () => {
  let w = World.defaultWorld();
  let p = Tuple.point(0, 10, 0);

  expect(w.isShadowed(p)).toBeFalsy();
});

test('The shadow when an object is between the point and the light', () => {
  let w = World.defaultWorld();
  let p = Tuple.point(10, -10, 10);

  expect(w.isShadowed(p)).toBeTruthy();
});

test('There is no shadow when an object is behind the light', () => {
  let w = World.defaultWorld();
  let p = Tuple.point(-20, 20, -20);

  expect(w.isShadowed(p)).toBeFalsy();
});

test('There is no shadow when an object is behind the point', () => {
  let w = World.defaultWorld();
  let p = Tuple.point(-2, 2, -2);

  expect(w.isShadowed(p)).toBeFalsy();
});

test('shadeHit() is given an intersection in shadow', () => {
  let w = new World();
  w.light = Light.pointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));
  let s1 = new Sphere();
  w.objects.push(s1);
  let s2 = new Sphere();
  s2.transform = transformation.translation(0, 0, 10);
  w.objects.push(s2);
  let r = new Ray(Tuple.point(0, 0, 5), Tuple.vector(0, 0, 1));
  let i = new Intersection(4, s2);

  let comps = i.prepareComputations(r);
  let c = w.shadeHit(comps);

  expect(Color.areEqual(c, new Color(0.1, 0.1, 0.1))).toBeTruthy();
});