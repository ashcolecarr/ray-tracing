const { TestScheduler } = require('jest');
const Tuple = require('../src/tuples');
const { objToGroup, parseObjFile } = require('../src/obj_file');
const fs = require('fs');

test('Ignoring unrecognized lines', () => {
  let gibberish;
  try {
    gibberish = fs.readFileSync('gibberish.obj', 'utf8');
  } catch(e) {
    throw e;
  }

  let parser = parseObjFile(gibberish);

  expect(parser.linesIgnored).toBe(5);
});

test('Vertex records', () => {
  let file;
  try {
    file = fs.readFileSync('vertex_records.obj', 'utf8');
  } catch(e) {
    throw e;
  }

  let parser = parseObjFile(file);

  expect(Tuple.areEqual(parser.vertices[1], Tuple.point(-1, 1, 0))).toBeTruthy();
  expect(Tuple.areEqual(parser.vertices[2], Tuple.point(-1, 0.5, 0))).toBeTruthy();
  expect(Tuple.areEqual(parser.vertices[3], Tuple.point(1, 0, 0))).toBeTruthy();
  expect(Tuple.areEqual(parser.vertices[4], Tuple.point(1, 1, 0))).toBeTruthy();
});

test('Parsing triangle faces', () => {
  let file;
  try {
    file = fs.readFileSync('parsing_triangle_faces.obj', 'utf8');
  } catch(e) {
    throw e;
  }

  let parser = parseObjFile(file);
  let g = parser.defaultGroup;
  let t1 = g.children[0];
  let t2 = g.children[1];

  expect(Tuple.areEqual(t1.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t1.p2, parser.vertices[2])).toBeTruthy();
  expect(Tuple.areEqual(t1.p3, parser.vertices[3])).toBeTruthy();
  expect(Tuple.areEqual(t2.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t2.p2, parser.vertices[3])).toBeTruthy();
  expect(Tuple.areEqual(t2.p3, parser.vertices[4])).toBeTruthy();
});

test('Triangulating polygons', () => {
  let file;
  try {
    file = fs.readFileSync('triangulating_polygons.obj', 'utf8');
  } catch(e) {
    throw e;
  }

  let parser = parseObjFile(file);
  let g = parser.defaultGroup;
  let t1 = g.children[0];
  let t2 = g.children[1];
  let t3 = g.children[2];

  expect(Tuple.areEqual(t1.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t1.p2, parser.vertices[2])).toBeTruthy();
  expect(Tuple.areEqual(t1.p3, parser.vertices[3])).toBeTruthy();
  expect(Tuple.areEqual(t2.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t2.p2, parser.vertices[3])).toBeTruthy();
  expect(Tuple.areEqual(t2.p3, parser.vertices[4])).toBeTruthy();
  expect(Tuple.areEqual(t3.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t3.p2, parser.vertices[4])).toBeTruthy();
  expect(Tuple.areEqual(t3.p3, parser.vertices[5])).toBeTruthy();
});

test('Triangles in groups', () => {
  let file;
  try {
    file = fs.readFileSync('triangles.obj', 'utf8');
  } catch(e) {
    throw e;
  }

  let parser = parseObjFile(file);
  let g1 = parser.groups[1];;
  let g2 = parser.groups[2];;
  let t1 = g1.children[0];
  let t2 = g2.children[0];

  expect(g1.name).toBe('FirstGroup');
  expect(g2.name).toBe('SecondGroup');
  expect(Tuple.areEqual(t1.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t1.p2, parser.vertices[2])).toBeTruthy();
  expect(Tuple.areEqual(t1.p3, parser.vertices[3])).toBeTruthy();
  expect(Tuple.areEqual(t2.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t2.p2, parser.vertices[3])).toBeTruthy();
  expect(Tuple.areEqual(t2.p3, parser.vertices[4])).toBeTruthy();
});

test('Converting an OBJ file to a group', () => {
  let file;
  try {
    file = fs.readFileSync('triangles.obj', 'utf8');
  } catch(e) {
    throw e;
  }

  let parser = parseObjFile(file);
  let g = objToGroup(parser);

  expect(g.children.findIndex(c => c.id === parser.groups[1].id) > -1).toBeTruthy();
  expect(g.children.findIndex(c => c.id === parser.groups[2].id) > -1).toBeTruthy();
});

test('Vertex normal records', () => {
  let file;
  try {
    file = fs.readFileSync('vertex_normal_records.obj', 'utf8');
  } catch(e) {
    throw e;
  }

  let parser = parseObjFile(file);

  expect(Tuple.areEqual(parser.normals[1], Tuple.vector(0, 0, 1))).toBeTruthy();
  expect(Tuple.areEqual(parser.normals[2], Tuple.vector(0.707, 0, -0.707))).toBeTruthy();
  expect(Tuple.areEqual(parser.normals[3], Tuple.vector(1, 2, 3))).toBeTruthy();
});

test('Faces with normals', () => {
  let file;
  try {
    file = fs.readFileSync('faces_with_normals.obj', 'utf8');
  } catch(e) {
    throw e;
  }

  let parser = parseObjFile(file);
  let g = parser.defaultGroup;
  let t1 = g.children[0];
  let t2 = g.children[1];

  expect(Tuple.areEqual(t1.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t1.p2, parser.vertices[2])).toBeTruthy();
  expect(Tuple.areEqual(t1.p3, parser.vertices[3])).toBeTruthy();
  expect(Tuple.areEqual(t1.n1, parser.normals[3])).toBeTruthy();
  expect(Tuple.areEqual(t1.n2, parser.normals[1])).toBeTruthy();
  expect(Tuple.areEqual(t1.n3, parser.normals[2])).toBeTruthy();
  expect(Tuple.areEqual(t2.p1, parser.vertices[1])).toBeTruthy();
  expect(Tuple.areEqual(t2.p2, parser.vertices[2])).toBeTruthy();
  expect(Tuple.areEqual(t2.p3, parser.vertices[3])).toBeTruthy();
  expect(Tuple.areEqual(t2.n1, parser.normals[3])).toBeTruthy();
  expect(Tuple.areEqual(t2.n2, parser.normals[1])).toBeTruthy();
  expect(Tuple.areEqual(t2.n3, parser.normals[2])).toBeTruthy();
});