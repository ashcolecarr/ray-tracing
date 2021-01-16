const { TestScheduler } = require('jest');
const Canvas = require('../src/canvas');
const Color = require('../src/colors');
const lib = require('../src/lib');
const fs = require('fs');

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

test('Reading a file with the wrong magic number', () => {
  let ppm;
  try {
    ppm = fs.readFileSync('./test_data/wrong_magic_number.ppm', 'utf8');
  } catch(e) {
    throw e;
  }

  expect(Canvas.canvasFromPpm(ppm)).toBeNull();
});

test('Reading a PPM returns a canvas of the right size', () => {
  let ppm;
  try {
    ppm = fs.readFileSync('./test_data/canvas_right_size.ppm', 'utf8');
  } catch(e) {
    throw e;
  }

  let canvas = Canvas.canvasFromPpm(ppm);

  expect(canvas.width).toBe(10);
  expect(canvas.height).toBe(2);
});

test('Reading pixel data from a PPM file', () => {
  let ppm;
  try {
    ppm = fs.readFileSync('./test_data/pixel_data.ppm', 'utf8');
  } catch(e) {
    throw e;
  }
  let examples = [
    { 'x': 0, 'y': 0, 'color': new Color(1, 0.49803, 0) },
    { 'x': 1, 'y': 0, 'color': new Color(0, 0.49803, 1) },
    { 'x': 2, 'y': 0, 'color': new Color(0.49803, 1, 0) },
    { 'x': 3, 'y': 0, 'color': new Color(1, 1, 1) },
    { 'x': 0, 'y': 1, 'color': new Color(0, 0, 0) },
    { 'x': 1, 'y': 1, 'color': new Color(1, 0, 0) },
    { 'x': 2, 'y': 1, 'color': new Color(0, 1, 0) },
    { 'x': 3, 'y': 1, 'color': new Color(0, 0, 1) },
    { 'x': 0, 'y': 2, 'color': new Color(1, 1, 0) },
    { 'x': 1, 'y': 2, 'color': new Color(0, 1, 1) },
    { 'x': 2, 'y': 2, 'color': new Color(1, 0, 1) },
    { 'x': 3, 'y': 2, 'color': new Color(0.49803, 0.49803, 0.49803) }
  ];

  let canvas = Canvas.canvasFromPpm(ppm);

  for (let example of examples) {
    let color = canvas.pixelAt(example.x, example.y);

    expect(Color.areEqual(color, example.color)).toBeTruthy();
  }
});

test('PPM parsing ignores comment lines', () => {
  let ppm;
  try {
    ppm = fs.readFileSync('./test_data/comments.ppm', 'utf8');
  } catch(e) {
    throw e;
  }

  let canvas = Canvas.canvasFromPpm(ppm);

  expect(Color.areEqual(canvas.pixelAt(0, 0), new Color(1, 1, 1))).toBeTruthy();
  expect(Color.areEqual(canvas.pixelAt(1, 0), new Color(1, 0, 1))).toBeTruthy();
});

test('PPM parsing allows an RGB triple to span lines', () => {
  let ppm;
  try {
    ppm = fs.readFileSync('./test_data/span_lines.ppm', 'utf8');
  } catch(e) {
    throw e;
  }

  let canvas = Canvas.canvasFromPpm(ppm);

  expect(Color.areEqual(canvas.pixelAt(0, 0), new Color(0.2, 0.6, 0.8))).toBeTruthy();
});

test('PPM parsing respects the scale setting', () => {
  let ppm;
  try {
    ppm = fs.readFileSync('./test_data/scale_setting.ppm', 'utf8');
  } catch(e) {
    throw e;
  }

  let canvas = Canvas.canvasFromPpm(ppm);

  expect(Color.areEqual(canvas.pixelAt(0, 1), new Color(0.75, 0.5, 0.25))).toBeTruthy();
});