const { TestScheduler } = require('jest');
const Color = require('../src/colors');
const Intersection = require('../src/intersections');
const lib = require('../src/lib');
const Light = require('../src/lights');
const Matrix = require('../src/matrices');
const TestPattern = require('../src/patterns/test_patterns');
const Ray = require('../src/rays');
const Plane = require('../src/shapes/planes');
const Sphere = require('../src/shapes/spheres');
const { translation } = require('../src/transformations');
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

test('The reflected color for a nonreflective material', () => {
  let w = World.defaultWorld();
  let r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
  let shape = w.objects[1];
  shape.material.ambient = 1;
  let i = new Intersection(1, shape);

  let comps = i.prepareComputations(r);
  let color = w.reflectedColor(comps);

  expect(Color.areEqual(color, new Color(0, 0, 0))).toBeTruthy();
});

test('The reflected color for a reflective material', () => {
  let w = World.defaultWorld();
  let shape = new Plane();
  shape.material.reflective = 0.5;
  shape.transform = transformation.translation(0, -1, 0);
  w.objects.push(shape);
  let r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
  let i = new Intersection(Math.sqrt(2), shape);

  let comps = i.prepareComputations(r);
  let color = w.reflectedColor(comps);

  expect(Color.areEqual(color, new Color(0.19033, 0.23791, 0.14274))).toBeTruthy();
});

test('shadeHit() with a reflective material', () => {
  let w = World.defaultWorld();
  let shape = new Plane();
  shape.material.reflective = 0.5;
  shape.setTransform(transformation.translation(0, -1, 0));
  w.objects.push(shape);
  let r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
  let i = new Intersection(Math.sqrt(2), shape);

  let comps = i.prepareComputations(r);
  let color = w.shadeHit(comps);

  expect(Color.areEqual(color, new Color(0.87676, 0.92434, 0.82918))).toBeTruthy();
});

test('colorAt() with mutually reflective surfaces', () => {
  let w = new World();
  w.light = Light.pointLight(Tuple.point(0, 0, 0), new Color(1, 1, 1));
  let lower = new Plane();
  lower.material.reflective = 1;
  lower.setTransform(transformation.translation(0, -1, 0));
  w.objects.push(lower);
  let upper = new Plane();
  upper.material.reflective = 1;
  upper.setTransform(transformation.translation(0, 1, 0));
  w.objects.push(upper);
  let r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 1, 0));

  expect(w.colorAt(r)).not.toBeNull();
});

test('The reflected color at the maximum recursive depth', () => {
  let w = World.defaultWorld();
  let shape = new Plane();
  shape.material.reflective = 0.5;
  shape.setTransform(transformation.translation(0, -1, 0));
  w.objects.push(shape);
  let r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
  let i = new Intersection(Math.sqrt(2), shape);

  let comps = i.prepareComputations(r);
  let color = w.reflectedColor(comps, 0);

  expect(Color.areEqual(color, new Color(0, 0, 0))).toBeTruthy();
});

test('The refracted color with an opaque surface', () => {
  let w = World.defaultWorld();
  let shape = w.objects[0];
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let xs = Intersection.intersections(new Intersection(4, shape), new Intersection(6, shape));

  let comps = xs[0].prepareComputations(r, xs);
  let c = w.refractedColor(comps, 5);

  expect(Color.areEqual(c, new Color(0, 0, 0))).toBeTruthy();
});

test('The refracted color at the maximum recursive depth', () => {
  let w = World.defaultWorld();
  let shape = w.objects[0];
  shape.material.transparency = 1;
  shape.material.refractiveIndex = 1.5;
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
  let xs = Intersection.intersections(new Intersection(4, shape), new Intersection(6, shape));

  let comps = xs[0].prepareComputations(r, xs);
  let c = w.refractedColor(comps, 0);

  expect(Color.areEqual(c, new Color(0, 0, 0))).toBeTruthy();
});

test('The refracted color under total internal reflection', () => {
  let w = World.defaultWorld();
  let shape = w.objects[0];
  shape.material.transparency = 1;
  shape.material.refractiveIndex = 1.5;
  let r = new Ray(Tuple.point(0, 0, Math.sqrt(2) / 2), Tuple.vector(0, 1, 0));
  let xs = Intersection.intersections(new Intersection(-Math.sqrt(2) / 2, shape), new Intersection(Math.sqrt(2) / 2, shape));

  let comps = xs[1].prepareComputations(r, xs);
  let c = w.refractedColor(comps, 5);

  expect(Color.areEqual(c, new Color(0, 0, 0))).toBeTruthy();
});

test('The refracted color with a refracted ray', () => {
  let w = World.defaultWorld();
  let A = w.objects[0];
  A.material.ambient = 1;
  A.material.pattern = new TestPattern();
  let B = w.objects[1];
  B.material.transparency = 1;
  B.material.refractiveIndex = 1.5;
  let r = new Ray(Tuple.point(0, 0, 0.1), Tuple.vector(0, 1, 0));
  let xs = Intersection.intersections(new Intersection(-0.9899, A), 
    new Intersection(-0.4899, B), new Intersection(0.4899, B),
    new Intersection(0.9899, A));

  let comps = xs[2].prepareComputations(r, xs);
  let c = w.refractedColor(comps, 5);

  expect(Color.areEqual(c, new Color(0, 0.99888, 0.04722))).toBeTruthy();
});

test('shadeHit() with a transparent material', () => {
  let w = World.defaultWorld();
  let floor = new Plane();
  floor.transform = transformation.translation(0, -1, 0);
  floor.material.transparency = 0.5;
  floor.material.refractiveIndex = 1.5;
  w.objects.push(floor);
  let ball = new Sphere();
  ball.material.color = new Color(1, 0, 0);
  ball.material.ambient = 0.5;
  ball.transform = transformation.translation(0, -3.5, -0.5);
  w.objects.push(ball);
  let r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
  let xs = Intersection.intersections(new Intersection(Math.sqrt(2), floor));

  let comps = xs[0].prepareComputations(r, xs);
  let color = w.shadeHit(comps, 5);

  expect(Color.areEqual(color, new Color(0.93642, 0.68642, 0.68642))).toBeTruthy();
});

test('shadeHit() with a reflective, transparent material', () => {
  let w = World.defaultWorld();
  let r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
  let floor = new Plane();
  floor.transform = transformation.translation(0, -1, 0);
  floor.material.reflective = 0.5;
  floor.material.transparency = 0.5;
  floor.material.refractiveIndex = 1.5;
  w.objects.push(floor);
  let ball = new Sphere();
  ball.material.color = new Color(1, 0, 0);
  ball.material.ambient = 0.5;
  ball.transform = transformation.translation(0, -3.5, -0.5);
  w.objects.push(ball);
  let xs = Intersection.intersections(new Intersection(Math.sqrt(2), floor));

  let comps = xs[0].prepareComputations(r, xs);
  let color = w.shadeHit(comps, 5);

  expect(Color.areEqual(color, new Color(0.93391, 0.69643, 0.69243))).toBeTruthy();
});

test('There is no shadow when object is not set to cast shadow', () => {
  let w = new World();
  w.light = Light.pointLight(Tuple.point(0, 10, 0), new Color(1, 1, 1));
  let s = new Sphere();
  s.setTransform(translation(0, 3, 0));
  s.castsShadow = false;
  w.objects.push(s);
  let p = new Plane();
  w.objects.push(p);

  expect(w.isShadowed(Tuple.point(0, 0, 0))).toBeFalsy();
})