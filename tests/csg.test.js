const { TestScheduler } = require('jest');
const CSG = require('../src/shapes/csg');
const Cube = require('../src/shapes/cubes');
const Intersection = require('../src/intersections');
const lib = require('../src/lib');
const Ray = require('../src/rays');
const Sphere = require('../src/shapes/spheres');
const Tuple = require('../src/tuples');
const { translation } = require('../src/transformations');

test('CSG is created with an operation and two shapes', () => {
  let s1 = new Sphere();
  let s2 = new Sphere();
  let c = new CSG('union', s1, s2);

  expect(c.operation).toBe('union');
  expect(c.left.id).toBe(s1.id);
  expect(c.right.id).toBe(s2.id);
  expect(s1.parent.id).toBe(c.id);
  expect(s2.parent.id).toBe(c.id);
});

test('Evaluating the rule for a CSG operation', () => {
  let examples = [
    { 'op': 'union', 'lhit': true, 'inl': true, 'inr': true, 'result': false },
    { 'op': 'union', 'lhit': true, 'inl': true, 'inr': false, 'result': true },  
    { 'op': 'union', 'lhit': true, 'inl': false, 'inr': true, 'result': false },  
    { 'op': 'union', 'lhit': true, 'inl': false, 'inr': false, 'result': true },   
    { 'op': 'union', 'lhit': false, 'inl': true, 'inr': true, 'result': false },  
    { 'op': 'union', 'lhit': false, 'inl': true, 'inr': false, 'result': false },  
    { 'op': 'union', 'lhit': false, 'inl': false, 'inr': true, 'result': true },   
    { 'op': 'union', 'lhit': false, 'inl': false, 'inr': false, 'result': true },
    { 'op': 'intersection', 'lhit': true, 'inl': true, 'inr': true, 'result': true },
    { 'op': 'intersection', 'lhit': true, 'inl': true, 'inr': false, 'result': false },  
    { 'op': 'intersection', 'lhit': true, 'inl': false, 'inr': true, 'result': true },  
    { 'op': 'intersection', 'lhit': true, 'inl': false, 'inr': false, 'result': false },   
    { 'op': 'intersection', 'lhit': false, 'inl': true, 'inr': true, 'result': true },  
    { 'op': 'intersection', 'lhit': false, 'inl': true, 'inr': false, 'result': true },  
    { 'op': 'intersection', 'lhit': false, 'inl': false, 'inr': true, 'result': false },   
    { 'op': 'intersection', 'lhit': false, 'inl': false, 'inr': false, 'result': false },
    { 'op': 'difference', 'lhit': true, 'inl': true, 'inr': true, 'result': false },
    { 'op': 'difference', 'lhit': true, 'inl': true, 'inr': false, 'result': true },  
    { 'op': 'difference', 'lhit': true, 'inl': false, 'inr': true, 'result': false },  
    { 'op': 'difference', 'lhit': true, 'inl': false, 'inr': false, 'result': true },   
    { 'op': 'difference', 'lhit': false, 'inl': true, 'inr': true, 'result': true },  
    { 'op': 'difference', 'lhit': false, 'inl': true, 'inr': false, 'result': true },  
    { 'op': 'difference', 'lhit': false, 'inl': false, 'inr': true, 'result': false },   
    { 'op': 'difference', 'lhit': false, 'inl': false, 'inr': false, 'result': false }
  ];

  for (example of examples) {
    let result = CSG.intersectionAllowed(example.op, example.lhit, example.inl, example.inr);

    expect(result).toBe(example.result);
  }
});

test('Filtering a list of intersections', () => {
  let s1 = new Sphere();
  let s2 = new Cube();
  let examples = [
    { 'operation': 'union', 'x0': 0, 'x1': 3 },
    { 'operation': 'intersection', 'x0': 1, 'x1': 2 },
    { 'operation': 'difference', 'x0': 0, 'x1': 1 }
  ];

  for (example of examples) {
    let c = new CSG(example.operation, s1, s2);
    let xs = Intersection.intersections(new Intersection(1, s1), new Intersection(2, s2),
      new Intersection(3, s1), new Intersection(4, s2));
    
    let result = c.filterIntersections(xs);

    expect(result.length).toBe(2);
    expect(result[0].t).toBeCloseTo(xs[example.x0].t, lib.PRECISION);
    expect(result[1].t).toBeCloseTo(xs[example.x1].t, lib.PRECISION);
  }
});

test('A ray misses a CSG object', () => {
  let c = new CSG('union', new Sphere(), new Cube());
  let r = new Ray(Tuple.point(0, 2, -5), Tuple.vector(0, 0, 1));

  let xs = c.localIntersect(r);

  expect(xs.length).toBe(0);
});

test('A ray hits a CSG object', () => {
  let s1 = new Sphere();
  let s2 = new Sphere();
  s2.setTransform(translation(0, 0, 0.5));
  let c = new CSG('union', s1, s2);
  let r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));

  let xs = c.localIntersect(r);

  expect(xs.length).toBe(2);
  expect(xs[0].t).toBeCloseTo(4, lib.PRECISION);
  expect(xs[0].object.id).toBe(s1.id);
  expect(xs[1].t).toBeCloseTo(6.5, lib.PRECISION);
  expect(xs[1].object.id).toBe(s2.id);
});