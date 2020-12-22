const { TestScheduler } = require('jest');
const CheckersPattern = require('../src/patterns/checkers_patterns');
const Color = require('../src/colors');
const GradientPattern = require('../src/patterns/gradient_patterns');
const Matrix = require('../src/matrices');
const RingPattern = require('../src/patterns/ring_patterns');
const Sphere = require('../src/shapes/spheres');
const StripedPattern = require('../src/patterns/striped_patterns');
const TestPattern = require('../src/patterns/test_patterns');
const Tuple = require('../src/tuples');
const { scaling, translation } = require('../src/transformations');

const WHITE = new Color(1, 1, 1);
const BLACK = new Color(0, 0, 0);

test('Creating a stripe pattern', () => {
  let pattern = new StripedPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.a, WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.b, BLACK)).toBeTruthy();
});

test('A stripe pattern is constant in y', () => {
  let pattern = new StripedPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 1, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 2, 0)), WHITE)).toBeTruthy();
});

test('A stripe pattern is constant in z', () => {
  let pattern = new StripedPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 1)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 2)), WHITE)).toBeTruthy();
});

test('A stripe pattern alternates in x', () => {
  let pattern = new StripedPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0.9, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(1, 0, 0)), BLACK)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(-0.1, 0, 0)), BLACK)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(-1, 0, 0)), BLACK)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(-1.1, 0, 0)), WHITE)).toBeTruthy();
});

test('The default pattern transformation', () => {
  let pattern = new TestPattern();

  expect(Matrix.areEqual(pattern.transform, Matrix.identity(4))).toBeTruthy();
});

test('Assigning a transformation', () => {
  let pattern = new TestPattern();
  pattern.setPatternTransform(translation(1, 2, 3));

  expect(Matrix.areEqual(pattern.transform, translation(1, 2, 3))).toBeTruthy();
});

test('A pattern with an object transformation', () => {
  let shape = new Sphere();
  shape.setTransform(scaling(2, 2, 2));
  let pattern = new TestPattern(WHITE, BLACK);

  let c = pattern.patternAtShape(shape, Tuple.point(2, 3, 4));

  expect(Color.areEqual(c, new Color(1, 1.5, 2))).toBeTruthy();
});

test('A pattern with a pattern transformation', () => {
  let shape = new Sphere();
  let pattern = new TestPattern(WHITE, BLACK);
  pattern.setPatternTransform(scaling(2, 2, 2));

  let c = pattern.patternAtShape(shape, Tuple.point(2, 3, 4));

  expect(Color.areEqual(c, new Color(1, 1.5, 2))).toBeTruthy();
});

test('A pattern with both an object and a pattern transformation', () => {
  let shape = new Sphere();
  shape.setTransform(scaling(2, 2, 2));
  let pattern = new TestPattern(WHITE, BLACK);
  pattern.setPatternTransform(translation(0.5, 1, 1.5));

  let c = pattern.patternAtShape(shape, Tuple.point(2.5, 3, 3.5));

  expect(Color.areEqual(c, new Color(0.75, 0.5, 0.25))).toBeTruthy();
});

test('A gradient linearly interpolates between colors', () => {
  let pattern = new GradientPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0.25, 0, 0)), new Color(0.75, 0.75, 0.75))).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0.5, 0, 0)), new Color(0.5, 0.5, 0.5))).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0.75, 0, 0)), new Color(0.25, 0.25, 0.25))).toBeTruthy();
});

test('A ring should extend in both x and z', () => {
  let pattern = new RingPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(1, 0, 0)), BLACK)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 1)), BLACK)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0.708, 0, 0.708)), BLACK)).toBeTruthy();
});

test('Checkers should repeat in x', () => {
  let pattern = new CheckersPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0.99, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(1.01, 0, 0)), BLACK)).toBeTruthy();
});

test('Checkers should repeat in y', () => {
  let pattern = new CheckersPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0.99, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 1.01, 0)), BLACK)).toBeTruthy();
});

test('Checkers should repeat in z', () => {
  let pattern = new CheckersPattern(WHITE, BLACK);

  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 0.99)), WHITE)).toBeTruthy();
  expect(Color.areEqual(pattern.patternAt(Tuple.point(0, 0, 1.01)), BLACK)).toBeTruthy();
});