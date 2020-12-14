const { TestScheduler } = require('jest');
const Color = require('../src/colors');
const Light = require('../src/lights');
const Tuple = require('../src/tuples');

test('A point light has a position and intensity', () => {
  let intensity = new Color(1, 1, 1);
  let position = Tuple.point(0, 0, 0);

  let light = Light.pointLight(position, intensity);

  expect(Tuple.areEqual(light.position, position)).toBeTruthy();
  expect(Color.areEqual(light.intensity, intensity)).toBeTruthy();
});