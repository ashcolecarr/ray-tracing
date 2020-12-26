const { TestScheduler } = require('jest');
const Color = require('../src/colors');
const lib = require('../src/lib');
const Light = require('../src/lights');
const Material = require('../src/materials');
const Sphere = require('../src/shapes/spheres');
const StripedPattern = require('../src/patterns/striped_patterns');
const Tuple = require('../src/tuples');
const TestPattern = require('../src/patterns/test_patterns');
const Matrix = require('../src/matrices');

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
  let light = Light.pointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, false);

  expect(Color.areEqual(result, new Color(1.9, 1.9, 1.9))).toBeTruthy();
});

test('Lighting with the eye between the light and surface, eye offset 45 degrees', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, false);

  expect(Color.areEqual(result, new Color(1.0, 1.0, 1.0))).toBeTruthy();
});

test('Lighting with the eye opposite surface, light offset 45 degrees', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 10, -10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, false);

  expect(Color.areEqual(result, new Color(0.7364, 0.7364, 0.7364))).toBeTruthy();
});

test('Lighting with the eye in the path of the reflection vector', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 10, -10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, false);

  expect(Color.areEqual(result, new Color(1.6364, 1.6364, 1.6364))).toBeTruthy();
});

test('Lighting with the light behind the surface', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 0, 10), new Color(1, 1, 1));

  let result = m.lighting(s, light, position, eyeV, normalV, false);

  expect(Color.areEqual(result, new Color(0.1, 0.1, 0.1))).toBeTruthy();
});

test('Lighting with the surface in shadow', () => {
  let s = new Sphere();
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));
  let inShadow = true;

  let result = m.lighting(s, light, position, eyeV, normalV, inShadow);

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
  let light = Light.pointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));

  let c1 = m.lighting(s, light, Tuple.point(0.9, 0, 0), eyeV, normalV, false);
  let c2 = m.lighting(s, light, Tuple.point(1.1, 0, 0), eyeV, normalV, false);

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
})