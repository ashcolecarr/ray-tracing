const BoundingBox = require('../src/bounds');
const Matrix = require('../src/matrices');
const Ray = require('../src/rays');
const Tuple = require('../src/tuples');
const { rotation } = require('../src/transformations');

test('The default material', () => {
  let box = new BoundingBox();

  expect(Tuple.areEqual(box.min, Tuple.point(Infinity, Infinity, Infinity))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(-Infinity, -Infinity, -Infinity))).toBeTruthy();
});

test('Creating a bounding box with volume', () => {
  let box = new BoundingBox(Tuple.point(-1, -2, -3), Tuple.point(3, 2, 1));

  expect(Tuple.areEqual(box.min, Tuple.point(-1, -2, -3))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(3, 2, 1))).toBeTruthy();
});

test('Adding points to an empty bounding box', () => {
  let box = new BoundingBox();
  let p1 = Tuple.point(-5, 2, 0);
  let p2 = Tuple.point(7, 0, -3);

  box.addPoint(p1);
  box.addPoint(p2);

  expect(Tuple.areEqual(box.min, Tuple.point(-5, 0, -3))).toBeTruthy();
  expect(Tuple.areEqual(box.max, Tuple.point(7, 2, 0))).toBeTruthy();
});

test('Adding one bounding box to another', () => {
  let box1 = new BoundingBox(Tuple.point(-5, -2, 0), Tuple.point(7, 4, 4));
  let box2 = new BoundingBox(Tuple.point(8, -7, -2), Tuple.point(14, 2, 8));
  
  box1.addBox(box2);

  expect(Tuple.areEqual(box1.min, Tuple.point(-5, -7, -2))).toBeTruthy();
  expect(Tuple.areEqual(box1.max, Tuple.point(14, 4, 8))).toBeTruthy();
});

test('Checking to see if a box contains a given point', () => {
  let box = new BoundingBox(Tuple.point(5, -2, 0), Tuple.point(11, 4, 7));
  let examples = [
    { 'point': Tuple.point(5, -2, 0), 'result': true },
    { 'point': Tuple.point(11, 4, 7), 'result': true },
    { 'point': Tuple.point(8, 1, 3), 'result': true },
    { 'point': Tuple.point(3, 0, 3), 'result': false },
    { 'point': Tuple.point(8, -4, 3), 'result': false },
    { 'point': Tuple.point(8, 1, -1), 'result': false },
    { 'point': Tuple.point(13, 1, 3), 'result': false },
    { 'point': Tuple.point(8, 5, 3), 'result': false },
    { 'point': Tuple.point(8, 1, 8), 'result': false }
  ];

  for (example of examples) {
    let p = example.point;

    let result = box.containsPoint(p);

    expect(result).toBe(example.result);
  }
});

test('Checking to see if a box contains a given box', () => {
  let box1 = new BoundingBox(Tuple.point(5, -2, 0), Tuple.point(11, 4, 7));
  let examples = [
    { 'min': Tuple.point(5, -2, 0), 'max': Tuple.point(11, 4, 7), 'result': true },
    { 'min': Tuple.point(6, -1, 1), 'max': Tuple.point(10, 3, 6), 'result': true },
    { 'min': Tuple.point(4, -3, -1), 'max': Tuple.point(10, 3, 6), 'result': false },
    { 'min': Tuple.point(6, -1, 1), 'max': Tuple.point(12, 5, 8), 'result': false }
  ];
  
  for (example of examples) {
    let box2 = new BoundingBox(example.min, example.max);

    let result = box1.containsBox(box2);

    expect(result).toBe(example.result);
  }
});

test('Transforming a bounding box', () => {
  let box1 = new BoundingBox(Tuple.point(-1, -1, -1), Tuple.point(1, 1, 1));
  let matrix = Matrix.multiply(rotation(Math.PI / 4, Axis.X), rotation(Math.PI / 4, Axis.Y));
  
  let box2 = BoundingBox.transform(box1, matrix);

  expect(Tuple.areEqual(box2.min, Tuple.point(-1.41421, -1.7071, -1.7071))).toBeTruthy();
  expect(Tuple.areEqual(box2.max, Tuple.point(1.41421, 1.7071, 1.7071))).toBeTruthy();
});

test('Intersecting a ray with a bounding box at the origin', () => {
  let box = new BoundingBox(Tuple.point(-1, -1, -1), Tuple.point(1, 1, 1));
  let examples = [
    { 'origin': Tuple.point(5, 0.5, 0), 'direction': Tuple.vector(-1, 0, 0), 'result': true },
    { 'origin': Tuple.point(-5, 0.5, 0), 'direction': Tuple.vector(1, 0, 0), 'result': true },
    { 'origin': Tuple.point(0.5, 5, 0), 'direction': Tuple.vector(0, -1, 0), 'result': true },
    { 'origin': Tuple.point(0.5, -5, 0), 'direction': Tuple.vector(0, 1, 0), 'result': true },
    { 'origin': Tuple.point(0.5, 0, 5), 'direction': Tuple.vector(0, 0, -1), 'result': true },
    { 'origin': Tuple.point(0.5, 0, -5), 'direction': Tuple.vector(0, 0, 1), 'result': true },
    { 'origin': Tuple.point(0, 0.5, 0), 'direction': Tuple.vector(0, 0, 1), 'result': true },
    { 'origin': Tuple.point(-2, 0, 0), 'direction': Tuple.vector(2, 4, 6), 'result': false },
    { 'origin': Tuple.point(0, -2, 0), 'direction': Tuple.vector(6, 2, 4), 'result': false },
    { 'origin': Tuple.point(0, 0, -2), 'direction': Tuple.vector(4, 6, 2), 'result': false },
    { 'origin': Tuple.point(2, 0, 2), 'direction': Tuple.vector(0, 0, -1), 'result': false },
    { 'origin': Tuple.point(0, 2, 2), 'direction': Tuple.vector(0, -1, 0), 'result': false },
    { 'origin': Tuple.point(2, 2, 0), 'direction': Tuple.vector(-1, 0, 0), 'result': false },
  ];

  for (example of examples) {
    let direction = example.direction.normalize();
    let r = new Ray(example.origin, direction);

    let result = box.intersects(r);

    expect(result).toBe(example.result);
  }
});

test('Intersecting a ray with a non-cubic bounding box', () => {
  let box = new BoundingBox(Tuple.point(5, -2, 0), Tuple.point(11, 4, 7));
  let examples = [
    { 'origin': Tuple.point(15, 1, 2), 'direction': Tuple.vector(-1, 0, 0), 'result': true },
    { 'origin': Tuple.point(-5, -1, 4), 'direction': Tuple.vector(1, 0, 0), 'result': true },
    { 'origin': Tuple.point(7, 6, 5), 'direction': Tuple.vector(0, -1, 0), 'result': true },
    { 'origin': Tuple.point(9, -5, 6), 'direction': Tuple.vector(0, 1, 0), 'result': true },
    { 'origin': Tuple.point(8, 2, 12), 'direction': Tuple.vector(0, 0, -1), 'result': true },
    { 'origin': Tuple.point(6, 0, -5), 'direction': Tuple.vector(0, 0, 1), 'result': true },
    { 'origin': Tuple.point(8, 1, 3.5), 'direction': Tuple.vector(0, 0, 1), 'result': true },
    { 'origin': Tuple.point(9, -1, -8), 'direction': Tuple.vector(2, 4, 6), 'result': false },
    { 'origin': Tuple.point(8, 3, -4), 'direction': Tuple.vector(6, 2, 4), 'result': false },
    { 'origin': Tuple.point(9, -1, -2), 'direction': Tuple.vector(4, 6, 2), 'result': false },
    { 'origin': Tuple.point(4, 0, 9), 'direction': Tuple.vector(0, 0, -1), 'result': false },
    { 'origin': Tuple.point(8, 6, -1), 'direction': Tuple.vector(0, -1, 0), 'result': false },
    { 'origin': Tuple.point(12, 5, 4), 'direction': Tuple.vector(-1, 0, 0), 'result': false }
  ];

  for (example of examples) {
    let direction = example.direction.normalize();
    let r = new Ray(example.origin, direction);

    let result = box.intersects(r);

    expect(result).toBe(example.result);
  }
});

test('Splitting a perfect cube', () => {
  let box = new BoundingBox(Tuple.point(-1, -4, -5), Tuple.point(9, 6, 5));

  let [left, right] = box.splitBounds();

  expect(Tuple.areEqual(left.min, Tuple.point(-1, -4, -5))).toBeTruthy();
  expect(Tuple.areEqual(left.max, Tuple.point(4, 6, 5))).toBeTruthy();
  expect(Tuple.areEqual(right.min, Tuple.point(4, -4, -5))).toBeTruthy();
  expect(Tuple.areEqual(right.max, Tuple.point(9, 6, 5))).toBeTruthy();
});

test('Splitting an x-wide box', () => {
  let box = new BoundingBox(Tuple.point(-1, -2, -3), Tuple.point(9, 5.5, 3));

  let [left, right] = box.splitBounds();

  expect(Tuple.areEqual(left.min, Tuple.point(-1, -2, -3))).toBeTruthy();
  expect(Tuple.areEqual(left.max, Tuple.point(4, 5.5, 3))).toBeTruthy();
  expect(Tuple.areEqual(right.min, Tuple.point(4, -2, -3))).toBeTruthy();
  expect(Tuple.areEqual(right.max, Tuple.point(9, 5.5, 3))).toBeTruthy();
});

test('Splitting a y-wide box', () => {
  let box = new BoundingBox(Tuple.point(-1, -2, -3), Tuple.point(5, 8, 3));

  let [left, right] = box.splitBounds();

  expect(Tuple.areEqual(left.min, Tuple.point(-1, -2, -3))).toBeTruthy();
  expect(Tuple.areEqual(left.max, Tuple.point(5, 3, 3))).toBeTruthy();
  expect(Tuple.areEqual(right.min, Tuple.point(-1, 3, -3))).toBeTruthy();
  expect(Tuple.areEqual(right.max, Tuple.point(5, 8, 3))).toBeTruthy();
});

test('Splitting a z-wide box', () => {
  let box = new BoundingBox(Tuple.point(-1, -2, -3), Tuple.point(5, 3, 7));

  let [left, right] = box.splitBounds();

  expect(Tuple.areEqual(left.min, Tuple.point(-1, -2, -3))).toBeTruthy();
  expect(Tuple.areEqual(left.max, Tuple.point(5, 3, 2))).toBeTruthy();
  expect(Tuple.areEqual(right.min, Tuple.point(-1, -2, 2))).toBeTruthy();
  expect(Tuple.areEqual(right.max, Tuple.point(5, 3, 7))).toBeTruthy();
});