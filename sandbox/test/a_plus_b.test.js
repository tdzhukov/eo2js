import assert from 'node:assert/strict';
import { ElegantNumber } from '../target/generated-sources/atoms.js';
import { EOapp } from '../target/generated-sources/a_plus_b.js';

describe('a_plus_b.js', function () {
  it('should return 42', function () {
    const ans = new EOapp().call(new ElegantNumber(31)).call(new ElegantNumber(11)).dataize().data();
    assert.equal(ans, 42);
  });
});
