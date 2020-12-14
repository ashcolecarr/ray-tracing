const { TestScheduler } = require('jest');
const Color = require('../src/colors');
const lib = require('../src/lib');
const Light = require('../src/lights');
const Material = require('../src/materials');
const Tuple = require('../src/tuples');

test('The default material', () => {
  let m = new Material();

  expect(Color.areEqual(m.color, new Color(1, 1, 1))).toBeTruthy();
  expect(m.ambient).toBeCloseTo(0.1, lib.PRECISION);
  expect(m.diffuse).toBeCloseTo(0.9, lib.PRECISION);
  expect(m.specular).toBeCloseTo(0.9, lib.PRECISION);
  expect(m.shininess).toBeCloseTo(200, lib.PRECISION);
});

test('Lighting with the eye between the light and the surface', () => {
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));

  let result = m.lighting(light, position, eyeV, normalV);

  expect(Color.areEqual(result, new Color(1.9, 1.9, 1.9))).toBeTruthy();
});

test('Lighting with the eye between the light and surface, eye offset 45 degrees', () => {
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 0, -10), new Color(1, 1, 1));

  let result = m.lighting(light, position, eyeV, normalV);

  expect(Color.areEqual(result, new Color(1.0, 1.0, 1.0))).toBeTruthy();
});

test('Lighting with the eye opposite surface, light offset 45 degrees', () => {
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 10, -10), new Color(1, 1, 1));

  let result = m.lighting(light, position, eyeV, normalV);

  expect(Color.areEqual(result, new Color(0.7364, 0.7364, 0.7364))).toBeTruthy();
});

test('Lighting with the eye in the path of the reflection vector', () => {
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 10, -10), new Color(1, 1, 1));

  let result = m.lighting(light, position, eyeV, normalV);

  expect(Color.areEqual(result, new Color(1.6364, 1.6364, 1.6364))).toBeTruthy();
});

test('Lighting with the light behind the surface', () => {
  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  let eyeV = Tuple.vector(0, 0, -1);
  let normalV = Tuple.vector(0, 0, -1);
  let light = Light.pointLight(Tuple.point(0, 0, 10), new Color(1, 1, 1));

  let result = m.lighting(light, position, eyeV, normalV);

  expect(Color.areEqual(result, new Color(0.1, 0.1, 0.1))).toBeTruthy();
});