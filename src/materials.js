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
    this.pattern = null;
    this.reflective = 0.0;
    this.transparency = 0.0;
    this.refractiveIndex = 1.0;
  }

  withColor(color) { this.color = color; return this; }
  withAmbient(ambient) { this.ambient = ambient; return this; }
  withDiffuse(diffuse) { this.diffuse = diffuse; return this; }
  withSpecular(specular) { this.specular = specular; return this; }
  withShininess(shininess) { this.shininess = shininess; return this; }
  withPattern(pattern) { this.pattern = pattern; return this; }
  withReflective(reflective) { this.reflective = reflective; return this; }
  withTransparency(transparency) { this.transparency = transparency; return this; }
  withRefractiveIndex(refractiveIndex) { this.refractiveIndex = refractiveIndex; return this; }

  static areEqual(a, b) {
    return Color.areEqual(a.color, b.color) && lib.nearEqual(a.ambient, b.ambient) && 
      lib.nearEqual(a.diffuse, b.diffuse) && lib.nearEqual(a.specular, b.specular) && 
      lib.nearEqual(a.shininess, b.shininess);
  }

  lighting(object, light, point, eyeV, normalV, intensity) {
    let color = this.pattern !== null ? 
      this.pattern.patternAtShape(object, point) : this.color;

    let effectiveColor = Color.multiply(color, light.intensity);
    let ambient = Color.multiply(effectiveColor, this.ambient);
    
    let sum = new Color(0, 0, 0);
    let samples = light.getSamples();
    for (let i = 0; i < samples.length; i++) {
      let diffuse = new Color(0, 0, 0);
      let specular = new Color(0, 0, 0);

      let lightV = Tuple.subtract(samples[i], point).normalize();
      let lightDotNormal = Tuple.dot(lightV, normalV);

      if (lightDotNormal < 0 || lib.nearEqual(intensity, 0)) {
        continue;
      }
      
      diffuse = Color.multiply(effectiveColor, this.diffuse * lightDotNormal);

      let reflectV = Tuple.negate(lightV).reflect(normalV);
      let reflectDotEye = Tuple.dot(reflectV, eyeV);
      if (reflectDotEye > 0) {
        let factor = Math.pow(reflectDotEye, this.shininess);
        specular = Color.multiply(light.intensity, this.specular * factor);
      }

      sum = Color.add(sum, diffuse);
      sum = Color.add(sum, specular);
    }

    let sumSamples = Color.divide(sum, light.samples);
    return Color.add(ambient, Color.multiply(sumSamples, intensity));
  }
}

module.exports = Material;