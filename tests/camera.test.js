const { TestScheduler } = require('jest');
const Camera = require('../src/camera');
const Color = require('../src/colors');
const lib = require('../src/lib');
const Matrix = require('../src/matrices');
const transformation = require('../src/transformations');
const Tuple = require('../src/tuples');
const World = require('../src/world');

test('Constructing a camera', () => {
  let hSize = 160;
  let vSize = 120;
  let fieldOfView = Math.PI / 2;

  let c = new Camera(hSize, vSize, fieldOfView);

  expect(c.hSize).toBe(160);
  expect(c.vSize).toBe(120);
  expect(c.fieldOfView).toBeCloseTo(Math.PI / 2, lib.PRECISION);
  expect(Matrix.areEqual(c.transform, Matrix.identity(4))).toBeTruthy();
});

test('The pixel size for a horizontal canvas', () => {
  let c = new Camera(200, 125, Math.PI / 2);

  expect(c.pixelSize).toBeCloseTo(0.01);
});

test('The pixel size for a vertical canvas', () => {
  let c = new Camera(125, 200, Math.PI / 2);

  expect(c.pixelSize).toBeCloseTo(0.01);
});

test('Constructing a ray through the center of the canvas', () => {
  let c = new Camera(201, 101, Math.PI / 2);
  let r = c.rayForPixel(100, 50);

  expect(Tuple.areEqual(r.origin, Tuple.point(0, 0, 0))).toBeTruthy();
  expect(Tuple.areEqual(r.direction, Tuple.vector(0, 0, -1))).toBeTruthy();
});

test('Constructing a ray through a corner of the canvas', () => {
  let c = new Camera(201, 101, Math.PI / 2);
  let r = c.rayForPixel(0, 0);

  expect(Tuple.areEqual(r.origin, Tuple.point(0, 0, 0))).toBeTruthy();
  expect(Tuple.areEqual(r.direction, Tuple.vector(0.66519, 0.33259, -0.66851))).toBeTruthy();
});

test('Constructing a ray when the camera is transformed', () => {
  let c = new Camera(201, 101, Math.PI / 2);
  c.transform = Matrix.multiply(transformation.rotation(Math.PI / 4, transformation.Axis.Y),
    transformation.translation(0, -2, 5));
  let r = c.rayForPixel(100, 50);

  expect(Tuple.areEqual(r.origin, Tuple.point(0, 2, -5))).toBeTruthy();
  expect(Tuple.areEqual(r.direction, Tuple.vector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2))).toBeTruthy();
});

test('Rendering a world with a camera', () => {
  let w = World.defaultWorld();
  let c = new Camera(11, 11, Math.PI / 2);
  let from = Tuple.point(0, 0, -5);
  let to = Tuple.point(0, 0, 0);
  let up = Tuple.vector(0, 1, 0);
  c.transform = transformation.viewTransform(from, to, up);

  let image = c.render(w);

  expect(Color.areEqual(image.pixelAt(5, 5), new Color(0.38066, 0.47583, 0.2855)));
});