'use-strict';

const Camera = require('./camera');
const Canvas = require('./canvas');
const Color = require('./colors');
const Intersection = require('./intersections');
const lib = require('./lib');
const Light = require('./lights');
const Matrix = require('./matrices');
const transform = require('./transformations');
const Tuple = require('./tuples');
const Sphere = require('./spheres');
const Ray = require('./rays');
const Material = require('./materials');
const World = require('./world');

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

    let twelveOClock = Matrix.multiplyTuple(transform.translation(0, 0, 1), origin);
    for (let i = 0; i < 12; i++) {
      let oClock = Matrix.multiplyTuple(transform.rotation(i * (Math.PI / 6), transform.Axis.Y), twelveOClock);

      let x = (clockRadius * oClock.x) + (width / 2);
      let y = (clockRadius * oClock.z) + (height / 2);
      canvas.writePixel(Math.round(x), Math.round(y), new Color(1, 0.5, 0.5));
    }

    lib.writePpmFile('clock.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawFlatCircle: function () {
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

    lib.writePpmFile('flat_circle.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  draw3DCircle: function () {
    let rayOrigin = Tuple.point(0, 0, -5);
    let wallZ = 10;
    let wallSize = 7;

    let canvasPixels = 100;
    let pixelSize = wallSize / canvasPixels;
    let half = wallSize / 2;

    let canvas = new Canvas(canvasPixels, canvasPixels);
    let sphere = new Sphere();
    sphere.material = new Material();
    sphere.material.color = new Color(1, 0.2, 1);

    let light = Light.pointLight(Tuple.point(-10, 10, -10), new Color(1, 1, 1));

    for (let y = 0; y < canvasPixels; y++) {
      let worldY = half - pixelSize * y;

      for (let x = 0; x < canvasPixels; x++) {
        let worldX = -half + pixelSize * x;
        let position = Tuple.point(worldX, worldY, wallZ);

        let ray = new Ray(rayOrigin, Tuple.subtract(position, rayOrigin).normalize());
        let intersections = sphere.intersect(ray);

        let hit = Intersection.hit(intersections);
        if (hit) {
          let point = ray.position(hit.t);
          let normal = hit.object.normalAt(point);
          let eye = Tuple.negate(ray.direction);
          
          let material = hit.object.material;
          let color = material.lighting(light, point, eye, normal);
          
          canvas.writePixel(Math.round(x), Math.round(y), color);
        }
      }
    }

    lib.writePpmFile('3d_circle.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawSphereScene: function () {
    // Draw a simple sphere scene. Everything is made using spheres.
    let floor = new Sphere();
    floor.transform = transform.scaling(10, 0.01, 10);
    floor.material = new Material();
    floor.material.color = new Color(1, 0.9, 0.9);
    floor.material.specular = 0;

    let leftWall = new Sphere();
    leftWall.transform = Matrix.multiply(transform.translation(0, 0, 5),
      Matrix.multiply(transform.rotation(-Math.PI / 4, transform.Axis.Y),
      Matrix.multiply(transform.rotation(Math.PI / 2, transform.Axis.X),
      transform.scaling(10, 0.01, 10))));
    leftWall.material = floor.material;

    let rightWall = new Sphere();
    rightWall.transform = Matrix.multiply(transform.translation(0, 0, 5),
      Matrix.multiply(transform.rotation(Math.PI / 4, transform.Axis.Y),
      Matrix.multiply(transform.rotation(Math.PI / 2, transform.Axis.X),
      transform.scaling(10, 0.01, 10))));
    rightWall.material = floor.material;

    let middle = new Sphere();
    middle.transform = transform.translation(-0.5, 1, 0.5);
    middle.material = new Material();
    middle.material.color = new Color(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;

    let right = new Sphere();
    right.transform = Matrix.multiply(transform.translation(1.5, 0.5, -0.5),
      transform.scaling(0.5, 0.5, 0.5));
    right.material = new Material();
    right.material.color = new Color(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    let left = new Sphere();
    left.transform = Matrix.multiply(transform.translation(-1.5, 0.33, -0.75),
      transform.scaling(0.33, 0.33, 0.33));
    left.material = new Material();
    left.material.color = new Color(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    let world = new World();
    world.light = Light.pointLight(Tuple.point(-10, 10, -10), new Color(1, 1, 1));
    world.objects.push(floor);
    world.objects.push(leftWall);
    world.objects.push(rightWall);
    world.objects.push(middle);
    world.objects.push(right);
    world.objects.push(left);

    let camera = new Camera(400, 200, Math.PI / 3);
    camera.transform = transform.viewTransform(Tuple.point(0, 1.5, -5),
      Tuple.point(0, 1, 0), Tuple.vector(0, 1, 0));
    
    let canvas = camera.render(world);

    lib.writePpmFile('sphere_scene.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  }
}