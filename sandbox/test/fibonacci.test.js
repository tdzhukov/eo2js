import assert from 'node:assert/strict';
import { ElegantNumber } from '../target/generated-sources/atoms.js';
import { EOfibonacci } from '../target/generated-sources/fibonacci.js';


describe('fibonacci.js', function () {
  it('should return 13', function () {
    const ans = new EOfibonacci().call(new ElegantNumber(7)).dataize().data();
    assert.equal(ans, 13);
  });
});
