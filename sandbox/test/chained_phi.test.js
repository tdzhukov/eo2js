import assert from 'node:assert/strict';
import { hook } from './capture_stream.js';
import { EOapp } from '../target/generated-sources/chained_phi.js';


describe('chained_phi.js', function () {
  it('should write to stdout "something\\n"', function () {
    new EOapp().dataize();
    assert.equal(hook.captured(), 'something\n');
  });
});
