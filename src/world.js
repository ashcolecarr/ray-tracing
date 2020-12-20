'use-strict';

const Color = require('./colors');
const Intersection = require('./intersections');
const Light = require('./lights');
const Ray = require('./rays');
const Sphere = require('./spheres');
const transformation = require('./transformations');
const Tuple = require('./tuples');

class World {
  constructor() {
    this.objects = [];
    this.light = null;
  }

  static defaultWorld() {
    let light = Light.pointLight(Tuple.point(-10, 10, -10), new Color(1, 1, 1));
    let sphere1 = new Sphere();
    sphere1.material.color = new Color(0.8, 1, 0.6);
    sphere1.material.diffuse = 0.7;
    sphere1.material.specular = 0.2;
    let sphere2 = new Sphere();
    sphere2.transform = transformation.scaling(0.5, 0.5, 0.5);

    let world = new World();
    world.light = light;
    world.objects.push(sphere1);
    world.objects.push(sphere2);

    return world;
  }

  intersectWorld(ray) {
    let intersections = this.objects.reduce((ints, obj) => {
      ints.push(...obj.intersect(ray));
      return ints;
    }, []);

    intersections.sort((x, y) => (x.t > y.t) ? 1 : -1);

    return intersections;
  }

  shadeHit(comps) {
    let shadowed = this.isShadowed(comps.overPoint);

    return comps.object.material.lighting(this.light, comps.point, 
      comps.eyeV, comps.normalV, shadowed);
  }

  colorAt(ray) {
    let intersections = this.intersectWorld(ray);
    let hit = Intersection.hit(intersections);

    if (hit === null) {
      return new Color(0, 0, 0);
    } else {
      return this.shadeHit(hit.prepareComputations(ray));
    }
  }

  isShadowed(point) {
    let v = Tuple.subtract(this.light.position, point);
    let distance = v.magnitude();
    let direction = v.normalize();

    let r = new Ray(point, direction);
    let intersections = this.intersectWorld(r);

    let h = Intersection.hit(intersections);
    if (h !== null && h.t < distance) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = World;