import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { ElegantNumber } from '../target/generated-sources/atoms.js';
import { EOappFactorial } from '../target/generated-sources/factorial.js';


describe('factorial.js', function () {
  it('should write to stdout "4! = 24\\n"', function () {
    new EOappFactorial().call(new ElegantNumber(4)).dataize();
    assert.equal(hook.captured(), '4! = 24\n');
  });
});
