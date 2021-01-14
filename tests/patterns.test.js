const { TestScheduler } = require('jest');
const CheckersPattern = require('../src/patterns/checkers_patterns');
const Color = require('../src/colors');
const CubeMapPattern = require('../src/patterns/cube_map_patterns');
const GradientPattern = require('../src/patterns/gradient_patterns');
const Matrix = require('../src/matrices');
const RingPattern = require('../src/patterns/ring_patterns');
const Sphere = require('../src/shapes/spheres');
const StripedPattern = require('../src/patterns/striped_patterns');
const TestPattern = require('../src/patterns/test_patterns');
const TextureMapPattern = require('../src/patterns/texture_map_patterns');
const Tuple = require('../src/tuples');
const UVAlignCheckPattern = require('../src/patterns/uv_align_check_patterns');
const UVCheckersPattern = require('../src/patterns/uv_checkers_patterns');
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

test('Checker pattern in 2D', () => {
  let checkers = new UVCheckersPattern(2, 2, BLACK, WHITE);
  let examples = [
    { 'u': 0, 'v': 0, 'expected': BLACK },
    { 'u': 0.5, 'v': 0, 'expected': WHITE },
    { 'u': 0, 'v': 0.5, 'expected': WHITE },
    { 'u': 0.5, 'v': 0.5, 'expected': BLACK },
    { 'u': 1, 'v': 1, 'expected': BLACK },
  ];

  for (let example of examples) {
    let color = checkers.uvPatternAt(example.u, example.v);

    expect(Color.areEqual(color, example.expected)).toBeTruthy();
  }
});

test('Using a spherical mapping on a 3D point', () => {
  let examples = [
    { 'point': Tuple.point(0, 0, -1), 'u': 0, 'v': 0.5 },
    { 'point': Tuple.point(1, 0, 0), 'u': 0.25, 'v': 0.5 },
    { 'point': Tuple.point(0, 0, 1), 'u': 0.5, 'v': 0.5 },
    { 'point': Tuple.point(-1, 0, 0), 'u': 0.75, 'v': 0.5 },
    { 'point': Tuple.point(0, 1, 0), 'u': 0.5, 'v': 1 },
    { 'point': Tuple.point(0, -1, 0), 'u': 0.5, 'v': 0 },
    { 'point': Tuple.point(Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0), 'u': 0.25, 'v': 0.75 }
  ];

  for (let example of examples) {
    let p = example.point;

    let [u, v] = p.sphericalMap();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('Using a texture map pattern with a spherical map', () => {
  let checkers = new UVCheckersPattern(16, 8, BLACK, WHITE);
  let pattern = new TextureMapPattern(checkers, 'spherical');
  let examples = [
    { 'point': Tuple.point(0.4315, 0.4670, 0.7719), 'color': WHITE },
    { 'point': Tuple.point(-0.9654, 0.2552, -0.0534), 'color': BLACK },
    { 'point': Tuple.point(0.1039, 0.7090, 0.6975), 'color': WHITE },
    { 'point': Tuple.point(-0.4986, -0.7856, -0.3663), 'color': BLACK },
    { 'point': Tuple.point(-0.0317, -0.9395, 0.3411), 'color': BLACK },
    { 'point': Tuple.point(0.4809, -0.7721, 0.4154), 'color': BLACK },
    { 'point': Tuple.point(0.0285, -0.9612, -0.2745), 'color': BLACK },
    { 'point': Tuple.point(-0.5734, -0.2162, -0.7903), 'color': WHITE },
    { 'point': Tuple.point(0.7688, -0.1470, 0.6223), 'color': BLACK },
    { 'point': Tuple.point(-0.7652, 0.2175, 0.6060), 'color': BLACK }
  ];

  for (let example of examples) {
    let color = pattern.patternAt(example.point);

    expect(Color.areEqual(color, example.color)).toBeTruthy();
  }
});

test('Using a planar mapping on a 3D point', () => {
  let examples = [
    { 'point': Tuple.point(0.25, 0, 0.5), 'u': 0.25, 'v': 0.5 },
    { 'point': Tuple.point(0.25, 0, -0.25), 'u': 0.25, 'v': 0.75 },
    { 'point': Tuple.point(0.25, 0.5, -0.25), 'u': 0.25, 'v': 0.75 },
    { 'point': Tuple.point(1.25, 0, 0.5), 'u': 0.25, 'v': 0.5 },
    { 'point': Tuple.point(0.25, 0, -1.75), 'u': 0.25, 'v': 0.25 },
    { 'point': Tuple.point(1, 0, -1), 'u': 0, 'v': 0 },
    { 'point': Tuple.point(0, 0, 0), 'u': 0, 'v': 0 }
  ];

  for (let example of examples) {
    let p = example.point;

    let [u, v] = p.planarMap();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('Using a cylindrical mapping on a 3D point', () => {
  let examples = [
    { 'point': Tuple.point(0, 0, -1), 'u': 0, 'v': 0 },
    { 'point': Tuple.point(0, 0.5, -1), 'u': 0, 'v': 0.5 },
    { 'point': Tuple.point(0, 1, -1), 'u': 0, 'v': 0 },
    { 'point': Tuple.point(0.70711, 0.5, -0.70711), 'u': 0.125, 'v': 0.5 },
    { 'point': Tuple.point(1, 0.5, 0), 'u': 0.25, 'v': 0.5 },
    { 'point': Tuple.point(0.70711, 0.5, 0.70711), 'u': 0.375, 'v': 0.5 },
    { 'point': Tuple.point(0, -0.25, 1), 'u': 0.5, 'v': 0.75 },
    { 'point': Tuple.point(-0.70711, 0.5, 0.70711), 'u': 0.625, 'v': 0.5 },
    { 'point': Tuple.point(-1, 1.25, 0), 'u': 0.75, 'v': 0.25 },
    { 'point': Tuple.point(-0.70711, 0.5, -0.70711), 'u': 0.875, 'v': 0.5 }
  ];

  for (let example of examples) {
    let p = example.point;

    let [u, v] = p.cylindricalMap();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('Layout of the "align check" pattern', () => {
  let main = new Color(1, 1, 1);
  let ul = new Color(1, 0, 0);
  let ur = new Color(1, 1, 0);
  let bl = new Color(0, 1, 0);
  let br = new Color(0, 1, 1);
  let pattern = new UVAlignCheckPattern(main, ul, ur, bl, br);
  let examples = [
    { 'u': 0.5, 'v': 0.5, 'expected': main },
    { 'u': 0.1, 'v': 0.9, 'expected': ul },
    { 'u': 0.9, 'v': 0.9, 'expected': ur },
    { 'u': 0.1, 'v': 0.1, 'expected': bl },
    { 'u': 0.9, 'v': 0.1, 'expected': br },
  ];

  for (let example of examples) {
    let color = pattern.uvPatternAt(example.u, example.v);

    expect(Color.areEqual(color, example.expected)).toBeTruthy();
  }
});

test('Identifying the face of a cube from a point', () => {
  let examples = [
    { 'point': Tuple.point(-1, 0.5, -0.25), 'face': 'left' },
    { 'point': Tuple.point(1.1, -0.75, 0.8), 'face': 'right' },
    { 'point': Tuple.point(0.1, 0.6, 0.9), 'face': 'front' },
    { 'point': Tuple.point(-0.7, 0, -2), 'face': 'back' },
    { 'point': Tuple.point(0.5, 1, 0.9), 'face': 'up' },
    { 'point': Tuple.point(-0.2, -1.3, 1.1), 'face': 'down' }
  ];

  for (let example of examples) {
    let face = example.point.faceFromPoint();

    expect(face).toBe(example.face);
  }
});

test('UV mapping the front face of a cube', () => {
  let examples = [
    { 'point': Tuple.point(-0.5, 0.5, 1), 'u': 0.25, 'v': 0.75 },
    { 'point': Tuple.point(0.5, -0.5, 1), 'u': 0.75, 'v': 0.25 }
  ];

  for (let example of examples) {
    let [u, v] = example.point.cubeUVFront();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('UV mapping the back face of a cube', () => {
  let examples = [
    { 'point': Tuple.point(0.5, 0.5, -1), 'u': 0.25, 'v': 0.75 },
    { 'point': Tuple.point(-0.5, -0.5, -1), 'u': 0.75, 'v': 0.25 }
  ];

  for (let example of examples) {
    let [u, v] = example.point.cubeUVBack();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('UV mapping the left face of a cube', () => {
  let examples = [
    { 'point': Tuple.point(-1, 0.5, -0.5), 'u': 0.25, 'v': 0.75 },
    { 'point': Tuple.point(-1, -0.5, 0.5), 'u': 0.75, 'v': 0.25 }
  ];

  for (let example of examples) {
    let [u, v] = example.point.cubeUVLeft();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('UV mapping the right face of a cube', () => {
  let examples = [
    { 'point': Tuple.point(1, 0.5, 0.5), 'u': 0.25, 'v': 0.75 },
    { 'point': Tuple.point(1, -0.5, -0.5), 'u': 0.75, 'v': 0.25 }
  ];

  for (let example of examples) {
    let [u, v] = example.point.cubeUVRight();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('UV mapping the upper face of a cube', () => {
  let examples = [
    { 'point': Tuple.point(-0.5, 1, -0.5), 'u': 0.25, 'v': 0.75 },
    { 'point': Tuple.point(0.5, 1, 0.5), 'u': 0.75, 'v': 0.25 }
  ];

  for (let example of examples) {
    let [u, v] = example.point.cubeUVUp();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('UV mapping the lower face of a cube', () => {
  let examples = [
    { 'point': Tuple.point(-0.5, -1, 0.5), 'u': 0.25, 'v': 0.75 },
    { 'point': Tuple.point(0.5, -1, -0.5), 'u': 0.75, 'v': 0.25 }
  ];

  for (let example of examples) {
    let [u, v] = example.point.cubeUVDown();

    expect(u).toBeCloseTo(example.u);
    expect(v).toBeCloseTo(example.v);
  }
});

test('Finding the colors on a mapped cube', () => {
  let red = new Color(1, 0, 0);
  let yellow = new Color(1, 1, 0);
  let brown = new Color(1, 0.5, 0);
  let green = new Color(0, 1, 0);
  let cyan = new Color(0, 1, 1);
  let blue = new Color(0, 0, 1);
  let purple = new Color(1, 0, 1);
  let white = new Color(1, 1, 1);
  let left = new UVAlignCheckPattern(yellow, cyan, red, blue, brown);
  let front = new UVAlignCheckPattern(cyan, red, yellow, brown, green);
  let right = new UVAlignCheckPattern(red, yellow, purple, green, white);
  let back = new UVAlignCheckPattern(green, purple, cyan, white, blue);
  let up = new UVAlignCheckPattern(brown, cyan, purple, red, yellow);
  let down = new UVAlignCheckPattern(purple, brown, green, blue, white);
  let pattern = new CubeMapPattern(left, front, right, back, up, down);
  let examples = [
    { 'point': Tuple.point(-1, 0, 0), 'color': yellow },
    { 'point': Tuple.point(-1, 0.9, -0.9), 'color': cyan },
    { 'point': Tuple.point(-1, 0.9, 0.9), 'color': red },
    { 'point': Tuple.point(-1, -0.9, -0.9), 'color': blue },
    { 'point': Tuple.point(-1, -0.9, 0.9), 'color': brown },
    { 'point': Tuple.point(0, 0, 1), 'color': cyan },
    { 'point': Tuple.point(-0.9, 0.9, 1), 'color': red },
    { 'point': Tuple.point(0.9, 0.9, 1), 'color': yellow },
    { 'point': Tuple.point(-0.9, -0.9, 1), 'color': brown },
    { 'point': Tuple.point(0.9, -0.9, 1), 'color': green },
    { 'point': Tuple.point(1, 0, 0), 'color': red },
    { 'point': Tuple.point(1, 0.9, 0.9), 'color': yellow },
    { 'point': Tuple.point(1, 0.9, -0.9), 'color': purple },
    { 'point': Tuple.point(1, -0.9, 0.9), 'color': green },
    { 'point': Tuple.point(1, -0.9, -0.9), 'color': white },
    { 'point': Tuple.point(0, 0, -1), 'color': green },
    { 'point': Tuple.point(0.9, 0.9, -1), 'color': purple },
    { 'point': Tuple.point(-0.9, 0.9, -1), 'color': cyan },
    { 'point': Tuple.point(0.9, -0.9, -1), 'color': white },
    { 'point': Tuple.point(-0.9, -0.9, -1), 'color': blue },
    { 'point': Tuple.point(0, 1, 0), 'color': brown },
    { 'point': Tuple.point(-0.9, 1, -0.9), 'color': cyan },
    { 'point': Tuple.point(0.9, 1, -0.9), 'color': purple },
    { 'point': Tuple.point(-0.9, 1, 0.9), 'color': red },
    { 'point': Tuple.point(0.9, 1, 0.9), 'color': yellow },
    { 'point': Tuple.point(0, -1, 0), 'color': purple },
    { 'point': Tuple.point(-0.9, -1, 0.9), 'color': brown },
    { 'point': Tuple.point(0.9, -1, 0.9), 'color': green },
    { 'point': Tuple.point(-0.9, -1, -0.9), 'color': blue },
    { 'point': Tuple.point(0.9, -1, -0.9), 'color': white }
  ];

  for(let example of examples) {
    let color = pattern.patternAt(example.point);

    expect(Color.areEqual(color, example.color));
  }
});