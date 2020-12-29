'use-strict';

const Camera = require('./camera');
const Canvas = require('./canvas');
const CheckersPattern = require('./patterns/checkers_patterns');
const Color = require('./colors');
const GradientPattern = require('./patterns/gradient_patterns');
const Intersection = require('./intersections');
const lib = require('./lib');
const Light = require('./lights');
const Material = require('./materials');
const Matrix = require('./matrices');
const Plane = require('./shapes/planes');
const Ray = require('./rays');
const RingPattern = require('./patterns/ring_patterns');
const Sphere = require('./shapes/spheres');
const StripedPattern = require('./patterns/striped_patterns');
const Tuple = require('./tuples');
const World = require('./world');
const { Axis, rotation, scaling, shearing, translation, viewTransform } = require('./transformations');
const Cube = require('./shapes/cubes');
const Cylinder = require('./shapes/cylinders');
const Group = require('./shapes/groups');

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

    let twelveOClock = Matrix.multiplyTuple(translation(0, 0, 1), origin);
    for (let i = 0; i < 12; i++) {
      let oClock = Matrix.multiplyTuple(rotation(i * (Math.PI / 6), Axis.Y), twelveOClock);

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
    floor.transform = scaling(10, 0.01, 10);
    floor.material = new Material();
    floor.material.color = new Color(1, 0.9, 0.9);
    floor.material.specular = 0;

    let leftWall = new Sphere();
    leftWall.transform = Matrix.multiply(translation(0, 0, 5),
      Matrix.multiply(rotation(-Math.PI / 4, Axis.Y),
      Matrix.multiply(rotation(Math.PI / 2, Axis.X),
      scaling(10, 0.01, 10))));
    leftWall.material = floor.material;

    let rightWall = new Sphere();
    rightWall.transform = Matrix.multiply(translation(0, 0, 5),
      Matrix.multiply(rotation(Math.PI / 4, Axis.Y),
      Matrix.multiply(rotation(Math.PI / 2, Axis.X),
      scaling(10, 0.01, 10))));
    rightWall.material = floor.material;

    let middle = new Sphere();
    middle.transform = translation(-0.5, 1, 0.5);
    middle.material = new Material();
    middle.material.color = new Color(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;

    let right = new Sphere();
    right.transform = Matrix.multiply(translation(1.5, 0.5, -0.5),
      scaling(0.5, 0.5, 0.5));
    right.material = new Material();
    right.material.color = new Color(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    let left = new Sphere();
    left.transform = Matrix.multiply(translation(-1.5, 0.33, -0.75),
      scaling(0.33, 0.33, 0.33));
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
    camera.transform = viewTransform(Tuple.point(0, 1.5, -5),
      Tuple.point(0, 1, 0), Tuple.vector(0, 1, 0));
    
    let canvas = camera.render(world);

    lib.writePpmFile('sphere_scene.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawSpherePlaneScene: function () {
    // Draw a simple sphere scene with the spheres hovering over a plane.
    let floor = new Plane();
    floor.material = new Material();
    floor.material.color = new Color(1, 0.9, 0.9);
    floor.material.specular = 0;

    let middle = new Sphere();
    middle.transform = translation(-0.5, 1, 0.5);
    middle.material = new Material();
    middle.material.color = new Color(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;

    let right = new Sphere();
    right.transform = Matrix.multiply(translation(1.5, 0.5, -0.5),
      scaling(0.5, 0.5, 0.5));
    right.material = new Material();
    right.material.color = new Color(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;

    let left = new Sphere();
    left.transform = Matrix.multiply(translation(-1.5, 0.33, -0.75),
      scaling(0.33, 0.33, 0.33));
    left.material = new Material();
    left.material.color = new Color(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;

    let world = new World();
    world.light = Light.pointLight(Tuple.point(-10, 10, -10), new Color(1, 1, 1));
    world.objects.push(floor);
    world.objects.push(middle);
    world.objects.push(right);
    world.objects.push(left);

    let camera = new Camera(400, 200, Math.PI / 3);
    camera.transform = viewTransform(Tuple.point(0, 1.5, -5),
      Tuple.point(0, 1, 0), Tuple.vector(0, 1, 0));
    
    let canvas = camera.render(world);

    lib.writePpmFile('sphere_plane_scene.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawSpherePatternScene: function () {
    // Draw a simple sphere scene with the spheres hovering over a plane with patterns.
    let floor = new Plane();
    floor.material = new Material();
    floor.material.color = new Color(1, 0.9, 0.9);
    floor.material.specular = 0;
    floor.material.pattern = new CheckersPattern(new Color(1, 0, 0), new Color(0.5, 0, 1));

    let middle = new Sphere();
    middle.transform = translation(-0.5, 1, 0.5);
    middle.material = new Material();
    middle.material.color = new Color(0.1, 1, 0.5);
    middle.material.diffuse = 0.7;
    middle.material.specular = 0.3;
    middle.material.pattern = new GradientPattern(new Color(0, 0, 1), new Color(0, 1, 1));

    let right = new Sphere();
    right.transform = Matrix.multiply(translation(1.5, 0.5, -0.5),
      scaling(0.5, 0.5, 0.5));
    right.material = new Material();
    right.material.color = new Color(0.5, 1, 0.1);
    right.material.diffuse = 0.7;
    right.material.specular = 0.3;
    right.material.pattern = new RingPattern(new Color(1, 1, 1), new Color(1, 1, 0));

    let left = new Sphere();
    left.transform = Matrix.multiply(translation(-1.5, 0.33, -0.75),
      scaling(0.33, 0.33, 0.33));
    left.material = new Material();
    left.material.color = new Color(1, 0.8, 0.1);
    left.material.diffuse = 0.7;
    left.material.specular = 0.3;
    left.material.pattern = new StripedPattern(new Color(1, 0, 1), new Color(0, 1, 0));

    let world = new World();
    world.light = Light.pointLight(Tuple.point(-10, 10, -10), new Color(1, 1, 1));
    world.objects.push(floor);
    world.objects.push(middle);
    world.objects.push(right);
    world.objects.push(left);

    let camera = new Camera(400, 200, Math.PI / 3);
    camera.transform = viewTransform(Tuple.point(0, 1.5, -5),
      Tuple.point(0, 1, 0), Tuple.vector(0, 1, 0));
    
    let canvas = camera.render(world);

    lib.writePpmFile('sphere_pattern_scene.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawGlassBall: function () {
    // Draw a transparent glass ball encompassing a bubble of air.
    let planePattern = new CheckersPattern(new Color(0.15, 0.15, 0.15), new Color(0.85, 0.85, 0.85));
    planePattern.setPatternTransform(translation(0, 0.1, 0));
    let planeMaterial = new Material().withPattern(planePattern);
    let plane = new Plane();
    plane.material = planeMaterial;
    plane.setTransform(translation(0, -10.1, 0));

    let glass = new Material().withColor(new Color(1, 1, 1)).withAmbient(0)
      .withDiffuse(0).withShininess(300).withReflective(0.9)
      .withTransparency(0.9).withRefractiveIndex(1.5);
    let glassBall = Sphere.glassSphere();
    glassBall.material = glass;
    glassBall.castsShadow = false;

    let air = new Material().withColor(new Color(1, 1, 1)).withAmbient(0)
      .withDiffuse(0).withShininess(300).withReflective(0.9)
      .withTransparency(0.9).withRefractiveIndex(1.0000034);
    let airBubble = new Sphere();
    airBubble.material = air;
    airBubble.setTransform(scaling(0.5, 0.5, 0.5));

    let world = new World();
    world.light = Light.pointLight(Tuple.point(20, 10, 0), new Color(0.9, 0.9, 0.9));
    world.objects.push(plane);
    world.objects.push(glassBall);
    world.objects.push(airBubble);

    let camera = new Camera(600, 600, 0.45);
    camera.transform = viewTransform(Tuple.point(0, 5, 0),
      Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
    
    let canvas = camera.render(world);

    lib.writePpmFile('glass_ball.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawReflectionRefraction: function () {
    // Draw a room scene featuring reflection and refraction.
    let world = new World();
    world.light = Light.pointLight(Tuple.point(-4.9, 4.9, -1), new Color(1, 1, 1));

    let floorPattern = new CheckersPattern(new Color(0.35, 0.35, 0.35), new Color(0.65, 0.65, 0.65));
    let floor = new Plane();
    floor.setTransform(rotation(0.31415, Axis.Y));
    floor.material = new Material().withPattern(floorPattern)
      .withSpecular(0).withReflective(0.4);
    world.objects.push(floor);

    let ceiling = new Plane();
    ceiling.setTransform(translation(0, 5, 0));
    ceiling.material = new Material().withColor(new Color(0.8, 0.8, 0.8))
      .withAmbient(0.3).withSpecular(0);
    world.objects.push(ceiling);

    let wallPattern = new StripedPattern(new Color(0.45, 0.45, 0.45), new Color(0.55, 0.55, 0.55));
    wallPattern.setPatternTransform(Matrix.multiply(rotation(1.5708, Axis.Y),
      scaling(0.25, 0.25, 0.25)));
    let wallMaterial = new Material().withPattern(wallPattern).withAmbient(0)
      .withDiffuse(0.4).withSpecular(0).withReflective(0.3);
    
    let westWall = new Plane();
    westWall.setTransform(Matrix.multiply(translation(-5, 0, 0), 
      Matrix.multiply(rotation(1.5708, Axis.Z), rotation(1.5708, Axis.Y))));
    westWall.material = wallMaterial;
    world.objects.push(westWall);

    let eastWall = new Plane();
    eastWall.setTransform(Matrix.multiply(translation(5, 0, 0), 
      Matrix.multiply(rotation(1.5708, Axis.Z), rotation(1.5708, Axis.Y))));
    eastWall.material = wallMaterial;
    world.objects.push(eastWall);

    let northWall = new Plane();
    northWall.setTransform(Matrix.multiply(translation(0, 0, 5), 
      rotation(1.5708, Axis.X)));
    northWall.material = wallMaterial;
    world.objects.push(northWall);

    let southWall = new Plane();
    southWall.setTransform(Matrix.multiply(translation(0, 0, -5), 
      rotation(1.5708, Axis.X)));
    southWall.material = wallMaterial;
    world.objects.push(southWall);

    // Background spheres
    let backgroundSphere1 = new Sphere();
    backgroundSphere1.setTransform(Matrix.multiply(translation(4.6, 0.4, 1),
      scaling(0.4, 0.4, 0.4)));
    backgroundSphere1.material = new Material().withColor(new Color(0.8, 0.5, 0.3))
      .withShininess(50);
    world.objects.push(backgroundSphere1);

    let backgroundSphere2 = new Sphere();
    backgroundSphere2.setTransform(Matrix.multiply(translation(4.7, 0.3, 0.4),
      scaling(0.3, 0.3, 0.3)));
    backgroundSphere2.material = new Material().withColor(new Color(0.9, 0.4, 0.5))
      .withShininess(50);
    world.objects.push(backgroundSphere2);

    let backgroundSphere3 = new Sphere();
    backgroundSphere3.setTransform(Matrix.multiply(translation(-1, 0.5, 4.5),
      scaling(0.5, 0.5, 0.5)));
    backgroundSphere3.material = new Material().withColor(new Color(0.4, 0.9, 0.6))
      .withShininess(50);
    world.objects.push(backgroundSphere3);

    let backgroundSphere4 = new Sphere();
    backgroundSphere4.setTransform(Matrix.multiply(translation(-1.7, 0.3, 4.7),
      scaling(0.3, 0.3, 0.3)));
    backgroundSphere4.material = new Material().withColor(new Color(0.4, 0.6, 0.9))
      .withShininess(50);
    world.objects.push(backgroundSphere4);

    // Foreground spheres
    let redSphere = new Sphere();
    redSphere.setTransform(translation(-0.6, 1, 0.6));
    redSphere.material = new Material().withColor(new Color(1, 0.3, 0.2))
      .withSpecular(0.4).withShininess(5);
    world.objects.push(redSphere);

    let blueSphere = new Sphere();
    blueSphere.setTransform(Matrix.multiply(translation(0.6, 0.7, -0.6),
      scaling(0.7, 0.7, 0.7)));
    blueSphere.material = new Material().withColor(new Color(0, 0, 0.2))
      .withAmbient(0).withDiffuse(0.4).withSpecular(0.9).withShininess(300)
      .withReflective(0.9).withTransparency(0.9).withRefractiveIndex(1.5);
    world.objects.push(blueSphere);

    let greenSphere = new Sphere();
    greenSphere.setTransform(Matrix.multiply(translation(-0.7, 0.5, -0.8),
      scaling(0.5, 0.5, 0.5)));
    greenSphere.material = new Material().withColor(new Color(0, 0.2, 0))
      .withAmbient(0).withDiffuse(0.4).withSpecular(0.9).withShininess(300)
      .withReflective(0.9).withTransparency(0.9).withRefractiveIndex(1.5);
    world.objects.push(greenSphere);

    let camera = new Camera(400, 200, 1.152);
    camera.transform = viewTransform(Tuple.point(-2.6, 1.5, -3.9),
      Tuple.point(-0.6, 1, -0.8), Tuple.vector(0, 1, 0));
    
    let canvas = camera.render(world);

    lib.writePpmFile('reflection_refraction.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawTableScene: function () {
    // Draw a room scene using only cubes.
    let world = new World();
    world.light = Light.pointLight(Tuple.point(0, 6.9, -5), new Color(1, 1, 0.9));

    let floorsPattern = new CheckersPattern(new Color(0, 0, 0), new Color(0.25, 0.25, 0.25));
    floorsPattern.setPatternTransform(scaling(0.07, 0.07, 0.07));
    let floors = new Cube();
    floors.setTransform(Matrix.multiply(scaling(20, 7, 20), translation(0, 1, 0)));
    floors.material = new Material().withPattern(floorsPattern).withAmbient(0.25)
      .withDiffuse(0.7).withSpecular(0).withShininess(300).withReflective(0.1);
    world.objects.push(floors);

    let wallsPattern = new CheckersPattern(new Color(0.4863, 0.3765, 0.2941), new Color(0.3725, 0.2902, 0.2275));
    wallsPattern.setPatternTransform(scaling(0.05, 20, 0.05));
    let walls = new Cube();
    walls.setTransform(scaling(10, 10, 10));
    walls.material = new Material().withPattern(wallsPattern).withAmbient(0.1)
      .withDiffuse(0.7).withSpecular(0.9).withShininess(300).withReflective(0.1);
    world.objects.push(walls);

    let tablePattern = new StripedPattern(new Color(0.5529, 0.4235, 0.3255), new Color(0.6588, 0.5098, 0.4));
    tablePattern.setPatternTransform(Matrix.multiply(scaling(0.05, 0.05, 0.05), rotation(0.1, Axis.Y)));
    let tableTop = new Cube();
    tableTop.setTransform(Matrix.multiply(translation(0, 3.1,0), scaling(3, 0.1, 2)));
    tableTop.material = new Material().withPattern(tablePattern).withAmbient(0.1)
      .withDiffuse(0.7).withSpecular(0.9).withShininess(300).withReflective(0.2);
    world.objects.push(tableTop);

    let tableLeg1 = new Cube();
    tableLeg1.setTransform(Matrix.multiply(translation(2.7, 1.5, -1.7), scaling(0.1, 1.5, 0.1)));
    tableLeg1.material = new Material().withColor(new Color(0.5529, 0.4235, 0.3255))
      .withAmbient(0.2).withDiffuse(0.7);
    world.objects.push(tableLeg1);

    let tableLeg2 = new Cube();
    tableLeg2.setTransform(Matrix.multiply(translation(2.7, 1.5, -1.7), scaling(0.1, 1.5, 0.1)));
    tableLeg2.material = new Material().withColor(new Color(0.5529, 0.4235, 0.3255))
      .withAmbient(0.2).withDiffuse(0.7);
    world.objects.push(tableLeg2);

    let tableLeg3 = new Cube();
    tableLeg3.setTransform(Matrix.multiply(translation(-2.7, 1.5, -1.7), scaling(0.1, 1.5, 0.1)));
    tableLeg3.material = new Material().withColor(new Color(0.5529, 0.4235, 0.3255))
      .withAmbient(0.2).withDiffuse(0.7);
    world.objects.push(tableLeg3);

    let tableLeg4 = new Cube();
    tableLeg4.setTransform(Matrix.multiply(translation(-2.7, 1.5, -1.7), scaling(0.1, 1.5, 0.1)));
    tableLeg4.material = new Material().withColor(new Color(0.5529, 0.4235, 0.3255))
      .withAmbient(0.2).withDiffuse(0.7);
    world.objects.push(tableLeg4);

    let glassCube = new Cube();
    glassCube.setTransform(Matrix.multiply(translation(0, 3.45001, 0),
      Matrix.multiply(rotation(0.2, Axis.Y), scaling(0.25, 0.25, 0.25))));
    glassCube.castsShadow = false;
    glassCube.material = new Material().withColor(new Color(1, 1, 0.8))
      .withAmbient(0).withDiffuse(0.3).withSpecular(0.9).withShininess(300)
      .withReflective(0.7).withTransparency(0.7).withRefractiveIndex(1.5);
    world.objects.push(glassCube);

    let littleCube1 = new Cube();
    littleCube1.setTransform(Matrix.multiply(translation(1, 3.35, -0.9),
      Matrix.multiply(rotation(-0.4, Axis.Y), scaling(0.15, 0.15, 0.15))));
    littleCube1.material = new Material().withColor(new Color(1, 0.5, 0.5))
      .withDiffuse(0.3).withReflective(0.6);
    world.objects.push(littleCube1);

    let littleCube2 = new Cube();
    littleCube2.setTransform(Matrix.multiply(translation(-1.5, 3.27, 0.3),
      Matrix.multiply(rotation(0.4, Axis.Y), scaling(0.15, 0.07, 0.15))));
    littleCube2.material = new Material().withColor(new Color(1, 1, 0.5));
    world.objects.push(littleCube2);

    let littleCube3 = new Cube();
    littleCube3.setTransform(Matrix.multiply(translation(0, 3.25, 1),
      Matrix.multiply(rotation(0.4, Axis.Y), scaling(0.2, 0.05, 0.05))));
    littleCube3.material = new Material().withColor(new Color(0.5, 1, 0.5));
    world.objects.push(littleCube3);

    let littleCube4 = new Cube();
    littleCube4.setTransform(Matrix.multiply(translation(-0.6, 3.4, 1),
      Matrix.multiply(rotation(0.8, Axis.Y), scaling(0.05, 0.2, 0.05))));
    littleCube4.material = new Material().withColor(new Color(0.5, 1, 1));
    world.objects.push(littleCube4);

    let littleCube5 = new Cube();
    littleCube5.setTransform(Matrix.multiply(translation(2, 3.4, 1),
      Matrix.multiply(rotation(0.8, Axis.Y), scaling(0.05, 0.2, 0.05))));
    littleCube5.material = new Material().withColor(new Color(0.5, 1, 1));
    world.objects.push(littleCube5);

    let frame1 = new Cube();
    frame1.setTransform(Matrix.multiply(translation(-10, 4, 1), scaling(0.05, 1, 1)));
    frame1.material = new Material().withColor(new Color(0.7098, 0.2471, 0.2196))
      .withDiffuse(0.6);
    world.objects.push(frame1);

    let frame2 = new Cube();
    frame2.setTransform(Matrix.multiply(translation(-10, 3.4, 2.7), scaling(0.05, 0.4, 0.4)));
    frame2.material = new Material().withColor(new Color(0.2667, 0.2706, 0.6902))
      .withDiffuse(0.6);
    world.objects.push(frame2);

    let frame3 = new Cube();
    frame3.setTransform(Matrix.multiply(translation(-10, 4.6, 2.7), scaling(0.05, 0.4, 0.4)));
    frame3.material = new Material().withColor(new Color(0.3098, 0.5961, 0.3098))
      .withDiffuse(0.7);
    world.objects.push(frame3);

    let mirrorFrame = new Cube();
    mirrorFrame.setTransform(Matrix.multiply(translation(-2, 3.5, 9.95), scaling(5, 1.5, 0.05)));
    mirrorFrame.material = new Material().withColor(new Color(0.3882, 0.2627, 0.1882))
      .withDiffuse(0.7);
    world.objects.push(mirrorFrame);

    let mirror = new Cube();
    mirror.setTransform(Matrix.multiply(translation(-2, 3.5, 9.95), scaling(4.8, 1.4, 0.06)));
    mirror.material = new Material().withColor(new Color(0, 0, 0)).withAmbient(0)
      .withDiffuse(0).withSpecular(1).withShininess(300).withReflective(1);
    world.objects.push(mirror);

    let camera = new Camera(400, 200, 0.785);
    camera.transform = viewTransform(Tuple.point(8, 6, -8),
      Tuple.point(0, 3, 0), Tuple.vector(0, 1, 0));
    
    let canvas = camera.render(world);

    lib.writePpmFile('table_scene.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  drawCylinderScene: function () {
    // Draw a scene featuring only cylinders.
    let world = new World();
    world.light = Light.pointLight(Tuple.point(1, 6.9, -4.9), new Color(1, 1, 1));

    let floorPattern = new CheckersPattern(new Color(0.5, 0.5, 0.5), new Color(0.75, 0.75, 0.75));
    floorPattern.setPatternTransform(Matrix.multiply(rotation(0.3, Axis.Y),
      scaling(0.25, 0.25, 0.25)));
    let floor = new Plane();
    floor.material = new Material().withPattern(floorPattern).withAmbient(0.2)
      .withDiffuse(0.9).withSpecular(0);

    world.objects.push(floor);

    let cylinder1 = new Cylinder();
    cylinder1.minimum = 0;
    cylinder1.maximum = 0.75;
    cylinder1.closed = true;
    cylinder1.setTransform(Matrix.multiply(translation(-1, 0, 1), scaling(0.5, 1, 0.5)));
    cylinder1.material = new Material().withColor(new Color(0, 0, 0.6))
      .withDiffuse(0.1).withSpecular(0.9).withShininess(300).withReflective(0.9);
    world.objects.push(cylinder1);

    // Concentric cylinders
    let cylinder2 = new Cylinder();
    cylinder2.minimum = 0;
    cylinder2.maximum = 0.2;
    cylinder2.closed = false;
    cylinder2.setTransform(Matrix.multiply(translation(1, 0, 0), scaling(0.8, 1, 0.8)));
    cylinder2.material = new Material().withColor(new Color(1, 1, 0.3))
      .withAmbient(0.1).withDiffuse(0.8).withSpecular(0.9).withShininess(300);
    world.objects.push(cylinder2);

    let cylinder3 = new Cylinder();
    cylinder3.minimum = 0;
    cylinder3.maximum = 0.3;
    cylinder3.closed = false;
    cylinder3.setTransform(Matrix.multiply(translation(1, 0, 0), scaling(0.6, 1, 0.6)));
    cylinder3.material = new Material().withColor(new Color(1, 0.9, 0.4))
      .withAmbient(0.1).withDiffuse(0.8).withSpecular(0.9).withShininess(300);
    world.objects.push(cylinder3);

    let cylinder4 = new Cylinder();
    cylinder4.minimum = 0;
    cylinder4.maximum = 0.4;
    cylinder4.closed = false;
    cylinder4.setTransform(Matrix.multiply(translation(1, 0, 0), scaling(0.4, 1, 0.4)));
    cylinder4.material = new Material().withColor(new Color(1, 0.8, 0.5))
      .withAmbient(0.1).withDiffuse(0.8).withSpecular(0.9).withShininess(300);
    world.objects.push(cylinder4);

    let cylinder5 = new Cylinder();
    cylinder5.minimum = 0;
    cylinder5.maximum = 0.5;
    cylinder5.closed = true;
    cylinder5.setTransform(Matrix.multiply(translation(1, 0, 0), scaling(0.2, 1, 0.2)));
    cylinder5.material = new Material().withColor(new Color(1, 0.7, 0.6))
      .withAmbient(0.1).withDiffuse(0.8).withSpecular(0.9).withShininess(300);
    world.objects.push(cylinder5);

    // Decorative cylinders
    let cylinder6 = new Cylinder();
    cylinder6.minimum = 0;
    cylinder6.maximum = 0.3;
    cylinder6.closed = true;
    cylinder6.setTransform(Matrix.multiply(translation(0, 0, -0.75), scaling(0.05, 1, 0.05)));
    cylinder6.material = new Material().withColor(new Color(1, 0, 0))
      .withAmbient(0.1).withDiffuse(0.9).withSpecular(0.9).withShininess(300);
    world.objects.push(cylinder6);

    let cylinder7 = new Cylinder();
    cylinder7.minimum = 0;
    cylinder7.maximum = 0.3;
    cylinder7.closed = true;
    cylinder7.setTransform(Matrix.multiply(translation(0, 0, -2.25), 
      Matrix.multiply(rotation(-0.15, Axis.Y), Matrix.multiply(translation(0, 0, 1.5), 
      scaling(0.05, 1, 0.05)))));
    cylinder7.material = new Material().withColor(new Color(1, 1, 0))
      .withAmbient(0.1).withDiffuse(0.9).withSpecular(0.9).withShininess(300);
    world.objects.push(cylinder7);

    let cylinder8 = new Cylinder();
    cylinder8.minimum = 0;
    cylinder8.maximum = 0.3;
    cylinder8.closed = true;
    cylinder8.setTransform(Matrix.multiply(translation(0, 0, -2.25), 
      Matrix.multiply(rotation(-0.3, Axis.Y), Matrix.multiply(translation(0, 0, 1.5), 
      scaling(0.05, 1, 0.05)))));
    cylinder8.material = new Material().withColor(new Color(0, 1, 0))
      .withAmbient(0.1).withDiffuse(0.9).withSpecular(0.9).withShininess(300);
    world.objects.push(cylinder8);

    let cylinder9 = new Cylinder();
    cylinder9.minimum = 0;
    cylinder9.maximum = 0.3;
    cylinder9.closed = true;
    cylinder9.setTransform(Matrix.multiply(translation(0, 0, -2.25), 
      Matrix.multiply(rotation(-0.45, Axis.Y), Matrix.multiply(translation(0, 0, 1.5), 
      scaling(0.05, 1, 0.05)))));
    cylinder9.material = new Material().withColor(new Color(0, 1, 1))
      .withAmbient(0.1).withDiffuse(0.9).withSpecular(0.9).withShininess(300);
    world.objects.push(cylinder9);

    // Glass cylinder
    let cylinder10 = new Cylinder();
    cylinder10.minimum = 0.0001;
    cylinder10.maximum = 0.5;
    cylinder10.closed = true;
    cylinder10.setTransform(Matrix.multiply(translation(0, 0, -1.5), scaling(0.33, 1, 0.33)));
    cylinder10.material = new Material().withColor(new Color(0.25, 0, 0))
      .withDiffuse(0.1).withSpecular(0.9).withShininess(300).withReflective(0.9)
      .withTransparency(0.9).withRefractiveIndex(1.5);
    world.objects.push(cylinder10);

    let camera = new Camera(400, 200, 0.314);
    camera.transform = viewTransform(Tuple.point(8, 3.5, -9),
      Tuple.point(0, 0.3, 0), Tuple.vector(0, 1, 0));
    
    let canvas = camera.render(world);

    lib.writePpmFile('cylinder_scene.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  },

  hexagonCorner: function() {
    let corner = new Sphere();
    corner.setTransform(Matrix.multiply(translation(0, 0, -1), scaling(0.25, 0.25, 0.25)));
    
    return corner;
  },

  hexagonEdge: function() {
    let edge = new Cylinder();
    edge.minimum = 0;
    edge.maximum = 1;
    edge.setTransform(Matrix.multiply(translation(0, 0, -1), 
      Matrix.multiply(rotation(-Math.PI / 6, Axis.Y), 
      Matrix.multiply(rotation(-Math.PI / 2, Axis.Z), scaling(0.25, 1, 0.25)))));
    
    return edge;
  },

  hexagonSide: function() {
    let side = new Group();
    side.addChild(this.hexagonCorner());
    side.addChild(this.hexagonEdge());

    return side;
  },

  hexagon: function() {
    let hex = new Group();

    for (let i = 0; i < 6; i++) {
      let side = this.hexagonSide();
      side.setTransform(rotation(i * (Math.PI / 3), Axis.Y));
      hex.addChild(side);
    }

    return hex;
  },

  drawHexagon: function() {
    let world = new World();
    world.light = Light.pointLight(Tuple.point(0, 10, 0), new Color(1, 1, 1));

    let hexagon = this.hexagon();
    hexagon.material = new Material().withColor(new Color(1, 0, 0));
    world.objects.push(hexagon);

    let camera = new Camera(400, 400, Math.PI / 6);
    camera.transform = viewTransform(Tuple.point(0, 3, -3),
      Tuple.point(0, 0.3, 0), Tuple.vector(0, 1, 0));
    
    let canvas = camera.render(world);

    lib.writePpmFile('hexagon.ppm', canvas);
    
    return lib.generateScreenCanvasData(canvas);
  }
}