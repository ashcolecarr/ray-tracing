'use-strict';

class Parser {
  constructor(vertices, groups, normals, linesIgnored) {
    this.vertices = vertices;
    this.defaultGroup = groups[0];
    this.groups = groups;
    this.normals = normals;
    this.linesIgnored = linesIgnored;
  }
}

module.exports = Parser;