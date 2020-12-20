'use-strict';

const Color = require('./colors');
const lib = require('./lib');
const Tuple = require('./tuples');

class Material {
  constructor() {
    this.color = new Color(1, 1, 1);
    this.ambient = 0.1;
    this.diffuse = 0.9;
    this.specular = 0.9;
    this.shininess = 200;
  }

  static areEqual(a, b) {
    return Color.areEqual(a.color, b.color) && lib.nearEqual(a.ambient, b.ambient) && 
      lib.nearEqual(a.diffuse, b.diffuse) && lib.nearEqual(a.specular, b.specular) && 
      lib.nearEqual(a.shininess, b.shininess);
  }

  lighting(light, point, eyeV, normalV, inShadow) {
    let effectiveColor = Color.multiply(this.color, light.intensity);
    let lightV = Tuple.subtract(light.position, point).normalize();
    let ambient = Color.multiply(effectiveColor, this.ambient);

    let diffuse;
    let specular;
    let lightDotNormal = Tuple.dot(lightV, normalV);
    if (lightDotNormal < 0) {
      // Less than zero means the light is occluded by the surface.
      diffuse = new Color(0, 0, 0);
      specular = new Color(0, 0, 0);
    } else {
      diffuse = Color.multiply(effectiveColor, this.diffuse * lightDotNormal);

      let reflectV = Tuple.negate(lightV).reflect(normalV);
      let reflectDotEye = Tuple.dot(reflectV, eyeV);
      if (reflectDotEye < 0 || lib.nearEqual(reflectDotEye, 0)) {
        specular = new Color(0, 0, 0);
      } else {
        let factor = Math.pow(reflectDotEye, this.shininess);
        specular = Color.multiply(light.intensity, this.specular * factor);
      }
    }

    if (inShadow) {
      return ambient;
    }

    return Color.add(ambient, Color.add(diffuse, specular));
  }
}

module.exports = Material;