const { TestScheduler } = require('jest');
const Sequence = require('../src/sequences');

test('A number generator returns a cyclic sequence of numbers', () => {
  let gen = new Sequence(0.1, 0.5, 1);

  expect(gen.next()).toBeCloseTo(0.1);
  expect(gen.next()).toBeCloseTo(0.5);
  expect(gen.next()).toBeCloseTo(1);
  expect(gen.next()).toBeCloseTo(0.1);
});