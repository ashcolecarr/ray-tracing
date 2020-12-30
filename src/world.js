'use-strict';

const Color = require('./colors');
const Intersection = require('./intersections');
const lib = require('./lib');
const Light = require('./lights');
const Ray = require('./rays');
const Sphere = require('./shapes/spheres');
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

  shadeHit(comps, remaining = 5) {
    let shadowed = this.isShadowed(comps.overPoint);

    let surface = comps.object.getMaterial().lighting(comps.object, this.light, 
      comps.overPoint, comps.eyeV, comps.normalV, shadowed);
    
    let reflected = this.reflectedColor(comps, remaining);
    let refracted = this.refractedColor(comps, remaining);

    let material = comps.object.getMaterial();
    if (material.reflective > 0 && material.transparency > 0) {
      let reflectance = Intersection.schlick(comps);

      let reflectColor = Color.multiply(reflected, reflectance);
      let refractColor = Color.multiply(refracted, (1 - reflectance));

      return Color.add(surface, Color.add(reflectColor, refractColor));
    } else {
      return Color.add(Color.add(surface, reflected), refracted);
    }
  }

  colorAt(ray, remaining = 5) {
    let intersections = this.intersectWorld(ray);
    let hit = Intersection.hit(intersections);

    if (hit === null) {
      return new Color(0, 0, 0);
    } else {
      return this.shadeHit(hit.prepareComputations(ray, intersections), remaining);
    }
  }

  isShadowed(point) {
    let v = Tuple.subtract(this.light.position, point);
    let distance = v.magnitude();
    let direction = v.normalize();

    let r = new Ray(point, direction);
    let intersections = this.intersectWorld(r);

    let h = Intersection.hit(intersections);
    if (h !== null && h.t < distance && h.object.castsShadow) {
      return true;
    } else {
      return false;
    }
  }

  reflectedColor(comps, remaining = 5) {
    if (remaining <= 0 || lib.nearEqual(comps.object.getMaterial().reflective, 0)) {
      return new Color(0, 0, 0);
    }

    let reflectRay = new Ray(comps.overPoint, comps.reflectV);
    let color = this.colorAt(reflectRay, remaining - 1);

    return Color.multiply(color, comps.object.getMaterial().reflective);
  }

  refractedColor(comps, remaining = 5) {
    if (remaining <= 0 || lib.nearEqual(comps.object.getMaterial().transparency, 0)) {
      return new Color(0, 0, 0);
    }

    let nRatio = comps.n1 / comps.n2;
    let cosI = Tuple.dot(comps.eyeV, comps.normalV);
    let sin2T = Math.pow(nRatio, 2) * (1 - Math.pow(cosI, 2));
    // Check for total internal reflection.
    if (sin2T > 1) {
      return new Color(0, 0, 0);
    }

    let cosT = Math.sqrt(1 - sin2T);
    let direction = Tuple.subtract(Tuple.multiply(comps.normalV, (nRatio * cosI - cosT)), 
      Tuple.multiply(comps.eyeV, nRatio));
    let refractRay = new Ray(comps.underPoint, direction);

    return Color.multiply(this.colorAt(refractRay, remaining - 1), 
      comps.object.material.transparency);
  }
}

module.exports = World;