const { TestScheduler } = require('jest');
const AreaLight = require('../src/lights/area_lights');
const Color = require('../src/colors');
const PointLight = require('../src/lights/point_lights');
const Sequence = require('../src/sequences');
const Tuple = require('../src/tuples');
const World = require('../src/world');

test('A point light has a position and intensity', () => {
  let intensity = new Color(1, 1, 1);
  let position = Tuple.point(0, 0, 0);

  let light = new PointLight(position, intensity);

  expect(Tuple.areEqual(light.position, position)).toBeTruthy();
  expect(Color.areEqual(light.intensity, intensity)).toBeTruthy();
});

test('Point lights evaulate the light intensity at a given point', () => {
  let w = World.defaultWorld();
  let light = w.lights[0];
  let examples = [
    { 'point': Tuple.point(0, 1.0001, 0), 'result': 1 },
    { 'point': Tuple.point(-1.0001, 0, 0), 'result': 1 },
    { 'point': Tuple.point(0, 0, -1.0001), 'result': 1 },
    { 'point': Tuple.point(0, 0, 1.0001), 'result': 0 },
    { 'point': Tuple.point(1.0001, 0, 0), 'result': 0 },
    { 'point': Tuple.point(0, -1.0001, 0), 'result': 0 },
    { 'point': Tuple.point(0, 0, 0), 'result': 0 }
  ];

  for (example of examples) {
    let pt = example.point;
    let intensity = light.intensityAt(pt, w);

    expect(intensity).toBeCloseTo(example.result);
  }
});

test('Creating an area light', () => {
  let corner = Tuple.point(0, 0, 0);
  let v1 = Tuple.vector(2, 0, 0);
  let v2 = Tuple.vector(0, 0, 1);

  let light = new AreaLight(corner, v1, 4, v2, 2, new Color(1, 1, 1));
  
  expect(Tuple.areEqual(light.corner, corner)).toBeTruthy();
  expect(Tuple.areEqual(light.uVec, Tuple.vector(0.5, 0, 0))).toBeTruthy();
  expect(light.uSteps).toBe(4);
  expect(Tuple.areEqual(light.vVec, Tuple.vector(0, 0, 0.5))).toBeTruthy();
  expect(light.vSteps).toBe(2);
  expect(light.samples).toBe(8);
  expect(Tuple.areEqual(light.position, Tuple.point(1, 0, 0.5))).toBeTruthy();
});

test('Finding a single point on an area light', () => {
  let corner = Tuple.point(0, 0, 0);
  let v1 = Tuple.vector(2, 0, 0);
  let v2 = Tuple.vector(0, 0, 1);
  let examples = [
    { 'u': 0, 'v': 0, 'result': Tuple.point(0.25, 0, 0.25) },
    { 'u': 1, 'v': 0, 'result': Tuple.point(0.75, 0, 0.25) },
    { 'u': 0, 'v': 1, 'result': Tuple.point(0.25, 0, 0.75) },
    { 'u': 2, 'v': 0, 'result': Tuple.point(1.25, 0, 0.25) },
    { 'u': 3, 'v': 1, 'result': Tuple.point(1.75, 0, 0.75) }
  ];
  let light = new AreaLight(corner, v1, 4, v2, 2, new Color(1, 1, 1));
  light.jitterBy = new Sequence(0.5);

  for (example of examples) {
    let pt = light.pointOnLight(example.u, example.v);

    expect(Tuple.areEqual(pt, example.result)).toBeTruthy();
  }
});

test('The area light intensity function', () => {
  let w = World.defaultWorld();
  let corner = Tuple.point(-0.5, -0.5, -5);
  let v1 = Tuple.vector(1, 0, 0);
  let v2 = Tuple.vector(0, 1, 0);
  let light = new AreaLight(corner, v1, 2, v2, 2, new Color(1, 1, 1));
  light.jitterBy = new Sequence(0.5);
  let examples = [
    { 'point': Tuple.point(0, 0, 2), 'result': 0 },
    { 'point': Tuple.point(1, -1, 2), 'result': 0.25 },
    { 'point': Tuple.point(1.5, 0, 2), 'result': 0.5 },
    { 'point': Tuple.point(1.25, 1.25, 3), 'result': 0.75 },
    { 'point': Tuple.point(0, 0, -2), 'result': 1 }
  ];

  for (example of examples) {
    let intensity = light.intensityAt(example.point, w);

    expect(intensity).toBeCloseTo(example.result);
  }
});

test('Finding a single point on a jittered area light', () => {
  let corner = Tuple.point(0, 0, 0);
  let v1 = Tuple.vector(2, 0, 0);
  let v2 = Tuple.vector(0, 0, 1);
  let light = new AreaLight(corner, v1, 4, v2, 2, new Color(1, 1, 1));
  light.jitterBy = new Sequence(0.3, 0.7);
  let examples = [
    { 'u': 0, 'v': 0, 'result': Tuple.point(0.15, 0, 0.35) },
    { 'u': 1, 'v': 0, 'result': Tuple.point(0.65, 0, 0.35) },
    { 'u': 0, 'v': 1, 'result': Tuple.point(0.15, 0, 0.85) },
    { 'u': 2, 'v': 0, 'result': Tuple.point(1.15, 0, 0.35) },
    { 'u': 3, 'v': 1, 'result': Tuple.point(1.65, 0, 0.85) }
  ];

  for (example of examples) {
    let pt = light.pointOnLight(example.u, example.v);

    expect(Tuple.areEqual(pt, example.result)).toBeTruthy();
  }
});

test('The area light with jittered samples', () => {
  let w = World.defaultWorld();
  let corner = Tuple.point(-0.5, -0.5, -5);
  let v1 = Tuple.vector(1, 0, 0);
  let v2 = Tuple.vector(0, 1, 0);
  let examples = [
    { 'point': Tuple.point(0, 0, 2), 'result': 0 },
    { 'point': Tuple.point(1, -1, 2), 'result': 0.5 },
    { 'point': Tuple.point(1.5, 0, 2), 'result': 0.75 },
    { 'point': Tuple.point(1.25, 1.25, 3), 'result': 0.75 },
    { 'point': Tuple.point(0, 0, -2), 'result': 1 }
  ];

  for (example of examples) {
    let light = new AreaLight(corner, v1, 2, v2, 2, new Color(1, 1, 1));
    light.jitterBy = new Sequence(0.7, 0.3, 0.9, 0.1, 0.5);

    let intensity = light.intensityAt(example.point, w);

    expect(intensity).toBeCloseTo(example.result);
  }
});