'use-strict';

class Parser {
  constructor(vertices, groups, linesIgnored) {
    this.vertices = vertices;
    this.defaultGroup = groups[0];
    this.groups = groups;
    this.linesIgnored = linesIgnored;
  }
}

module.exports = Parser;