'use-strict';

const Group = require('./shapes/groups');
const Parser = require('./parser');
const SmoothTriangle = require('./shapes/smooth_triangles');
const Triangle = require('./shapes/triangles');
const Tuple = require('./tuples');

parseObjFile = function(file) {
  let linesIgnored = 0;
  let vertices = [Tuple.point(0, 0, 0)];
  let groups = [new Group()];
  let vertexNormals = [Tuple.vector(0, 0, 0)];

  let lines = file.split(/\r?\n/);
  for (let line of lines) {
    let record = line.trim().split(/\s+/);
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
    } else if (record[0] === 'vn') { // Vertex Normal
      let coordinates = [];
      for (rec of record.slice(1)) {
        coordinates.push(parseFloat(rec));
      }

      vertexNormals.push(Tuple.vector(coordinates[0], coordinates[1], coordinates[2]));
    } else if (record[0] === 'f') { // Face
      let vertexIndices = [];
      let normalIndices = [];

      let values = [];
      let containsVertexNormal = false;
      for (rec of record.slice(1)) {
        values = rec.split('/');
        if (values.length === 1) {
          vertexIndices.push(parseInt(values[0]));
        } else {
          // Point
          vertexIndices.push(parseInt(values[0]));
          
          // Vertex texture

          // Vertex normal
          containsVertexNormal = true;
          normalIndices.push(parseInt(values[2]));
        }
      }

      // Determine if it is a simple triangle or a more complex polygon.
      if (containsVertexNormal) {
        let smoothTriangles = fanTriangulationSmooth(vertices, vertexIndices, vertexNormals, normalIndices);
        smoothTriangles.forEach(triangle => groups[groups.length - 1].addChild(triangle));
      } else {
        let triangles = fanTriangulation(vertices, vertexIndices);
        triangles.forEach(triangle => groups[groups.length - 1].addChild(triangle));
      }
    } else if (record[0] === 'g') { // Group
      let group = new Group();
      group.name = record[1];
      groups.push(group);
    } else {
      linesIgnored++;
    }
  }
  return new Parser(vertices, groups, vertexNormals, linesIgnored);
}

fanTriangulation = function(vertices, vertexIndices) {
  let triangles = [];

  for (let i = 1; i < vertexIndices.length - 1; i++) {
    triangles.push(new Triangle(vertices[vertexIndices[0]], vertices[vertexIndices[i]], vertices[vertexIndices[i + 1]]));
  }

  return triangles;
}

fanTriangulationSmooth = function(vertices, vertexIndices, normals, normalIndices) {
  let smoothTriangles = [];

  for (let i = 1; i < vertexIndices.length - 1; i++) {
    smoothTriangles.push(new SmoothTriangle(vertices[vertexIndices[0]], vertices[vertexIndices[i]], vertices[vertexIndices[i + 1]],
      normals[normalIndices[0]], normals[normalIndices[i]], normals[normalIndices[i + 1]]));
  }

  return smoothTriangles;
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