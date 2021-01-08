const { TestScheduler } = require('jest');
const AreaLight = require('../src/lights/area_lights');
const Color = require('../src/colors');
const lib = require('../src/lib');
const PointLight = require('../src/lights/point_lights');
const Material = require('../src/materials');
const Matrix = require('../src/matrices');
const Sphere = require('../src/shapes/spheres');
const StripedPattern = require('../src/patterns/striped_patterns');
const TestPattern = require('../src/patterns/test_patterns');
const Tuple = require('../src/tuples');
const World = require('../src/world');
const Sequence = require('../src/sequences');

test('The default material', () => {
  let m = new Material();

  expect(Color.areEqual(m.color, new Color(1, 1, 1))).toBeTruthy();
  expect(m.ambient).toBeCloseTo(0.1, lib.PRECISION);
  expect(m.diffuse).toBeCloseTo(0.9, lib.PRECISION);
  expect(m.specular).toBeCloseTo(0.9, lib.PRECISION);
  expect(m.shininess).toBeCloseTo(200, lib.PRECISION);
});

test('Lighting with the eye between the light and the surface', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = new PointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, 1);

  expect(Color.areEqual(result, new Color(1.9, 1.9, 1.9))).toBeTruthy();
});

test('Lighting with the eye between the light and surface, eye offset 45 degrees', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  let normalV = Tuple.vector(0, 0, -1);
  let light = new PointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, 1);

  expect(Color.areEqual(result, new Color(1.0, 1.0, 1.0))).toBeTruthy();
});

test('Lighting with the eye opposite surface, light offset 45 degrees', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = new PointLight(Tuple.point(0, 10, -10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, 1);

  expect(Color.areEqual(result, new Color(0.7364, 0.7364, 0.7364))).toBeTruthy();
});

test('Lighting with the eye in the path of the reflection vector', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  let normalV = Tuple.vector(0, 0, -1);
  let light = new PointLight(Tuple.point(0, 10, -10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, 1);

  expect(Color.areEqual(result, new Color(1.6364, 1.6364, 1.6364))).toBeTruthy();
});

test('Lighting with the light behind the surface', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = new PointLight(Tuple.point(0, 0, 10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, 1);

  expect(Color.areEqual(result, new Color(0.1, 0.1, 0.1))).toBeTruthy();
});

test('Lighting with the surface in shadow', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = new PointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));
  let intensity = 0;

  let result = m.lighting(s, light, position, eyeV, normalV, intensity);

  expect(Color.areEqual(result, new Color(0.1, 0.1, 0.1))).toBeTruthy();
});

test('Lighting with a pattern applied', () => {
  let s = new Sphere();
  let m = new Material();
  m.pattern = new StripedPattern(new Color(1, 1, 1), new Color(0, 0 ,0));
  m.ambient = 1;
  m.diffuse = 0;
  m.specular = 0;
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = new PointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));

  let c1 = m.lighting(s, light, Tuple.point(0.9, 0, 0), eyeV, normalV, 1);
  let c2 = m.lighting(s, light, Tuple.point(1.1, 0, 0), eyeV, normalV, 1);

  expect(Color.areEqual(c1, new Color(1, 1, 1))).toBeTruthy();
  expect(Color.areEqual(c2, new Color(0, 0, 0))).toBeTruthy();
});

test('Reflectivity for the default material', () => {
  let m = new Material();

  expect(m.reflective).toBeCloseTo(0.0, lib.PRECISION);
});

test('Transparency and Refractive Index for the default material', () => {
  let m = new Material();

  expect(m.transparency).toBeCloseTo(0.0, lib.PRECISION);
  expect(m.refractiveIndex).toBeCloseTo(1.0, lib.PRECISION);
});

test('Chained functions set properties accordingly', () => {
  let c = new Color(0.5, 0.5, 0.5);
  let p = new TestPattern(new Color(1, 1, 1), new Color(0, 0, 0));

  let m = new Material().withColor(c).withAmbient(0.5).withDiffuse(0.5)
    .withSpecular(0.5).withShininess(0.5).withPattern(p).withReflective(0.5)
    .withTransparency(0.5).withRefractiveIndex(0.5);

  expect(Color.areEqual(m.color, c)).toBeTruthy();
  expect(m.ambient).toBeCloseTo(0.5, lib.PRECISION);
  expect(m.diffuse).toBeCloseTo(0.5, lib.PRECISION);
  expect(m.specular).toBeCloseTo(0.5, lib.PRECISION);
  expect(m.shininess).toBeCloseTo(0.5, lib.PRECISION);
  expect(Color.areEqual(m.pattern.a, new Color(1, 1, 1))).toBeTruthy();
  expect(Color.areEqual(m.pattern.b, new Color(0, 0, 0))).toBeTruthy();
  expect(Matrix.areEqual(m.pattern.transform, Matrix.identity(4))).toBeTruthy();
  expect(m.reflective).toBeCloseTo(0.5, lib.PRECISION);
  expect(m.transparency).toBeCloseTo(0.5, lib.PRECISION);
  expect(m.refractiveIndex).toBeCloseTo(0.5, lib.PRECISION);
});

test('lighting() uses light intensity to attenuate color', () => {
  let w = World.defaultWorld();
  w.lights[0] = new PointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));
  let shape = w.objects[0];
  shape.material.ambient = 0.1;
  shape.material.diffuse = 0.9;
  shape.material.specular = 0;
  shape.material.color = new Color(1, 1, 1);
  let pt = Tuple.point(0, 0, -1);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let examples = [
    { 'intensity': 1, 'result': new Color(1, 1, 1) },
    { 'intensity': 0.5, 'result': new Color(0.55, 0.55, 0.55) },
    { 'intensity': 0, 'result': new Color(0.1, 0.1, 0.1) }
  ];

  for (example of examples) {
    let result = shape.material.lighting(shape, w.lights[0], pt, eyeV, normalV, example.intensity);

    expect(Color.areEqual(result, example.result)).toBeTruthy();
  }
});

test('lighting() samples the area light', () => {
  let corner = Tuple.point(-0.5, -0.5, -5);
  let v1 = Tuple.vector(1, 0, 0);
  let v2 = Tuple.vector(0, 1, 0);
  let light = new AreaLight(corner, v1, 2, v2, 2, new Color(1, 1, 1));
  light.jitterBy = new Sequence(0.5);
  let shape = new Sphere();
  shape.material.ambient = 0.1;
  shape.material.diffuse = 0.9;
  shape.material.specular = 0;
  shape.material.color = new Color(1, 1, 1);
  let eye = Tuple.point(0, 0, -5);
  let examples = [
    { 'point': Tuple.point(0, 0, -1), 'result': new Color(0.9965, 0.9965, 0.9965) },
    { 'point': Tuple.point(0, 0.7071, -0.7071), 'result': new Color(0.62318, 0.62318, 0.62318) }
  ];

  for (example of examples) {
    let pt = example.point;
    let eyeV = Tuple.subtract(eye, pt).normalize();
    let normalV = Tuple.vector(pt.x, pt.y, pt.z);

    let result = shape.material.lighting(shape, light, pt, eyeV, normalV, 1);

    expect(Color.areEqual(result, example.result)).toBeTruthy();
  }
});