'use-strict';

const Group = require('./shapes/groups');
const Parser = require('./parser');
const Triangle = require('./shapes/triangles');
const Tuple = require('./tuples');

parseObjFile = function(file) {
  let linesIgnored = 0;
  let vertices = [Tuple.point(0, 0, 0)];
  let groups = [new Group()];

  let lines = file.split(/\r?\n/);
  for (const line of lines) {
    let record = line.split(/\s+/);
    if (record.length === 0) {
      linesIgnored++;
      continue;
    }

    if (record[0] === 'v') { // Vertex
      let coordinates = [];
      for (rec of record.slice(1)) {
        coordinates.push(parseFloat(rec));
      }

      vertices.push(Tuple.point(coordinates[0], coordinates[1], coordinates[2]));
    } else if (record[0] === 'f') { // Face
      let points = [];
      for (rec of record.slice(1)) {
        points.push(parseInt(rec));
      }

      // Determine if it is a simple triangle or a more complex polygon.
      if (points.length > 3) {
        let triangles = fanTriangulation(vertices);
        triangles.forEach(triangle => groups[groups.length - 1].addChild(triangle));
      } else {
        let triangle = new Triangle(vertices[points[0]], vertices[points[1]], vertices[points[2]]);
        groups[groups.length - 1].addChild(triangle);
      }
    } else if (record[0] === 'g') { // Group
      groups.push(new Group());
    } else {
      linesIgnored++;
    }
  }
  return new Parser(vertices, groups, linesIgnored);
}

fanTriangulation = function(vertices) {
  let triangles = [];

  for (let i = 2; i < vertices.length - 1; i++) {
    triangles.push(new Triangle(vertices[1], vertices[i], vertices[i + 1]));
  }

  return triangles;
}

objToGroup = function(parser) {
  let mainGroup = new Group();

  parser.groups.forEach(g => mainGroup.addChild(g));

  return mainGroup;
}

module.exports = {
  parseObjFile,
  objToGroup
}