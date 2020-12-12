const { TestScheduler } = require('jest');
const Ray = require('../src/rays');
const transformation = require('../src/transformations');
const Tuple = require('../src/tuples');

test('Creating and querying a ray', () => {
  let origin = Tuple.point(1, 2, 3);
  let direction = Tuple.vector(4, 5, 6);

  let r = new Ray(origin, direction);

  expect(Tuple.areEqual(origin, r.origin)).toBeTruthy();
  expect(Tuple.areEqual(direction, r.direction)).toBeTruthy();
});

test('Computing a point from a distance', () => {
  let r = new Ray(Tuple.point(2, 3, 4), Tuple.vector(1, 0, 0));

  let expected1 = Tuple.point(2, 3, 4);
  let expected2 = Tuple.point(3, 3, 4);
  let expected3 = Tuple.point(1, 3, 4);
  let expected4 = Tuple.point(4.5, 3, 4);

  let actual1 = r.position(0);
  let actual2 = r.position(1);
  let actual3 = r.position(-1);
  let actual4 = r.position(2.5);

  expect(Tuple.areEqual(expected1, actual1)).toBeTruthy();
  expect(Tuple.areEqual(expected2, actual2)).toBeTruthy();
  expect(Tuple.areEqual(expected3, actual3)).toBeTruthy();
  expect(Tuple.areEqual(expected4, actual4)).toBeTruthy();
});

test('Translating a ray', () => {
  let r = new Ray(Tuple.point(1, 2, 3), Tuple.vector(0, 1, 0));
  let m = transformation.translation(3, 4, 5);

  let r2 = r.transform(m);

  let expected1 = Tuple.point(4, 6, 8);
  let expected2 = Tuple.vector(0, 1, 0);

  expect(Tuple.areEqual(expected1, r2.origin)).toBeTruthy();
  expect(Tuple.areEqual(expected2, r2.direction)).toBeTruthy();
});

test('Scaling a ray', () => {
  let r = new Ray(Tuple.point(1, 2, 3), Tuple.vector(0, 1, 0));
  let m = transformation.scaling(2, 3, 4);

  let r2 = r.transform(m);

  let expected1 = Tuple.point(2, 6, 12);
  let expected2 = Tuple.vector(0, 3, 0);

  expect(Tuple.areEqual(expected1, r2.origin)).toBeTruthy();
  expect(Tuple.areEqual(expected2, r2.direction)).toBeTruthy();
});