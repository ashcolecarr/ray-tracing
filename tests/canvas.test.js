const { TestScheduler } = require('jest');
const Canvas = require('../src/canvas');
const Color = require('../src/colors');
const lib = require('../src/lib');

test('Creating a canvas', () => {
  let c = new Canvas(10, 20);

  expect(c.width).toBe(10);
  expect(c.height).toBe(20);
  expect(c.pixels.length).toBe(c.width * c.height);
  for (let i = 0; i < c.pixels.length; i++) {
    expect(c.pixels[i].red).toBeCloseTo(0, lib.PRECISION);
    expect(c.pixels[i].green).toBeCloseTo(0, lib.PRECISION);
    expect(c.pixels[i].blue).toBeCloseTo(0, lib.PRECISION);
  }
});

test('Writing pixels to a canvas', () => {
  let c = new Canvas(10, 20);
  let red = new Color(1, 0, 0);
  c.writePixel(2, 3, red);

  let actual = c.pixelAt(2, 3);
  expect(actual.red).toBeCloseTo(1, lib.PRECISION);
  expect(actual.green).toBeCloseTo(0, lib.PRECISION);
  expect(actual.blue).toBeCloseTo(0, lib.PRECISION);
});

test('Constructing the PPM header', () => {
  let c = new Canvas(5, 3);
  let ppm = c.canvasToPpm();

  let actual = ppm.split('\n');

  expect(actual[0]).toBe('P3');
  expect(actual[1]).toBe('5 3');
  expect(actual[2]).toBe('255');
});

test('Constructing the PPM pixel data', () => {
  let c = new Canvas(5, 3);
  let c1 = new Color(1.5, 0, 0);
  let c2 = new Color(0, 0.5, 0);
  let c3 = new Color(-0.5, 0, 1);
  c.writePixel(0, 0, c1);
  c.writePixel(2, 1, c2);
  c.writePixel(4, 2, c3);
  let ppm = c.canvasToPpm();

  let actual = ppm.split('\n');

  expect(actual[3]).toBe('255 0 0 0 0 0 0 0 0 0 0 0 0 0 0');
  expect(actual[4]).toBe('0 0 0 0 0 0 0 128 0 0 0 0 0 0 0');
  expect(actual[5]).toBe('0 0 0 0 0 0 0 0 0 0 0 0 0 0 255');
});

test('Splitting long lines in PPM files', () => {
  let c = new Canvas(10, 2);
  for (let i = 0; i < c.pixels.length; i++) {
    c.pixels[i] = new Color(1, 0.8, 0.6);
  }
  let ppm = c.canvasToPpm();

  let actual = ppm.split('\n');

  expect(actual[3]).toBe('255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204');
  expect(actual[4]).toBe('153 255 204 153 255 204 153 255 204 153 255 204 153');
  expect(actual[5]).toBe('255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204');
  expect(actual[6]).toBe('153 255 204 153 255 204 153 255 204 153 255 204 153');
});

test('PPM files are terminated by a newline character', () => {
  let c = new Canvas(5, 3);
  let ppm = c.canvasToPpm();

  let actual = ppm.slice(ppm.length - 1);

  expect(actual).toBe('\n');
});