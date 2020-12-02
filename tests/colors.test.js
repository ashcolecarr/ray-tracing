const { TestScheduler } = require('jest');
const Color = require('../src/colors');
const lib = require('../src/lib');

test('Colors are (red, green, blue) tuples', () => {
  let c = new Color(-0.5, 0.4, 1.7);

  expect(c.red).toBeCloseTo(-0.5, lib.PRECISION);
  expect(c.green).toBeCloseTo(0.4, lib.PRECISION);
  expect(c.blue).toBeCloseTo(1.7, lib.PRECISION);
});

test('Adding colors', () => {
  let c1 = new Color(0.9, 0.6, 0.75);
  let c2 = new Color(0.7, 0.1, 0.25);

  let actual = Color.add(c1, c2);

  expect(actual.red).toBeCloseTo(1.6, lib.PRECISION);
  expect(actual.green).toBeCloseTo(0.7, lib.PRECISION);
  expect(actual.blue).toBeCloseTo(1.0, lib.PRECISION);
});

test('Subtracting colors', () => {
  let c1 = new Color(0.9, 0.6, 0.75);
  let c2 = new Color(0.7, 0.1, 0.25);

  let actual = Color.subtract(c1, c2);

  expect(actual.red).toBeCloseTo(0.2, lib.PRECISION);
  expect(actual.green).toBeCloseTo(0.5, lib.PRECISION);
  expect(actual.blue).toBeCloseTo(0.5, lib.PRECISION);
});

test('Multiplying a color by a scalar', () => {
  let c = new Color(0.2, 0.3, 0.4);

  let actual = Color.multiply(c, 2);

  expect(actual.red).toBeCloseTo(0.4, lib.PRECISION);
  expect(actual.green).toBeCloseTo(0.6, lib.PRECISION);
  expect(actual.blue).toBeCloseTo(0.8, lib.PRECISION);
});

test('Multiplying colors', () => {
  let c1 = new Color(1, 0.2, 0.4);
  let c2 = new Color(0.9, 1, 0.1);

  let actual = Color.multiply(c1, c2);

  expect(actual.red).toBeCloseTo(0.9, lib.PRECISION);
  expect(actual.green).toBeCloseTo(0.2, lib.PRECISION);
  expect(actual.blue).toBeCloseTo(0.04, lib.PRECISION);
});