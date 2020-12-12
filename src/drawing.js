'use-strict';

const lib = require('../src/lib');
const Canvas = require('../src/canvas');
const Color = require('../src/colors');
const Intersection = require('../src/intersections');
const Matrix = require('../src/matrices');
const transformation = require('../src/transformations');
const Tuple = require('../src/tuples');
const Sphere = require('./spheres');
const Ray = require('./rays');

module.exports = {
  tick: function (env, proj) {
    let position = Tuple.add(proj.position, proj.velocity);
    let velocity = Tuple.add(proj.velocity, Tuple.add(env.gravity, env.wind));

    return new lib.Projectile(position, velocity);
  },

  drawProjectile: function () {
    let projectile = new lib.Projectile(Tuple.point(0, 1, 0), Tuple.multiply(Tuple.vector(1, 1.8, 0).normalize(), 11.25));
    let environment = new lib.Environment(Tuple.vector(0, -0.1, 0), Tuple.vector(-0.01, 0, 0));

    const width = 900;
    const height = 550;
    let canvas = new Canvas(width, height);

    while (projectile.position.y > 0) {
      canvas.writePixel(Math.round(projectile.position.x), height - Math.round(projectile.position.y), new Color(1, 0.5, 0.5));
    
      projectile = this.tick(environment, projectile);
    }

    lib.writePpmFile('projectile.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawClock: function () {
    const width = 400;
    const height = 400;
    let canvas = new Canvas(width, height);

    let origin = Tuple.point(0, 0, 0);
    let clockRadius = (3 / 8) * width;

    let twelveOClock = Matrix.multiplyTuple(transformation.translation(0, 0, 1), origin);
    for (let i = 0; i < 12; i++) {
      let oClock = Matrix.multiplyTuple(transformation.rotation(i * (Math.PI / 6), transformation.Axis.Y), twelveOClock);

      let x = (clockRadius * oClock.x) + (width / 2);
      let y = (clockRadius * oClock.z) + (height / 2);
      canvas.writePixel(Math.round(x), Math.round(y), new Color(1, 0.5, 0.5));
    }

    lib.writePpmFile('clock.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawCircle: function () {
    let rayOrigin = Tuple.point(0, 0, -5);
    let wallZ = 10;
    let wallSize = 7;

    let canvasPixels = 100;
    let pixelSize = wallSize / canvasPixels;
    let half = wallSize / 2;

    let canvas = new Canvas(canvasPixels, canvasPixels);
    let color = new Color(1, 0, 0);
    let sphere = new Sphere();

    for (let y = 0; y < canvasPixels; y++) {
      let worldY = half - pixelSize * y;

      for (let x = 0; x < canvasPixels; x++) {
        let worldX = -half + pixelSize * x;
        let position = Tuple.point(worldX, worldY, wallZ);

        let ray = new Ray(rayOrigin, Tuple.subtract(position, rayOrigin).normalize());
        let intersections = sphere.intersect(ray);

        let hit = Intersection.hit(intersections);
        if (hit) {
          canvas.writePixel(Math.round(x), Math.round(y), color);
        }
      }
    }

    lib.writePpmFile('circle.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  }
}